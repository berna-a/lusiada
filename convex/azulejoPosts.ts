import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./permissions";

const MAX_TEXTO = 2000;
/** Tecto de leitura por painel. Muito acima do que um painel real terá. */
const MAX_POSTS = 300;

const ORDEM = v.union(v.literal("popular"), v.literal("recente"));

/** Junta ao contributo o que o leitor precisa: autor, foto, e se já votou. */
async function paraLeitura(
  ctx: QueryCtx,
  p: Doc<"azulejo_posts">,
  userId: Id<"users"> | null
) {
  const perfil = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("user_id", p.author_id))
    .first();
  const jaVotei = userId
    ? Boolean(
        await ctx.db
          .query("azulejo_post_votos")
          .withIndex("by_post_user", (q) =>
            q.eq("post_id", p._id).eq("user_id", userId)
          )
          .first()
      )
    : false;
  return {
    _id: p._id,
    criadoEm: p._creationTime,
    body: p.body ?? null,
    imageUrl: p.image_id ? await ctx.storage.getUrl(p.image_id) : null,
    upvotes: p.upvotes,
    jaVotei,
    meu: userId === p.author_id,
    autor: {
      nome: perfil?.nome_publico ?? p.author_name ?? "Alguém",
      handle: perfil?.handle ?? null,
      avatarUrl: perfil?.avatar_id
        ? await ctx.storage.getUrl(perfil.avatar_id)
        : null,
    },
  };
}

/** O feed de um painel, por mais votado ou mais recente. */
export const listar = query({
  args: { azulejoId: v.id("azulejos"), ordem: v.optional(ORDEM) },
  handler: async (ctx, { azulejoId, ordem }) => {
    const userId = await getAuthUserId(ctx);
    const items = (
      await ctx.db
        .query("azulejo_posts")
        .withIndex("by_azulejo", (q) => q.eq("azulejo_id", azulejoId))
        .order("desc")
        .take(MAX_POSTS)
    ).filter((p) => !p.is_removed);

    // Por popularidade, o desempate é a recência — entre dois com os mesmos
    // votos, mostra-se primeiro o que chegou agora.
    if ((ordem ?? "popular") === "popular") {
      items.sort(
        (a, b) => b.upvotes - a.upvotes || b._creationTime - a._creationTime
      );
    }
    return Promise.all(items.map((p) => paraLeitura(ctx, p, userId)));
  },
});

export const contar = query({
  args: { azulejoId: v.id("azulejos") },
  handler: async (ctx, { azulejoId }) => {
    const items = await ctx.db
      .query("azulejo_posts")
      .withIndex("by_azulejo", (q) => q.eq("azulejo_id", azulejoId))
      .take(MAX_POSTS);
    return items.filter((p) => !p.is_removed).length;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão.");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const publicar = mutation({
  args: {
    azulejoId: v.id("azulejos"),
    body: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para contribuir.");
    }
    const texto = args.body?.trim().slice(0, MAX_TEXTO) ?? "";
    if (!(texto || args.imageId)) {
      throw new Error("Escreva alguma coisa ou junte uma fotografia.");
    }
    const painel = await ctx.db.get(args.azulejoId);
    if (painel?.status !== "approved") {
      throw new Error("Painel não encontrado.");
    }
    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("azulejo_posts", {
      azulejo_id: args.azulejoId,
      author_id: userId,
      author_name: user?.name ?? user?.email ?? null,
      body: texto || null,
      image_id: args.imageId ?? null,
      upvotes: 0,
    });
    return { id };
  },
});

/** Votar e desvotar são o mesmo gesto. */
export const alternarVoto = mutation({
  args: { postId: v.id("azulejo_posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para votar.");
    }
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Contributo não encontrado.");
    }
    const voto = await ctx.db
      .query("azulejo_post_votos")
      .withIndex("by_post_user", (q) =>
        q.eq("post_id", postId).eq("user_id", userId)
      )
      .first();
    if (voto) {
      await ctx.db.delete(voto._id);
      await ctx.db.patch(postId, { upvotes: Math.max(0, post.upvotes - 1) });
      return { votado: false };
    }
    await ctx.db.insert("azulejo_post_votos", {
      post_id: postId,
      user_id: userId,
    });
    await ctx.db.patch(postId, { upvotes: post.upvotes + 1 });
    return { votado: true };
  },
});

/** Apagar o que é meu. Fica escondido, não desaparece do histórico. */
export const removerMeu = mutation({
  args: { postId: v.id("azulejo_posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    const post = await ctx.db.get(postId);
    if (!post || post.author_id !== userId) {
      throw new Error("Não pode remover este contributo.");
    }
    await ctx.db.patch(postId, { is_removed: true });
  },
});

export const adminRemover = mutation({
  args: { postId: v.id("azulejo_posts") },
  handler: async (ctx, { postId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(postId, { is_removed: true });
  },
});
