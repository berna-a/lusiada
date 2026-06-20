import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAdmin, requireAdmin } from "./permissions";

const MAX_POST = 5000;

/** Contributos da discussão de um artigo, ordenados por upvotes. */
export const listPosts = query({
  args: { articleId: v.id("articles") },
  handler: async (ctx, { articleId }) => {
    const userId = await getAuthUserId(ctx);
    const posts = await ctx.db
      .query("article_posts")
      .withIndex("by_article", (q) => q.eq("article_id", articleId))
      .collect();
    const visible = posts.filter((p) => !p.is_removed);
    visible.sort(
      (a, b) => b.upvotes - a.upvotes || b._creationTime - a._creationTime
    );
    return Promise.all(
      visible.map(async (p) => {
        const mineVote = userId
          ? await ctx.db
              .query("article_post_votes")
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
          upvotes: p.upvotes,
          hasUpvoted: Boolean(mineVote),
          isMine: userId ? p.author_id === userId : false,
          isPromoted: Boolean(p.is_promoted),
        };
      })
    );
  },
});

/** Publica um contributo na discussão (ao vivo). Requer sessão. */
export const addPost = mutation({
  args: { articleId: v.id("articles"), body: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para participar.");
    }
    const body = args.body.trim();
    if (body.length < 2) {
      throw new Error("Escreva o seu contributo.");
    }
    if (body.length > MAX_POST) {
      throw new Error("O contributo é demasiado longo.");
    }
    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("article_posts", {
      article_id: args.articleId,
      author_id: userId,
      author_name: user?.name ?? user?.email ?? null,
      body,
      upvotes: 0,
    });
    return { id };
  },
});

/** Dá/retira upvote a um contributo. Requer sessão. */
export const toggleUpvote = mutation({
  args: { postId: v.id("article_posts") },
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
      .query("article_post_votes")
      .withIndex("by_post_user", (q) =>
        q.eq("post_id", postId).eq("user_id", userId)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(postId, { upvotes: Math.max(0, post.upvotes - 1) });
      return { hasUpvoted: false };
    }
    await ctx.db.insert("article_post_votes", {
      post_id: postId,
      user_id: userId,
    });
    await ctx.db.patch(postId, { upvotes: post.upvotes + 1 });
    return { hasUpvoted: true };
  },
});

/** O autor remove o seu próprio contributo. */
export const removeOwn = mutation({
  args: { postId: v.id("article_posts") },
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

/** Denuncia um contributo (uma vez por utilizador). */
export const report = mutation({
  args: { postId: v.id("article_posts"), reason: v.optional(v.string()) },
  handler: async (ctx, { postId, reason }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para denunciar.");
    }
    const already = await ctx.db
      .query("article_post_reports")
      .withIndex("by_post", (q) => q.eq("post_id", postId))
      .collect();
    if (already.some((r) => r.user_id === userId)) {
      return { ok: true };
    }
    await ctx.db.insert("article_post_reports", {
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

/* ──────────────── Admin ──────────────── */

/** Contributos denunciados, para moderação. */
export const adminReported = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    const posts = await ctx.db.query("article_posts").collect();
    const flagged = posts.filter(
      (p) => !p.is_removed && (p.report_count ?? 0) > 0
    );
    flagged.sort((a, b) => (b.report_count ?? 0) - (a.report_count ?? 0));
    return Promise.all(
      flagged.map(async (p) => {
        const article = await ctx.db.get(p.article_id);
        return {
          _id: p._id,
          body: p.body,
          authorName: p.author_name ?? null,
          reports: p.report_count ?? 0,
          articleTitle: article?.title ?? "—",
          articleSlug: article?.slug ?? null,
        };
      })
    );
  },
});

export const adminRemovePost = mutation({
  args: { postId: v.id("article_posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(postId, { is_removed: true });
  },
});

/** Ignora denúncias (mantém o contributo). */
export const adminKeepPost = mutation({
  args: { postId: v.id("article_posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(postId, { report_count: 0 });
  },
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

/**
 * Promove um contributo a conteúdo oficial: anexa-o ao corpo do artigo (com
 * atribuição) e marca-o como promovido. Apenas administradores.
 */
export const promoteToArticle = mutation({
  args: { postId: v.id("article_posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx);
    const post = await ctx.db.get(postId);
    if (!post) {
      return;
    }
    const article = await ctx.db.get(post.article_id);
    if (!article) {
      return;
    }
    const author = post.author_name ?? "Comunidade";
    const block = `<blockquote><p>${escapeHtml(post.body)}</p><p><em>— ${escapeHtml(author)}, contributo da comunidade</em></p></blockquote>`;
    await ctx.db.patch(post.article_id, { body: `${article.body}\n${block}` });
    await ctx.db.patch(postId, { is_promoted: true });
  },
});
