import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

export const inscreverInternal = internalMutation({
  args: {
    nome: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("cep_waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { duplicate: true };
    }

    await ctx.db.insert("cep_waitlist", {
      nome: args.nome.trim(),
      email,
    });

    return { duplicate: false };
  },
});

export const inscrever = action({
  args: {
    nome: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const res = await ctx.runMutation(internal.cep.inscreverInternal, {
      nome: args.nome,
      email: args.email,
    });

    if (res.duplicate) {
      return { success: true, message: "Já estavas inscrito!" };
    }

    const chave = process.env.AUTH_RESEND_KEY;
    if (chave) {
      const email = args.email.toLowerCase().trim();
      const nome = args.nome.trim();

      const html = `
        <div style="font-family: sans-serif; color: #1a1a1a;">
          <p>Olá ${nome},</p>
          <p>A tua conta foi criada com sucesso.</p>
          <p><strong>O Portal do Clube Eclético Portuguez será lançado no dia 5 de Agosto de 2026, às 17:00.</strong></p>
          <p>Serás notificado por este mesmo email assim que as portas abrirem.</p>
          <p><em>Acta Non Verba,</em><br/>O Clube.</p>
        </div>
      `;

      try {
        const fetchRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${chave}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Clube Eclético Portuguez <clube@portuguez.pt>",
            to: [email],
            subject: "A tua conta no CEP",
            html,
          }),
        });

        if (!fetchRes.ok) {
          console.error(
            "Erro ao enviar email no Resend:",
            await fetchRes.text()
          );
        }
      } catch (err) {
        console.error("Falha ao contactar Resend:", err);
      }
    } else {
      console.warn("Falta a AUTH_RESEND_KEY no Convex — email não enviado.");
    }

    return { success: true };
  },
});
