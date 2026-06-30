import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { getCurrentUser, isAdmin, requireAdmin } from "./permissions";

function memberByEmail(ctx: QueryCtx | MutationCtx, email: string) {
  return ctx.db
    .query("members")
    .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
    .first();
}

/**
 * Estatuto do utilizador autenticado.
 * level: "visitor" (sem login) | "adepto" | "pending" | "member".
 */
export const myMembership = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return { level: "visitor" as const, user: null, member: null };
    }
    const email = user.email ?? null;
    const member = email ? await memberByEmail(ctx, email) : null;
    const status = member?.status ?? null;
    let level: "member" | "approved" | "pending" | "adepto";
    if (status === "active") {
      level = "member";
    } else if (status === "approved") {
      level = "approved";
    } else if (status === "pending") {
      level = "pending";
    } else {
      level = "adepto";
    }
    return {
      level,
      user: {
        name: user.name ?? null,
        email,
        image: user.image ?? null,
      },
      member: member
        ? {
            full_name: member.full_name,
            status: member.status ?? null,
            quota_paid: member.quota_paid ?? false,
            district: member.district ?? null,
          }
        : null,
    };
  },
});

/** Pedido de adesão como sócio (requer sessão). Fica pendente de aprovação. */
export const requestMembership = mutation({
  args: {
    full_name: v.string(),
    district: v.string(),
    city: v.optional(v.string()),
    how_did_you_find_us: v.optional(v.string()),
    motivation: v.optional(v.string()),
    newsletter_consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão para aderir.");
    }
    const user = await ctx.db.get(userId);
    const email = user?.email?.toLowerCase();
    if (!email) {
      throw new Error("A sua conta não tem um email válido.");
    }
    const full_name = args.full_name.trim();
    if (full_name.length < 3) {
      throw new Error("Indique o seu nome completo.");
    }

    const existing = await memberByEmail(ctx, email);
    if (existing?.status === "active") {
      return { status: "active" as const };
    }

    const fields = {
      full_name,
      user_id: userId,
      district: args.district,
      city: args.city?.trim() || null,
      how_did_you_find_us: args.how_did_you_find_us ?? null,
      motivation: args.motivation?.trim() || null,
      newsletter_consent: args.newsletter_consent,
      status: "pending",
    };

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { status: "pending" as const };
    }
    await ctx.db.insert("members", {
      ...fields,
      email,
      country: "PT",
      quota_paid: false,
    });
    return { status: "pending" as const };
  },
});

/* ──────────────── Admin ──────────────── */

export const adminListMembers = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("active"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, { status }) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    const wanted = status ?? "pending";
    const members = await ctx.db
      .query("members")
      .withIndex("by_status", (q) => q.eq("status", wanted))
      .order("desc")
      .collect();
    return members.map((m) => ({
      _id: m._id,
      createdAt: m._creationTime,
      full_name: m.full_name,
      email: m.email,
      district: m.district ?? null,
      motivation: m.motivation ?? null,
      status: m.status ?? null,
      quota_paid: m.quota_paid ?? false,
    }));
  },
});

export const adminPendingMembersCount = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return 0;
    }
    const pending = await ctx.db
      .query("members")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return pending.length;
  },
});

export const adminSetMemberStatus = mutation({
  args: {
    id: v.id("members"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("active"),
      v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const adminSetQuotaPaid = mutation({
  args: { id: v.id("members"), quota_paid: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { quota_paid: args.quota_paid });
  },
});

/* ──────────────── Stripe (interno) ──────────────── */

/** Membro do utilizador autenticado — para a ação de checkout. */
export const memberForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    const email = user?.email?.toLowerCase();
    if (!email) {
      return null;
    }
    const member = await memberByEmail(ctx, email);
    if (!member) {
      return null;
    }
    return {
      memberId: member._id,
      email,
      fullName: member.full_name,
      status: member.status ?? null,
      stripeCustomerId: member.stripe_customer_id ?? null,
    };
  },
});

/** Marca a quota como paga e ativa o sócio (chamado pelo webhook Stripe). */
export const markPaid = internalMutation({
  args: {
    memberId: v.string(),
    customerId: v.optional(v.string()),
    subscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("members", args.memberId);
    if (!id) {
      return;
    }
    await ctx.db.patch(id, {
      status: "active",
      quota_paid: true,
      stripe_customer_id: args.customerId ?? null,
      stripe_subscription_id: args.subscriptionId ?? null,
      subscription_status: args.subscriptionStatus ?? "active",
    });
  },
});

/** Subscrição terminada/cancelada — sócio deixa de estar ativo. */
export const markUnpaid = internalMutation({
  args: {
    memberId: v.string(),
    subscriptionStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("members", args.memberId);
    if (!id) {
      return;
    }
    await ctx.db.patch(id, {
      status: "approved",
      quota_paid: false,
      subscription_status: args.subscriptionStatus ?? "canceled",
    });
  },
});
