import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, isMemberEmail, requireAdmin } from "./permissions";

const MAX_BODY = 4000;
const MIN_BODY = 2;

/** Memórias aprovadas de um herói, mais recentes primeiro. */
export const listApproved = query({
  args: { figureId: v.id("figures") },
  handler: async (ctx, { figureId }) => {
    const items = await ctx.db
      .query("contributions")
      .withIndex("by_figure_status", (q) =>
        q.eq("figure_id", figureId).eq("status", "approved")
      )
      .order("desc")
      .collect();
    return Promise.all(
      items.map(async (c) => {
        const author = await ctx.db.get(c.author_id);
        return {
          _id: c._id,
          createdAt: c._creationTime,
          authorName: c.author_name ?? null,
          authorIsMember: await isMemberEmail(ctx, author?.email),
          body: c.body,
          imageUrl: c.image_id ? await ctx.storage.getUrl(c.image_id) : null,
        };
      })
    );
  },
});

/** As memórias submetidas pelo próprio utilizador (qualquer estado). */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    const items = await ctx.db
      .query("contributions")
      .withIndex("by_author", (q) => q.eq("author_id", userId))
      .order("desc")
      .collect();
    return Promise.all(
      items.map(async (c) => {
        const figure = await ctx.db.get(c.figure_id);
        return {
          _id: c._id,
          createdAt: c._creationTime,
          status: c.status,
          body: c.body,
          imageUrl: c.image_id ? await ctx.storage.getUrl(c.image_id) : null,
          figureName: figure?.name ?? "—",
          figureSlug: figure?.slug ?? null,
        };
      })
    );
  },
});

/** Número de memórias aprovadas de um herói (para o painel do Panteão). */
export const countApproved = query({
  args: { figureId: v.id("figures") },
  handler: async (ctx, { figureId }) => {
    const items = await ctx.db
      .query("contributions")
      .withIndex("by_figure_status", (q) =>
        q.eq("figure_id", figureId).eq("status", "approved")
      )
      .collect();
    return items.length;
  },
});

/** Gera um URL de upload para a imagem. Requer sessão iniciada. */
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

/** Submete uma memória (fica pendente de aprovação). Requer sessão. */
export const submit = mutation({
  args: {
    figureId: v.id("figures"),
    body: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para partilhar uma memória.");
    }
    const body = args.body.trim();
    if (body.length < MIN_BODY) {
      throw new Error("Escreva a sua memória.");
    }
    if (body.length > MAX_BODY) {
      throw new Error("A memória é demasiado longa.");
    }
    const figure = await ctx.db.get(args.figureId);
    if (!figure) {
      throw new Error("Herói não encontrado.");
    }
    const user = await ctx.db.get(userId);
    const id = await ctx.db.insert("contributions", {
      figure_id: args.figureId,
      author_id: userId,
      author_name: user?.name ?? user?.email ?? null,
      body,
      image_id: args.imageId ?? null,
      status: "pending",
    });
    return { id };
  },
});

/* ──────────────── Admin ──────────────── */

/** Lista contributos por estado, com nome do herói e URL da imagem. */
export const adminList = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, { status }) => {
    const user = await getCurrentUser(ctx);
    const email = user?.email;
    if (!email) {
      return [];
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    if (!admin) {
      return [];
    }
    const wanted = status ?? "pending";
    const items = await ctx.db
      .query("contributions")
      .withIndex("by_status", (q) => q.eq("status", wanted))
      .order("desc")
      .collect();
    return Promise.all(
      items.map(async (c) => {
        const figure = await ctx.db.get(c.figure_id);
        return {
          _id: c._id,
          createdAt: c._creationTime,
          status: c.status,
          authorName: c.author_name ?? null,
          body: c.body,
          imageUrl: c.image_id ? await ctx.storage.getUrl(c.image_id) : null,
          figureName: figure?.name ?? "—",
          figureSlug: figure?.slug ?? null,
        };
      })
    );
  },
});

/** Conta os contributos pendentes (badge no menu). */
export const adminPendingCount = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    const email = user?.email;
    if (!email) {
      return 0;
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
      .first();
    if (!admin) {
      return 0;
    }
    const items = await ctx.db
      .query("contributions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return items.length;
  },
});

/** Aprova/rejeita/repõe um contributo. Apenas administradores. */
export const adminSetStatus = mutation({
  args: {
    id: v.id("contributions"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

/** Elimina um contributo (e a respetiva imagem). Apenas administradores. */
export const adminDelete = mutation({
  args: { id: v.id("contributions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const c = await ctx.db.get(id);
    if (c?.image_id) {
      await ctx.storage.delete(c.image_id);
    }
    await ctx.db.delete(id);
  },
});
