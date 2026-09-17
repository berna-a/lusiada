import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, requireAdmin } from "./permissions";
import {
  assertIntegerCents,
  assertText,
  EMAIL_RE,
  normalizeSlug,
  PROJECT_LIMITS,
  SUPPORT_WINDOW_MS,
  sumConfirmed,
  validateNeeds,
} from "./projectRules";

const statusValidator = v.union(
  v.literal("preparing"),
  v.literal("funding"),
  v.literal("funded"),
  v.literal("completed")
);
const updateValidator = v.object({
  title: v.string(),
  body: v.string(),
  publishedAt: v.number(),
});

function publicDto(project: Doc<"funded_projects">, confirmedCents: number) {
  return {
    slug: project.slug,
    title: project.title,
    eyebrow: project.eyebrow ?? null,
    summary: project.summary,
    description: project.description,
    coverImageUrl: project.cover_image_url ?? null,
    status: project.status,
    goalCents: project.goal_cents,
    currency: "EUR" as const,
    budgetNote: project.budget_note ?? null,
    materialNeeds: project.material_needs,
    technicalNeeds: project.technical_needs,
    volunteerNeeds: project.volunteer_needs,
    updates: project.updates.map((item) => ({
      title: item.title,
      body: item.body,
      publishedAt: item.published_at,
    })),
    confirmedCents,
  };
}

async function confirmedFor(ctx: QueryCtx, projectId: Id<"funded_projects">) {
  const rows = await ctx.db
    .query("project_contributions")
    .withIndex("by_project", (q) => q.eq("project_id", projectId))
    .collect();
  return sumConfirmed(rows);
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("funded_projects")
      .withIndex("by_published", (q) => q.eq("is_published", true))
      .collect();
    return await Promise.all(
      projects.map(async (project) =>
        publicDto(project, await confirmedFor(ctx, project._id))
      )
    );
  },
});

export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const project = await ctx.db
      .query("funded_projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!project?.is_published) {
      return null;
    }
    return publicDto(project, await confirmedFor(ctx, project._id));
  },
});

export const expressSupport = mutation({
  args: {
    projectSlug: v.string(),
    name: v.string(),
    email: v.string(),
    supportType: v.union(
      v.literal("financial"),
      v.literal("material"),
      v.literal("technical"),
      v.literal("volunteer")
    ),
    message: v.string(),
    amountCents: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.projectSlug);
    const name = assertText(args.name, "Nome", 2, 120);
    const email = args.email.trim().toLowerCase();
    if (email.length > 255 || !EMAIL_RE.test(email)) {
      throw new Error("Email inválido.");
    }
    const message = assertText(args.message, "Mensagem", 10, 2000);
    if (args.amountCents !== undefined) {
      assertIntegerCents(args.amountCents, PROJECT_LIMITS.contributionCents);
    }
    const project = await ctx.db
      .query("funded_projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!project?.is_published || project.status === "completed") {
      throw new Error("Projecto indisponível.");
    }
    const recent = await ctx.db
      .query("project_support_intents")
      .withIndex("by_project_email_created", (q) =>
        q
          .eq("project_slug", slug)
          .eq("email", email)
          .gt("_creationTime", Date.now() - SUPPORT_WINDOW_MS)
      )
      .first();
    if (recent) {
      throw new Error(
        "Já recebemos uma intenção recente deste endereço. Tente mais tarde."
      );
    }
    return await ctx.db.insert("project_support_intents", {
      project_id: project._id,
      project_slug: slug,
      name,
      email,
      support_type: args.supportType,
      message,
      amount_cents: args.amountCents ?? null,
      status: "new",
    });
  },
});

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user?.email) {
      return null;
    }
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", user.email!.toLowerCase()))
      .first();
    if (!admin) {
      return null;
    }
    const [projects, intents, contributions] = await Promise.all([
      ctx.db.query("funded_projects").order("desc").collect(),
      ctx.db.query("project_support_intents").order("desc").collect(),
      ctx.db.query("project_contributions").order("desc").collect(),
    ]);
    return {
      projects: projects.map((p) => ({
        ...p,
        updates: p.updates.map((u) => ({
          title: u.title,
          body: u.body,
          publishedAt: u.published_at,
        })),
      })),
      intents,
      contributions,
    };
  },
});

