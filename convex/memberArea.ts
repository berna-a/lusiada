import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { isAdmin, isMember, requireAdmin } from "./permissions";

/** Sócio activo ou admin — os únicos com acesso ao portal. */
async function canAccessPortal(ctx: Parameters<typeof isMember>[0]) {
  return (await isMember(ctx)) || (await isAdmin(ctx));
}

// ── Documentos ────────────────────────────────────────────────────────

/** Documentos publicados, com URL de download (sócios/admins). */
export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    if (!(await canAccessPortal(ctx))) {
      return [];
    }
    const docs = await ctx.db
      .query("member_documents")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
    docs.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return await Promise.all(
      docs.map(async (d) => ({
        _id: d._id,
        title: d.title,
        description: d.description ?? null,
        category: d.category,
        url: await ctx.storage.getUrl(d.file_id),
      }))
    );
  },
});

/** Lista completa para o painel de administração. */
export const adminListDocuments = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    const docs = await ctx.db.query("member_documents").collect();
    docs.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return docs;
  },
});

/** URL de upload para o storage (apenas admins). */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const adminAddDocument = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const title = args.title.trim();
    if (title.length < 2) {
      throw new Error("Indique o título do documento.");
    }
    const existing = await ctx.db.query("member_documents").collect();
    return await ctx.db.insert("member_documents", {
      title,
      description: args.description?.trim() || null,
      category: args.category,
      file_id: args.fileId,
      display_order: existing.length,
      is_published: true,
    });
  },
});

export const adminSetDocumentPublished = mutation({
  args: { id: v.id("member_documents"), is_published: v.boolean() },
  handler: async (ctx, { id, is_published }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { is_published });
  },
});

export const adminRemoveDocument = mutation({
  args: { id: v.id("member_documents") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const doc = await ctx.db.get(id);
    if (doc) {
      await ctx.storage.delete(doc.file_id);
      await ctx.db.delete(id);
    }
  },
});

// ── Encontros ─────────────────────────────────────────────────────────

/** Encontros publicados, ordenados por data (sócios/admins). */
export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    if (!(await canAccessPortal(ctx))) {
      return [];
    }
    const events = await ctx.db
      .query("member_events")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
    events.sort((a, b) => a.date.localeCompare(b.date));
    return events.map((e) => ({
      _id: e._id,
      title: e.title,
      description: e.description ?? null,
      date: e.date,
      time: e.time ?? null,
      location: e.location ?? null,
      link: e.link ?? null,
    }));
  },
});

/** Lista completa para o painel de administração. */
export const adminListEvents = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    const events = await ctx.db.query("member_events").collect();
    events.sort((a, b) => a.date.localeCompare(b.date));
    return events;
  },
});

const RE_ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const adminAddEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    date: v.string(),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const title = args.title.trim();
    if (title.length < 2) {
      throw new Error("Indique o título do encontro.");
    }
    if (!RE_ISO_DATE.test(args.date)) {
      throw new Error("Data inválida — use o formato AAAA-MM-DD.");
    }
    return await ctx.db.insert("member_events", {
      title,
      description: args.description?.trim() || null,
      date: args.date,
      time: args.time?.trim() || null,
      location: args.location?.trim() || null,
      link: args.link?.trim() || null,
      is_published: true,
    });
  },
});

export const adminSetEventPublished = mutation({
  args: { id: v.id("member_events"), is_published: v.boolean() },
  handler: async (ctx, { id, is_published }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(id, { is_published });
  },
});

export const adminRemoveEvent = mutation({
  args: { id: v.id("member_events") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    await ctx.db.delete(id);
  },
});
