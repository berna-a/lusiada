/**
 * Aviso de uma só vez a quem já tem conta na Lusíada: agora também podem
 * entrar com a Conta AOS, usando o mesmo email — nada muda no perfil, é
 * só mais uma porta. `aos_convite_enviado_em` garante que cada pessoa só
 * recebe este email uma vez, mesmo que a acção seja corrida outra vez.
 */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

const REMETENTE = "Memória Lusíada <ola@alusiada.pt>";
const LOTE = 50;

export const contarPendentes = internalQuery({
  args: {},
  handler: async (ctx) => {
    const perfis = await ctx.db.query("profiles").collect();
    return perfis.filter((p) => !p.aos_convite_enviado_em).length;
  },
});

export const proximoLoteInterno = internalQuery({
  args: {},
  handler: async (ctx) => {
    const perfis = (await ctx.db.query("profiles").collect())
      .filter((p) => !p.aos_convite_enviado_em)
      .slice(0, LOTE);
    const comEmail: { id: string; nome: string; email: string }[] = [];
    for (const p of perfis) {
      const user = await ctx.db.get(p.user_id);
      if (user?.email) {
        comEmail.push({ id: p._id, nome: p.nome_publico, email: user.email });
      }
    }
    return comEmail;
  },
});

export const marcarEnviadoInterno = internalMutation({
  args: { id: v.id("profiles") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      aos_convite_enviado_em: new Date().toISOString(),
    });
  },
});

/** Envia até LOTE emails por chamada. Corre outra vez para continuar o resto. */
export const enviarConvitesAos = internalAction({
  args: {},
  handler: async (
    ctx
  ): Promise<{ enviados: number; falhas: number; restantes: number }> => {
    const chave = process.env.AUTH_RESEND_KEY;
    if (!chave) {
      throw new Error("Falta a AUTH_RESEND_KEY — não envio nada.");
    }

    const lote: { id: string; nome: string; email: string }[] =
      await ctx.runQuery(internal.migracaoAos.proximoLoteInterno, {});

    let enviados = 0;
    let falhas = 0;

    for (const perfil of lote) {
      const html = `
        <div style="font-family: sans-serif; color: #1a1a1a;">
          <p>Olá ${perfil.nome},</p>
          <p>A tua conta na Memória Lusíada continua exactamente igual — mas agora tens mais uma forma de entrar: com a <strong>Conta AOS</strong>, usando este mesmo email.</p>
          <p>Não muda nada no teu perfil. É só mais rápido, se já usas a Conta AOS noutro lado.</p>
          <p><a href="https://alusiada.pt/entrar">Entra</a> e experimenta o botão "Entrar com conta AOS".</p>
        </div>
      `;
      try {
        const resposta = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${chave}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: REMETENTE,
            to: [perfil.email],
            subject: "Já podes entrar com a Conta AOS",
            html,
          }),
        });
        if (resposta.ok) {
          await ctx.runMutation(internal.migracaoAos.marcarEnviadoInterno, {
            id: perfil.id as never,
          });
          enviados++;
        } else {
          falhas++;
          console.error(
            "Falha ao enviar convite AOS:",
            perfil.email,
            await resposta.text()
          );
        }
      } catch (err) {
        falhas++;
        console.error("Erro ao contactar Resend:", err);
      }
    }

    const restantes: number = await ctx.runQuery(
      internal.migracaoAos.contarPendentes,
      {}
    );
    return { enviados, falhas, restantes };
  },
});
