import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Cria uma nova adesão (membro) da Associação Memória Lusíada.
 * Devolve { duplicate: true } se o email já existir.
 */
export const create = mutation({
  args: {
    full_name: v.string(),
    email: v.string(),
    district: v.string(),
    city: v.optional(v.union(v.string(), v.null())),
    how_did_you_find_us: v.optional(v.union(v.string(), v.null())),
    motivation: v.optional(v.union(v.string(), v.null())),
    newsletter_consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();

    const existing = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { duplicate: true as const };
    }

    const id = await ctx.db.insert("members", {
      full_name: args.full_name,
      email,
      district: args.district,
      city: args.city ?? null,
      how_did_you_find_us: args.how_did_you_find_us ?? null,
      motivation: args.motivation ?? null,
      newsletter_consent: args.newsletter_consent,
      country: "PT",
      status: "active",
    });

    return { duplicate: false as const, id };
  },
});
