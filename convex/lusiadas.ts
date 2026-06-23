import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAdmin, requireAdmin } from "./permissions";

const ROMANS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Descrição legível de um target ("c1:e3:v2" → "Canto I · estrofe 3 · verso 2"). */
function describeTarget(t: string): string {
  if (t === "epic") {
    return "A obra inteira";
  }
  const c = t.match(/^c(\d+)/)?.[1];
  const e = t.match(/:e(\d+)/)?.[1];
  const vrs = t.match(/:v(\d+)/)?.[1];
  const w = t.match(/:w-(.+)$/)?.[1];
  const parts: string[] = [];
  if (c) {
    parts.push(`Canto ${ROMANS[Number(c)] ?? c}`);
  }
  if (e) {
    parts.push(`estrofe ${e}`);
  }
  if (vrs) {
    parts.push(`verso ${vrs}`);
  }
  if (w) {
    parts.push(`«${w}»`);
  }
  return parts.join(" · ") || t;
}

const MAX_POST = 5000;
const MAX_EXCERPT = 600;

/** Anotações/comentários de uma unidade (target), ordenados por votos. */
export const listByTarget = query({
  args: { target: v.string() },
  handler: async (ctx, { target }) => {
    const userId = await getAuthUserId(ctx);
    const posts = await ctx.db
      .query("lusiadas_posts")
      .withIndex("by_target", (q) => q.eq("target", target))
      .collect();
    const visible = posts.filter((p) => !p.is_removed);
    visible.sort(
      (a, b) => b.upvotes - a.upvotes || b._creationTime - a._creationTime
    );
    return Promise.all(
      visible.map(async (p) => {
        const mineVote = userId
          ? await ctx.db
              .query("lusiadas_post_votes")
              .withIndex("by_post_user", (q) =>
                q.eq("post_id", p._id).eq("user_id", userId)
              )
              .first()
          : null;
        return {
          _id: p._id,
          createdAt: p._creationTime,
          authorName: p.author_name ?? null,
          body: p.body,
          excerpt: p.excerpt ?? null,
          upvotes: p.upvotes,
          hasUpvoted: Boolean(mineVote),
          isMine: userId ? p.author_id === userId : false,
        };
      })
    );
  },
});

/** Contagem de anotações por target dentro de um canto (para os marcadores). */
export const countsByCanto = query({
  args: { canto: v.number() },
  handler: async (ctx, { canto }) => {
    const posts = await ctx.db
      .query("lusiadas_posts")
      .withIndex("by_canto", (q) => q.eq("canto", canto))
      .collect();
    const counts: Record<string, number> = {};
    for (const p of posts) {
      if (!p.is_removed) {
        counts[p.target] = (counts[p.target] ?? 0) + 1;
      }
    }
    return counts;
  },
});

/** Publica uma anotação/comentário numa unidade. Requer sessão. */
export const addPost = mutation({
  args: {
    target: v.string(),
    canto: v.number(),
    body: v.string(),
    excerpt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para anotar.");
    }
    const body = args.body.trim();
    if (body.length < 2) {
      throw new Error("Escreva a sua anotação.");
    }
    if (body.length > MAX_POST) {
      throw new Error("A anotação é demasiado longa.");
    }
    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("lusiadas_posts", {
      target: args.target,
      canto: args.canto,
      author_id: userId,
      author_name: user?.name ?? user?.email ?? null,
      body,
      excerpt: args.excerpt?.trim().slice(0, MAX_EXCERPT) || null,
      upvotes: 0,
    });
    return { id };
  },
});

/** Dá/retira voto a uma anotação. Requer sessão. */
export const toggleUpvote = mutation({
  args: { postId: v.id("lusiadas_posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para votar.");
    }
    const post = await ctx.db.get(postId);
    if (!post) {
      return { hasUpvoted: false };
    }
    const existing = await ctx.db
      .query("lusiadas_post_votes")
      .withIndex("by_post_user", (q) =>
        q.eq("post_id", postId).eq("user_id", userId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(postId, { upvotes: Math.max(0, post.upvotes - 1) });
      return { hasUpvoted: false };
    }
    await ctx.db.insert("lusiadas_post_votes", {
      post_id: postId,
      user_id: userId,
    });
    await ctx.db.patch(postId, { upvotes: post.upvotes + 1 });
    return { hasUpvoted: true };
  },
});

/** O autor remove a sua própria anotação. */
export const removeOwn = mutation({
  args: { postId: v.id("lusiadas_posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão.");
    }
    const post = await ctx.db.get(postId);
    if (post && post.author_id === userId) {
      await ctx.db.patch(postId, { is_removed: true });
    }
  },
});

/** Denuncia uma anotação (uma vez por utilizador). */
export const report = mutation({
  args: { postId: v.id("lusiadas_posts"), reason: v.optional(v.string()) },
  handler: async (ctx, { postId, reason }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para denunciar.");
    }
    const already = await ctx.db
      .query("lusiadas_post_reports")
      .withIndex("by_post", (q) => q.eq("post_id", postId))
      .collect();
    if (already.some((r) => r.user_id === userId)) {
      return { ok: true };
    }
    await ctx.db.insert("lusiadas_post_reports", {
      post_id: postId,
      user_id: userId,
      reason: reason?.trim() || null,
    });
    const post = await ctx.db.get(postId);
    if (post) {
      await ctx.db.patch(postId, {
        report_count: (post.report_count ?? 0) + 1,
      });
    }
    return { ok: true };
  },
});

/** Admin remove uma anotação denunciada. */
export const adminRemovePost = mutation({
  args: { postId: v.id("lusiadas_posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(postId, { is_removed: true });
  },
});

/** Ignora as denúncias de uma anotação (mantém-na). */
export const adminKeepPost = mutation({
  args: { postId: v.id("lusiadas_posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(postId, { report_count: 0 });
  },
});

/** Anotações d'Os Lusíadas denunciadas, para moderação. */
export const adminReported = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    const posts = await ctx.db.query("lusiadas_posts").collect();
    const flagged = posts.filter(
      (p) => !p.is_removed && (p.report_count ?? 0) > 0
    );
    flagged.sort((a, b) => (b.report_count ?? 0) - (a.report_count ?? 0));
    return flagged.map((p) => ({
      _id: p._id,
      body: p.body,
      authorName: p.author_name ?? null,
      reports: p.report_count ?? 0,
      where: describeTarget(p.target),
    }));
  },
});
