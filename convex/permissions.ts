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

/** Verifica se um email corresponde a um sócio ativo (adesão aprovada). */
export async function isMemberEmail(
  ctx: QueryCtx | MutationCtx,
  email: string | null | undefined
) {
  if (!email) {
    return false;
  }
  const member = await ctx.db
    .query("members")
    .withIndex("by_email", (q) => q.eq("email", email.toLowerCase()))
    .first();
  return member?.status === "active";
}

/** Verifica se o utilizador autenticado é sócio ativo. */
export async function isMember(ctx: QueryCtx | MutationCtx) {
  const user = await getCurrentUser(ctx);
  return await isMemberEmail(ctx, user?.email);
}

/** Garante que a operação é feita por um sócio ativo. */
export async function requireMember(ctx: MutationCtx) {
  if (!(await isMember(ctx))) {
    throw new Error("Não autorizado — apenas sócios.");
  }
}