export const adminSave = mutation({
  args: {
    id: v.optional(v.id("funded_projects")),
    slug: v.string(),
    title: v.string(),
    eyebrow: v.optional(v.string()),
    summary: v.string(),
    description: v.string(),
    coverImageUrl: v.optional(v.string()),
    goalCents: v.number(),
    status: statusValidator,
    budgetNote: v.optional(v.string()),
    materialNeeds: v.array(v.string()),
    technicalNeeds: v.array(v.string()),
    volunteerNeeds: v.array(v.string()),
    updates: v.array(updateValidator),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const slug = normalizeSlug(args.slug);
    const duplicate = await ctx.db
      .query("funded_projects")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (duplicate && duplicate._id !== args.id) {
      throw new Error("Este endereço já existe.");
    }
    if (args.coverImageUrl && !/^(https:\/\/|\/)/.test(args.coverImageUrl)) {
      throw new Error(
        "A capa deve usar HTTPS ou um asset local iniciado por /."
      );
    }
    if (args.updates.length > PROJECT_LIMITS.updates) {
      throw new Error("Demasiadas actualizações.");
    }
    const now = Date.now();
    if (
      args.updates.some(
        (item) =>
          !Number.isSafeInteger(item.publishedAt) ||
          item.publishedAt < 0 ||
          item.publishedAt > now + 5 * 60 * 1000
      )
    ) {
      throw new Error("Data de actualização inválida.");
    }
    const value = {
      slug,
      title: assertText(args.title, "Título", 3, PROJECT_LIMITS.title),
      eyebrow: args.eyebrow ? assertText(args.eyebrow, "Chapéu", 2, 80) : null,
      summary: assertText(args.summary, "Resumo", 10, PROJECT_LIMITS.summary),
      description: assertText(
        args.description,
        "Descrição",
        20,
        PROJECT_LIMITS.description
      ),
      cover_image_url: args.coverImageUrl
        ? assertText(args.coverImageUrl, "Capa", 1, PROJECT_LIMITS.coverUrl)
        : null,
      status: args.status,
      goal_cents: assertIntegerCents(
        args.goalCents,
        PROJECT_LIMITS.goalCents,
        true
      ),
      currency: "EUR" as const,
      budget_note: args.budgetNote
        ? assertText(args.budgetNote, "Orçamento", 2, PROJECT_LIMITS.budgetNote)
        : null,
      material_needs: validateNeeds(args.materialNeeds),
      technical_needs: validateNeeds(args.technicalNeeds),
      volunteer_needs: validateNeeds(args.volunteerNeeds),
      updates: args.updates.map((u) => ({
        title: assertText(
          u.title,
          "Título da actualização",
          2,
          PROJECT_LIMITS.updateTitle
        ),
        body: assertText(u.body, "Actualização", 10, PROJECT_LIMITS.updateBody),
        published_at: u.publishedAt,
      })),
      is_published: args.isPublished,
      updated_at: now,
    };
    if (args.id) {
      const current = await ctx.db.get(args.id);
      if (!current) {
        throw new Error("Projecto não encontrado.");
      }
      await ctx.db.patch(args.id, value);
      return args.id;
    }
    return await ctx.db.insert("funded_projects", value);
  },
});

export const adminConfirmContribution = mutation({
  args: {
    projectId: v.id("funded_projects"),
    amountCents: v.number(),
    provider: v.string(),
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado.");
    }
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Projecto não encontrado.");
    }
    const reference = assertText(
      args.reference,
      "Referência",
      2,
      PROJECT_LIMITS.reference
    );
    const existing = await ctx.db
      .query("project_contributions")
      .withIndex("by_project_reference", (q) =>
        q.eq("project_id", args.projectId).eq("provider_reference", reference)
      )
      .unique();
    if (existing) {
      if (existing.revoked_at) {
        throw new Error(
          "Esta referência pertence a um recebimento revogado. Use uma nova referência para preservar o histórico."
        );
      }
      const amountCents = assertIntegerCents(
        args.amountCents,
        PROJECT_LIMITS.contributionCents
      );
      const provider = assertText(
        args.provider,
        "Origem",
        2,
        PROJECT_LIMITS.provider
      );
      if (
        existing.amount_cents !== amountCents ||
        existing.provider !== provider
      ) {
        throw new Error(
          "A referência já existe com outro valor ou origem. Confirme os dados."
        );
      }
      return existing._id;
    }
    return await ctx.db.insert("project_contributions", {
      project_id: args.projectId,
      amount_cents: assertIntegerCents(
        args.amountCents,
        PROJECT_LIMITS.contributionCents
      ),
      currency: "EUR",
      provider: assertText(args.provider, "Origem", 2, PROJECT_LIMITS.provider),
      provider_reference: reference,
      confirmed_at: Date.now(),
      created_by: userId,
      revoked_at: null,
      revoked_by: null,
    });
  },
});

export const adminRevokeContribution = mutation({
  args: { id: v.id("project_contributions") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autorizado.");
    }
    const row = await ctx.db.get(id);
    if (!row) {
      throw new Error("Recebimento não encontrado.");
    }
    if (!row.revoked_at) {
      await ctx.db.patch(id, { revoked_at: Date.now(), revoked_by: userId });
    }
  },
});
export const adminSetIntentStatus = mutation({
  args: {
    id: v.id("project_support_intents"),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("closed")
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});
