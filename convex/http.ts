import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

/** Verifica a assinatura do webhook Stripe (esquema v1, HMAC-SHA256). */
async function verifyStripeSignature(
  payload: string,
  sigHeader: string | null,
  secret: string
) {
  if (!sigHeader) {
    return false;
  }
  const parts: Record<string, string> = {};
  for (const piece of sigHeader.split(",")) {
    const idx = piece.indexOf("=");
    if (idx > 0) {
      parts[piece.slice(0, idx)] = piece.slice(idx + 1);
    }
  }
  const timestamp = parts.t;
  const expectedSig = parts.v1;
  if (!(timestamp && expectedSig)) {
    return false;
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${timestamp}.${payload}`)
  );
  const computed = [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === expectedSig;
}

const stripeWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Webhook não configurado.", { status: 500 });
  }
  const payload = await request.text();
  const valid = await verifyStripeSignature(
    payload,
    request.headers.get("stripe-signature"),
    secret
  );
  if (!valid) {
    return new Response("Assinatura inválida.", { status: 400 });
  }

  const event = JSON.parse(payload);
  const obj = event?.data?.object ?? {};
  const memberId: string | undefined = obj?.metadata?.member_id;

  if (event.type === "checkout.session.completed" && memberId) {
    await ctx.runMutation(internal.memberships.markPaid, {
      memberId,
      customerId: typeof obj.customer === "string" ? obj.customer : undefined,
      subscriptionId:
        typeof obj.subscription === "string" ? obj.subscription : undefined,
      subscriptionStatus: "active",
    });
  } else if (event.type === "customer.subscription.deleted" && memberId) {
    await ctx.runMutation(internal.memberships.markUnpaid, {
      memberId,
      subscriptionStatus: obj.status ?? "canceled",
    });
  }

  return new Response("ok", { status: 200 });
});

http.route({ path: "/stripe/webhook", method: "POST", handler: stripeWebhook });

export default http;
