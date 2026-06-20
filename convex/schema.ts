import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Esquema da base de dados Convex da Associação Memória Lusíada.
 *
 * Migrado do Supabase. O Convex gere automaticamente o `_id` e o
 * `_creationTime` de cada documento, pelo que as antigas colunas
 * `id` / `created_at` deixam de ser necessárias.
 */
export default defineSchema({
  // Tabelas de autenticação (Convex Auth)
  ...authTables,

  // Lista de administradores autorizados (por email)
  admins: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // Membros (adesões). status: "pending" | "active" | "rejected".
  // user_id liga a adesão à conta (login Google); quota_paid confirma a quota.
  members: defineTable({
    full_name: v.string(),
    email: v.string(),
    user_id: v.optional(v.union(v.id("users"), v.null())),
    district: v.optional(v.string()),
    city: v.optional(v.union(v.string(), v.null())),
    how_did_you_find_us: v.optional(v.union(v.string(), v.null())),
    motivation: v.optional(v.union(v.string(), v.null())),
    newsletter_consent: v.boolean(),
    events_consent: v.optional(v.boolean()),
    country: v.optional(v.string()),
    // status: "pending" | "approved" (elegível, a aguardar pagamento) |
    // "active" (sócio pago) | "rejected".
    status: v.optional(v.string()),
    quota_paid: v.optional(v.boolean()),
    stripe_customer_id: v.optional(v.union(v.string(), v.null())),
    stripe_subscription_id: v.optional(v.union(v.string(), v.null())),
    subscription_status: v.optional(v.union(v.string(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    birth_year: v.optional(v.union(v.number(), v.null())),
    email_verified: v.optional(v.boolean()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Figuras / Heróis (Panteão)
  figures: defineTable({
    name: v.string(),
    slug: v.string(),
    epithet: v.optional(v.union(v.string(), v.null())),
    category: v.optional(v.union(v.string(), v.null())),
    era: v.optional(v.union(v.string(), v.null())),
    birth_year: v.optional(v.union(v.string(), v.null())),
    death_year: v.optional(v.union(v.string(), v.null())),
    portrait_url: v.optional(v.union(v.string(), v.null())),
    hero_image_url: v.optional(v.union(v.string(), v.null())),
    // URL de um modelo 3D (.glb/.gltf) para a estátua no Panteão. Se ausente,
    // usa-se a estátua estilizada por defeito.
    model_url: v.optional(v.union(v.string(), v.null())),
    attributes: v.optional(v.array(v.string())),
    display_order: v.optional(v.number()),
    is_published: v.optional(v.boolean()),
    is_figure_of_year: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["is_published"]),

  // Blocos de conteúdo das figuras
  figure_content_blocks: defineTable({
    figure_id: v.id("figures"),
    block_type: v.string(),
    title: v.optional(v.union(v.string(), v.null())),
    content: v.optional(v.union(v.string(), v.null())),
    image_url: v.optional(v.union(v.string(), v.null())),
    image_caption: v.optional(v.union(v.string(), v.null())),
    attribution: v.optional(v.union(v.string(), v.null())),
    display_order: v.number(),
  }).index("by_figure", ["figure_id"]),

  // Obras literárias
  works: defineTable({
    title: v.string(),
    slug: v.string(),
    author_figure_id: v.optional(v.union(v.id("figures"), v.null())),
    author_name: v.optional(v.union(v.string(), v.null())),
    description: v.optional(v.union(v.string(), v.null())),
    content_markdown: v.optional(v.union(v.string(), v.null())),
    cover_image_url: v.optional(v.union(v.string(), v.null())),
    external_url: v.optional(v.union(v.string(), v.null())),
    publication_year: v.optional(v.union(v.string(), v.null())),
    display_order: v.optional(v.number()),
    is_published: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),

  // Páginas de conteúdo (CMS)
  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    subtitle: v.optional(v.union(v.string(), v.null())),
    content_markdown: v.optional(v.union(v.string(), v.null())),
    hero_image_url: v.optional(v.union(v.string(), v.null())),
    meta_description: v.optional(v.union(v.string(), v.null())),
    meta_keywords: v.optional(v.union(v.string(), v.null())),
    display_order: v.optional(v.number()),
    is_published: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),

  // Memórias submetidas pela comunidade
  memories: defineTable({
    title: v.optional(v.union(v.string(), v.null())),
    content: v.optional(v.union(v.string(), v.null())),
    memory_type: v.optional(v.union(v.string(), v.null())),
    submitter_email: v.string(),
    submitter_name: v.optional(v.union(v.string(), v.null())),
    member_id: v.optional(v.union(v.id("members"), v.null())),
    related_location: v.optional(v.union(v.string(), v.null())),
    related_period: v.optional(v.union(v.string(), v.null())),
    attachments_urls: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    is_public: v.optional(v.boolean()),
  }).index("by_status", ["status"]),

  // Contributos da comunidade ao Panteão — memórias/poemas por herói.
  // Submetidos por utilizadores autenticados, publicados após aprovação.
  contributions: defineTable({
    figure_id: v.id("figures"),
    author_id: v.id("users"),
    author_name: v.optional(v.union(v.string(), v.null())),
    body: v.string(),
    image_id: v.optional(v.union(v.id("_storage"), v.null())),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  })
    .index("by_figure_status", ["figure_id", "status"])
    .index("by_status", ["status"])
    .index("by_author", ["author_id"]),

  // Lusopédia — artigos (enciclopédia da lusofonia).
  // status: "pending" (proposto) | "published" | "rejected".
  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    summary: v.optional(v.union(v.string(), v.null())),
    body: v.string(), // HTML do editor visual (esquema controlado)
    cover_image_id: v.optional(v.union(v.id("_storage"), v.null())),
    infobox: v.optional(
      v.array(v.object({ label: v.string(), value: v.string() }))
    ),
    sources: v.optional(
      v.array(
        v.object({
          label: v.string(),
          url: v.optional(v.union(v.string(), v.null())),
        })
      )
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("published"),
      v.literal("rejected")
    ),
    author_id: v.optional(v.union(v.id("users"), v.null())),
    // Liga o artigo a um herói do Panteão (integração faseada).
    pantheon_slug: v.optional(v.union(v.string(), v.null())),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_category_status", ["category", "status"]),

  // Edições propostas a artigos publicados (pendentes de aprovação).
  article_revisions: defineTable({
    article_id: v.id("articles"),
    author_id: v.optional(v.union(v.id("users"), v.null())),
    note: v.optional(v.union(v.string(), v.null())),
    title: v.string(),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    summary: v.optional(v.union(v.string(), v.null())),
    body: v.string(),
    cover_image_id: v.optional(v.union(v.id("_storage"), v.null())),
    infobox: v.optional(
      v.array(v.object({ label: v.string(), value: v.string() }))
    ),
    sources: v.optional(
      v.array(
        v.object({
          label: v.string(),
          url: v.optional(v.union(v.string(), v.null())),
        })
      )
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  })
    .index("by_status", ["status"])
    .index("by_article", ["article_id"]),

  // Discussão por artigo — contributos planos (estilo Quora), ao vivo.
  article_posts: defineTable({
    article_id: v.id("articles"),
    author_id: v.id("users"),
    author_name: v.optional(v.union(v.string(), v.null())),
    body: v.string(),
    upvotes: v.number(),
    is_removed: v.optional(v.boolean()),
    is_promoted: v.optional(v.boolean()),
    report_count: v.optional(v.number()),
  }).index("by_article", ["article_id"]),

  // Votos (upvote único por utilizador por contributo).
  article_post_votes: defineTable({
    post_id: v.id("article_posts"),
    user_id: v.id("users"),
  })
    .index("by_post_user", ["post_id", "user_id"])
    .index("by_user", ["user_id"]),

  // Denúncias de contributos (para moderação).
  article_post_reports: defineTable({
    post_id: v.id("article_posts"),
    user_id: v.id("users"),
    reason: v.optional(v.union(v.string(), v.null())),
  }).index("by_post", ["post_id"]),

  // Doações
  donations: defineTable({
    donor_email: v.string(),
    donor_name: v.optional(v.union(v.string(), v.null())),
    display_name: v.optional(v.union(v.string(), v.null())),
    donor_message: v.optional(v.union(v.string(), v.null())),
    amount_cents: v.number(),
    currency: v.string(),
    member_id: v.optional(v.union(v.id("members"), v.null())),
    affected_figure_id: v.optional(v.union(v.id("figures"), v.null())),
    payment_method: v.optional(v.union(v.string(), v.null())),
    payment_status: v.optional(v.union(v.string(), v.null())),
    stripe_charge_id: v.optional(v.union(v.string(), v.null())),
    stripe_payment_intent_id: v.optional(v.union(v.string(), v.null())),
    is_public: v.optional(v.boolean()),
    receipt_sent: v.optional(v.boolean()),
  }).index("by_email", ["donor_email"]),

  // Mensagens do formulário de contacto
  contact_messages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.union(v.string(), v.null())),
    message: v.string(),
    status: v.optional(v.string()),
  }).index("by_email", ["email"]),
});
