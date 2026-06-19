import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

/** Utilizador autenticado (ou null). */
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  return userId ? await ctx.db.get(userId) : null;
}

/** Verifica se o utilizador autenticado consta da lista de administradores. */
export async function isAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  const email = user?.email;
  if (!email) {
    return false;
  }
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
    .first();
  return Boolean(admin);
}

/** Garante que a operação é feita por um administrador (lança erro caso não). */
export async function requireAdmin(ctx: MutationCtx) {
  if (!(await isAdmin(ctx))) {
    throw new Error("Não autorizado — apenas administradores.");
  }
}
