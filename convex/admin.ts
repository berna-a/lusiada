import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser, isAdmin, requireAdmin } from "./permissions";

/** Perfil do utilizador autenticado + se é administrador. */
export const me = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return null;
    }
    return {
      email: user.email ?? null,
      name: user.name ?? null,
      image: user.image ?? null,
      isAdmin: await isAdmin(ctx),
    };
  },
});

/** Lista de administradores (apenas visível a administradores). */
export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    if (!(await isAdmin(ctx))) {
      return [];
    }
    return await ctx.db.query("admins").collect();
  },
});

export const addAdmin = mutation({
  args: { email: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const email = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (existing) {
      return { id: existing._id };
    }
    const id = await ctx.db.insert("admins", { email, name: args.name });
    return { id };
  },
});

/** Bootstrap dos administradores iniciais. Correr: npx convex run admin:seedAdmins */
export const seedAdmins = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Nota: o Google OAuth devolve sempre o email PRINCIPAL no login. Como
    // `admin@alusiada.pt` é alias de `bernardo@alusiada.pt`, é este último que
    // tem de constar para o login funcionar.
    const emails = [
      "bernardo@abreu.me",
      "bernardo@alusiada.pt",
      "admin@alusiada.pt",
    ];
    for (const email of emails) {
      const exists = await ctx.db
        .query("admins")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();
      if (!exists) {
        await ctx.db.insert("admins", { email });
      }
    }
  },
});
