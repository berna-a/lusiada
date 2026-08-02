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
    // Capa por URL (ex.: imagem de domínio público alojada em /public).
    cover_image_url: v.optional(v.union(v.string(), v.null())),
    image_credit: v.optional(v.union(v.string(), v.null())),
    // Grafias alternativas (ex.: ortografia oficial) — para descoberta nas
    // pesquisas de quem usa a grafia antiga. Mostradas e em alternateName.
    aliases: v.optional(v.array(v.string())),
    // Proveniência do conteúdo (indicador interno IA vs Humano).
    // "ai" | "human" | "mixed". Permite medir % e migrar para humano.
    authorship: v.optional(v.string()),
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

  // ─── Os Lusíadas: anotações/comentários da comunidade (100% humano) ───
  // target: "epic" | "c1" | "c1:e3" | "c1:e3:v2"  (obra/canto/estrofe/verso).
  // canto: número do canto (0 = obra inteira) — para contagens por canto.
  lusiadas_posts: defineTable({
    target: v.string(),
    canto: v.number(),
    author_id: v.id("users"),
    author_name: v.optional(v.union(v.string(), v.null())),
    body: v.string(),
    // Excerto citado (palavra/verso/passagem seleccionada), quando aplicável.
    excerpt: v.optional(v.union(v.string(), v.null())),
    // "note" (anotação, default) | "sense" (paráfrase em português moderno).
    kind: v.optional(v.string()),
    // Paráfrase oficial validada por um curador/professor.
    is_verified: v.optional(v.boolean()),
    upvotes: v.number(),
    is_removed: v.optional(v.boolean()),
    report_count: v.optional(v.number()),
  })
    .index("by_target", ["target"])
    .index("by_canto", ["canto"])
    .index("by_author", ["author_id"]),

  lusiadas_post_votes: defineTable({
    post_id: v.id("lusiadas_posts"),
    user_id: v.id("users"),
  })
    .index("by_post_user", ["post_id", "user_id"])
    .index("by_user", ["user_id"]),

  lusiadas_post_reports: defineTable({
    post_id: v.id("lusiadas_posts"),
    user_id: v.id("users"),
    reason: v.optional(v.union(v.string(), v.null())),
  }).index("by_post", ["post_id"]),

  // Léxico de grafias — dicionário relacional Portuguez ↔ AO90 ↔ pré-AO90.
  // Master editável (futura base do laboratório da ARCA). Exportado para o
  // bundle do motor de conversão. status: "approved" | "proposed".
  lexicon: defineTable({
    pz: v.string(),
    ao: v.string(),
    pre: v.string(),
    kind: v.string(), // "z" | "consoante" | "acento" | "mes" | "nome"
    case_exact: v.optional(v.boolean()),
    status: v.optional(v.string()),
  })
    .index("by_pz", ["pz"])
    .index("by_status", ["status"]),

  // ── Portal de Sócios ────────────────────────────────────────────────
  // Documentos da associação (estatutos, actas, manifesto…), visíveis
  // apenas a sócios activos. O ficheiro vive no storage do Convex.
  member_documents: defineTable({
    title: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    category: v.string(), // "estatutos" | "atas" | "institucional" | "outros"
    file_id: v.id("_storage"),
    display_order: v.optional(v.number()),
    is_published: v.optional(v.boolean()),
  }).index("by_published", ["is_published"]),

  // Encontros de sócios (agenda reservada do portal).
  member_events: defineTable({
    title: v.string(),
    description: v.optional(v.union(v.string(), v.null())),
    date: v.string(), // ISO "YYYY-MM-DD"
    time: v.optional(v.union(v.string(), v.null())), // "HH:MM"
    location: v.optional(v.union(v.string(), v.null())),
    link: v.optional(v.union(v.string(), v.null())),
    is_published: v.optional(v.boolean()),
  })
    .index("by_published", ["is_published"])
    .index("by_date", ["date"]),

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

  // Perfil público de quem tem conta.
  //
  // Fica à parte da tabela `users` (que é do sistema de autenticação e não se
  // deve tocar) e à parte de `members` (que é a inscrição de sócio, com quotas
  // e estado). Uma pessoa pode ter perfil sem ser sócia — é o «titular de
  // conta».
  profiles: defineTable({
    user_id: v.id("users"),
    /** Identificador curto para o endereço público: /u/<handle>. */
    handle: v.string(),
    nome_publico: v.string(),
    bio: v.optional(v.union(v.string(), v.null())),
    concelho: v.optional(v.union(v.string(), v.null())),
    avatar_id: v.optional(v.union(v.id("_storage"), v.null())),
    /** Fotografia de capa, larga, no topo do perfil. */
    capa_id: v.optional(v.union(v.id("_storage"), v.null())),
    /** Falso enquanto a pessoa não tiver passado pelas boas-vindas. */
    onboarding_feito: v.optional(v.boolean()),
    /** Quem esconde o perfil deixa de aparecer em /u/<handle>. */
    perfil_privado: v.optional(v.boolean()),
  })
    .index("by_handle", ["handle"])
    .index("by_user", ["user_id"]),

  // Painéis azulejares registados pela comunidade.
  // A unidade é o PAINEL — o conjunto contínuo encomendado de uma vez
  // (quase sempre a fachada de um prédio), não a peça nem o edifício.
  azulejos: defineTable({
    // --- Bloco 1: o que se vê. Obrigatório, qualquer pessoa consegue. ---
    lat: v.number(),
    lng: v.number(),
    /** Precisão do GPS em metros, tal como o telemóvel a reportou. */
    gps_accuracy: v.optional(v.union(v.number(), v.null())),
    morada: v.optional(v.union(v.string(), v.null())),
    concelho: v.optional(v.union(v.string(), v.null())),
    image_id: v.id("_storage"),
    estado: v.union(
      v.literal("integro"),
      v.literal("danificado"),
      v.literal("em_risco"),
      v.literal("desaparecido")
    ),

    // --- Bloco 2: o que se sabe. Opcional, fica «por confirmar». ---
    padrao: v.optional(v.union(v.string(), v.null())),
    epoca: v.optional(v.union(v.string(), v.null())),
    oficina: v.optional(v.union(v.string(), v.null())),
    autor: v.optional(v.union(v.string(), v.null())),
    /** Falso enquanto ninguém com competência validar o bloco 2. */
    historia_confirmada: v.optional(v.boolean()),

    // --- Autoria e moderação ---
    author_id: v.id("users"),
    author_name: v.optional(v.union(v.string(), v.null())),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
  })
    .index("by_status", ["status"])
    .index("by_author", ["author_id"])
    .index("by_concelho_status", ["concelho", "status"]),

  // O feed de um painel: fotografias e memórias de quem lá passou.
  // Um contributo tem de trazer fotografia, texto, ou os dois.
  azulejo_posts: defineTable({
    azulejo_id: v.id("azulejos"),
    author_id: v.id("users"),
    author_name: v.optional(v.union(v.string(), v.null())),
    body: v.optional(v.union(v.string(), v.null())),
    image_id: v.optional(v.union(v.id("_storage"), v.null())),
    /** Contagem desnormalizada, para ordenar sem contar votos a cada leitura. */
    upvotes: v.number(),
    is_removed: v.optional(v.boolean()),
    report_count: v.optional(v.number()),
  })
    .index("by_azulejo", ["azulejo_id"])
    .index("by_author", ["author_id"]),

  azulejo_post_votos: defineTable({
    post_id: v.id("azulejo_posts"),
    user_id: v.id("users"),
  })
    .index("by_post_user", ["post_id", "user_id"])
    .index("by_user", ["user_id"]),
});
