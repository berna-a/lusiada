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
          kind: p.kind === "sense" ? "sense" : "note",
          verified: Boolean(p.is_verified),
          upvotes: p.upvotes,
          hasUpvoted: Boolean(mineVote),
          isMine: userId ? p.author_id === userId : false,
        };
      })
    );
  },
});

/** As anotações/sentidos do próprio utilizador (para o Perfil). Vazio se não autenticado. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const posts = await ctx.db
      .query("lusiadas_posts")
      .withIndex("by_author", (q) => q.eq("author_id", userId))
      .collect();
    return posts
      .filter((p) => !p.is_removed)
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 100)
      .map((p) => ({
        _id: p._id,
        target: p.target,
        canto: p.canto,
        label: describeTarget(p.target),
        body: p.body,
        excerpt: p.excerpt ?? null,
        kind: p.kind === "sense" ? "sense" : "note",
        verified: Boolean(p.is_verified),
        upvotes: p.upvotes,
        createdAt: p._creationTime,
      }));
  },
});

/** Atividade recente da comunidade — últimas anotações/sentidos em toda a obra. */
export const recentActivity = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("lusiadas_posts").order("desc").take(60);
    return posts
      .filter((p) => !p.is_removed)
      .slice(0, 40)
      .map((p) => ({
        _id: p._id,
        target: p.target,
        canto: p.canto,
        label: describeTarget(p.target),
        authorName: p.author_name ?? null,
        body: p.body,
        excerpt: p.excerpt ?? null,
        kind: p.kind === "sense" ? "sense" : "note",
        verified: Boolean(p.is_verified),
        upvotes: p.upvotes,
        createdAt: p._creationTime,
      }));
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

/** Publica uma anotação ou paráfrase ("sense") numa unidade. Requer sessão. */
export const addPost = mutation({
  args: {
    target: v.string(),
    canto: v.number(),
    body: v.string(),
    excerpt: v.optional(v.string()),
    kind: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para contribuir.");
    }
    const body = args.body.trim();
    if (body.length < 2) {
      throw new Error("Escreva o seu contributo.");
    }
    if (body.length > MAX_POST) {
      throw new Error("O contributo é demasiado longo.");
    }
    const kind = args.kind === "sense" ? "sense" : "note";
    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("lusiadas_posts", {
      target: args.target,
      canto: args.canto,
      author_id: userId,
      author_name: user?.name ?? user?.email ?? null,
      body,
      excerpt: args.excerpt?.trim().slice(0, MAX_EXCERPT) || null,
      kind,
      upvotes: 0,
    });
    return { id };
  },
});

/** Paráfrase escolhida por estrofe de um canto (verificada > mais votada). */
export const sensesByCanto = query({
  args: { canto: v.number() },
  handler: async (ctx, { canto }) => {
    const posts = await ctx.db
      .query("lusiadas_posts")
      .withIndex("by_canto", (q) => q.eq("canto", canto))
      .collect();
    const senses = posts.filter((p) => p.kind === "sense" && !p.is_removed);
    const best: Record<
      string,
      { body: string; authorName: string | null; verified: boolean; score: number }
    > = {};
    for (const p of senses) {
      const score = (p.is_verified ? 1e9 : 0) + p.upvotes;
      const cur = best[p.target];
      if (!cur || score > cur.score) {
        best[p.target] = {
          body: p.body,
          authorName: p.author_name ?? null,
          verified: Boolean(p.is_verified),
          score,
        };
      }
    }
    const out: Record<
      string,
      { body: string; authorName: string | null; verified: boolean }
    > = {};
    for (const [k, v2] of Object.entries(best)) {
      out[k] = { body: v2.body, authorName: v2.authorName, verified: v2.verified };
    }
    return out;
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

/** Admin valida (ou retira) uma paráfrase como oficial. */
export const adminVerifySense = mutation({
  args: { postId: v.id("lusiadas_posts"), verified: v.boolean() },
  handler: async (ctx, { postId, verified }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(postId, { is_verified: verified });
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
