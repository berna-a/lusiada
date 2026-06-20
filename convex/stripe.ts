import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";

// Valores da quota (cêntimos, EUR). Mode-agnostic: o modo (teste/live) segue a
// STRIPE_SECRET_KEY. Trocar a chave por sk_live passa tudo a produção.
const PLANS = {
  month: { unit_amount: 250, label: "Quota de Sócio (mensal)" },
  year: { unit_amount: 2500, label: "Quota de Sócio (anual)" },
} as const;

/**
 * Cria uma sessão de Stripe Checkout (subscrição) para o sócio aprovado pagar
 * a quota. Devolve o URL para onde o frontend redireciona.
 */
export const createCheckoutSession = action({
  args: { interval: v.union(v.literal("month"), v.literal("year")) },
  handler: async (ctx, { interval }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("É preciso iniciar sessão.");
    }
    const member = await ctx.runQuery(internal.memberships.memberForUser, {
      userId,
    });
    if (!member) {
      throw new Error("Ainda não tem um pedido de adesão.");
    }
    if (member.status !== "approved" && member.status !== "active") {
      throw new Error("A sua adesão ainda não foi aprovada pela Direcção.");
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      throw new Error("Pagamentos ainda não configurados (STRIPE_SECRET_KEY).");
    }
    const siteUrl = process.env.SITE_URL ?? "https://www.alusiada.pt";
    const plan = PLANS[interval];

    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("customer_email", member.email);
    params.set("success_url", `${siteUrl}/conta?pagamento=sucesso`);
    params.set("cancel_url", `${siteUrl}/conta?pagamento=cancelado`);
    params.set("line_items[0][quantity]", "1");
    params.set("line_items[0][price_data][currency]", "eur");
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(plan.unit_amount)
    );
    params.set("line_items[0][price_data][recurring][interval]", interval);
    params.set("line_items[0][price_data][product_data][name]", plan.label);
    params.set("metadata[member_id]", member.memberId);
    params.set("subscription_data[metadata][member_id]", member.memberId);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const session = await res.json();
    if (!res.ok) {
      throw new Error(
        session?.error?.message ?? "Não foi possível iniciar o pagamento."
      );
    }
    return { url: session.url as string };
  },
});
