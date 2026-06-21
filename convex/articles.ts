import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser, isAdmin, requireAdmin } from "./permissions";

const MAX_BODY = 60_000;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(ctx: MutationCtx, base: string) {
  const root = base || "artigo";
  let slug = root;
  let n = 2;
  while (
    await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first()
  ) {
    slug = `${root}-${n}`;
    n += 1;
  }
  return slug;
}

const contentArgs = {
  title: v.string(),
  category: v.string(),
  tags: v.optional(v.array(v.string())),
  summary: v.optional(v.string()),
  body: v.string(),
  coverImageId: v.optional(v.id("_storage")),
  infobox: v.optional(
    v.array(v.object({ label: v.string(), value: v.string() }))
  ),
  sources: v.optional(
    v.array(v.object({ label: v.string(), url: v.optional(v.string()) }))
  ),
};

async function coverUrlOf(ctx: QueryCtx, article: Doc<"articles">) {
  if (article.cover_image_url) {
    return article.cover_image_url;
  }
  return article.cover_image_id
    ? await ctx.storage.getUrl(article.cover_image_id)
    : null;
}

async function withCover(ctx: QueryCtx, article: Doc<"articles">) {
  return {
    ...article,
    coverUrl: await coverUrlOf(ctx, article),
  };
}

/** Lista artigos publicados (com pesquisa e filtro por categoria). */
export const list = query({
  args: { category: v.optional(v.string()), search: v.optional(v.string()) },
  handler: async (ctx, { category, search }) => {
    const all = category
      ? await ctx.db
          .query("articles")
          .withIndex("by_category_status", (q) =>
            q.eq("category", category).eq("status", "published")
          )
          .collect()
      : await ctx.db
          .query("articles")
          .withIndex("by_status", (q) => q.eq("status", "published"))
          .collect();
    const term = search?.trim().toLowerCase();
    const filtered = term
      ? all.filter((a) =>
          [a.title, a.summary ?? "", (a.tags ?? []).join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(term)
        )
      : all;
    filtered.sort((a, b) => a.title.localeCompare(b.title, "pt"));
    return Promise.all(
      filtered.map(async (a) => ({
        _id: a._id,
        title: a.title,
        slug: a.slug,
        category: a.category,
        summary: a.summary ?? null,
        tags: a.tags ?? [],
        coverUrl: await coverUrlOf(ctx, a),
      }))
    );
  },
});

/** Artigo por slug. Publicado para todos; pendente só para autor/admin. */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const article = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!article) {
      return null;
    }
    if (article.status !== "published") {
      const userId = await getAuthUserId(ctx);
      const admin = await isAdmin(ctx);
      const isAuthor = userId && article.author_id === userId;
      if (!(admin || isAuthor)) {
        return null;
      }
    }
    return await withCover(ctx, article);
  },
});

/** Artigo da Lusopédia ligado a um herói do Panteão (por pantheon_slug). */
export const byPantheonSlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const published = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const found = published.find((a) => a.pantheon_slug === slug);
    return found ? { slug: found.slug, title: found.title } : null;
  },
});

/** Gera URL de upload para imagens do artigo. Requer sessão. */
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

/** URL público de uma imagem carregada (para inserir no editor). */
export const imageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => await ctx.storage.getUrl(storageId),
});

/** Cria um artigo (fica pendente de aprovação). Requer sessão. */
export const create = mutation({
  args: contentArgs,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para criar um artigo.");
    }
    const title = args.title.trim();
    if (title.length < 2) {
      throw new Error("Indique o título do artigo.");
    }
    if (args.body.length > MAX_BODY) {
      throw new Error("O artigo é demasiado longo.");
    }
    const slug = await uniqueSlug(ctx, slugify(title));
    const id = await ctx.db.insert("articles", {
      title,
      slug,
      category: args.category,
      tags: args.tags ?? [],
      summary: args.summary?.trim() || null,
      body: args.body,
      cover_image_id: args.coverImageId ?? null,
      infobox: args.infobox ?? [],
      sources: args.sources ?? [],
      status: "pending",
      author_id: userId,
    });
    return { id, slug };
  },
});

/** Propõe uma edição a um artigo existente (fica pendente). Requer sessão. */
export const proposeEdit = mutation({
  args: {
    articleId: v.id("articles"),
    note: v.optional(v.string()),
    ...contentArgs,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para propor uma edição.");
    }
    const article = await ctx.db.get(args.articleId);
    if (!article) {
      throw new Error("Artigo não encontrado.");
    }
    await ctx.db.insert("article_revisions", {
      article_id: args.articleId,
      author_id: userId,
      note: args.note?.trim() || null,
      title: args.title.trim(),
      category: args.category,
      tags: args.tags ?? [],
      summary: args.summary?.trim() || null,
      body: args.body,
      cover_image_id: args.coverImageId ?? null,
      infobox: args.infobox ?? [],
      sources: args.sources ?? [],
      status: "pending",
    });
    return { ok: true };
  },
});

/* ──────────────── Admin ──────────────── */

/** Artigos e edições pendentes, para moderação. */
export const adminPending = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return { articles: [], edits: [] };
    }
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const revisions = await ctx.db
      .query("article_revisions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const edits = await Promise.all(
      revisions.map(async (r) => {
        const article = await ctx.db.get(r.article_id);
        return {
          _id: r._id,
          createdAt: r._creationTime,
          articleTitle: article?.title ?? "—",
          articleSlug: article?.slug ?? null,
          title: r.title,
          note: r.note ?? null,
        };
      })
    );
    return {
      articles: articles.map((a) => ({
        _id: a._id,
        createdAt: a._creationTime,
        title: a.title,
        slug: a.slug,
        category: a.category,
        summary: a.summary ?? null,
      })),
      edits,
    };
  },
});

/** Conta artigos + edições pendentes (badge). */
export const adminPendingCount = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return 0;
    }
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    const revisions = await ctx.db
      .query("article_revisions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return articles.length + revisions.length;
  },
});

export const adminSetArticleStatus = mutation({
  args: {
    id: v.id("articles"),
    status: v.union(
      v.literal("pending"),
      v.literal("published"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

/** Aprova uma edição: aplica ao artigo e marca a revisão como aprovada. */
export const adminApproveEdit = mutation({
  args: { revisionId: v.id("article_revisions") },
  handler: async (ctx, { revisionId }) => {
    await requireAdmin(ctx);
    const rev = await ctx.db.get(revisionId);
    if (!rev) {
      return;
    }
    await ctx.db.patch(rev.article_id, {
      title: rev.title,
      category: rev.category,
      tags: rev.tags ?? [],
      summary: rev.summary ?? null,
      body: rev.body,
      cover_image_id: rev.cover_image_id ?? null,
      infobox: rev.infobox ?? [],
      sources: rev.sources ?? [],
      status: "published",
    });
    await ctx.db.patch(revisionId, { status: "approved" });
  },
});

export const adminRejectEdit = mutation({
  args: { revisionId: v.id("article_revisions") },
  handler: async (ctx, { revisionId }) => {
    await requireAdmin(ctx);
    await ctx.db.patch(revisionId, { status: "rejected" });
  },
});

/** Cria/atualiza diretamente um artigo publicado (admin). Para seeds/curadoria. */
export const adminUpsert = mutation({
  args: {
    slug: v.string(),
    pantheonSlug: v.optional(v.string()),
    ...contentArgs,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const user = await getCurrentUser(ctx);
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    const fields = {
      title: args.title.trim(),
      category: args.category,
      tags: args.tags ?? [],
      summary: args.summary?.trim() || null,
      body: args.body,
      cover_image_id: args.coverImageId ?? null,
      infobox: args.infobox ?? [],
      sources: args.sources ?? [],
      status: "published" as const,
      pantheon_slug: args.pantheonSlug ?? null,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { id: existing._id, slug: args.slug };
    }
    const id = await ctx.db.insert("articles", {
      ...fields,
      slug: args.slug,
      author_id: user?._id ?? null,
    });
    return { id, slug: args.slug };
  },
});

/** Seed: artigo da Lusopédia para Luiz Vaz de Camões (ligado ao Panteão). */
export const seedCamoes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const slug = "luiz-vaz-de-camoes";
    const body = `
<p>Luiz Vaz de Camões (c. 1525–1580) é o maior poeta da língua portugueza e autor de <em>Os Lusíadas</em>, a epopeia da nação. A sua obra deu forma definitiva ao portuguez e ofereceu a um pequeno país à beira-mar um lugar entre as grandes literaturas do mundo.</p>
<h2>Vida</h2>
<p>Terá nascido a 23 de Janeiro de 1525, em Lisboa, durante um eclipse solar. Cortesão caído em desgraça, soldado em Ceuta — onde perdeu o olho direito — e viajante por todo o Oriente portuguez, de Goa a Macau, naufragou na foz do rio Mekong, onde a tradição diz ter salvo a nado o manuscrito da sua obra maior.</p>
<h2>Os Lusíadas</h2>
<p>Publicada em 1572, em dez cantos, canta a viagem de Vasco da Gama à Índia e, com ela, toda a história e o destino de Portugal. Nela convivem a mitologia clássica e a fé cristã, a geografia dos Descobrimentos e a reflexão sobre a glória e a decadência dos povos.</p>
<h2>Legado</h2>
<p>Morreu a 10 de Junho de 1580 — data que Portugal escolheu para o seu dia nacional. Tornou-se símbolo da própria identidade portugueza, e é por isso que a Associação Memória Lusíada o tem por patrono.</p>
`.trim();
    const fields = {
      title: "Luiz Vaz de Camões",
      category: "Pessoas",
      tags: ["poesia", "Os Lusíadas", "patrono"],
      summary:
        "Príncipe dos poetas e autor de Os Lusíadas — a voz que deu forma à língua portugueza.",
      body,
      cover_image_id: null,
      cover_image_url: "/lusopedia/luiz-vaz-de-camoes.webp",
      image_credit: "Wikimedia Commons",
      infobox: [
        { label: "Nascimento", value: "c. 1525, Lisboa" },
        { label: "Morte", value: "10 de Junho de 1580" },
        { label: "Época", value: "Século XVI" },
        { label: "Área", value: "Poesia épica e lírica" },
      ],
      sources: [{ label: "Os Lusíadas (1572)", url: null }],
      status: "published" as const,
      pantheon_slug: slug,
    };
    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { id: existing._id };
    }
    const id = await ctx.db.insert("articles", {
      ...fields,
      slug,
      author_id: null,
    });
    return { id };
  },
});
