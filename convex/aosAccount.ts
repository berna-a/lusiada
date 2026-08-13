/**
 * "Entrar com conta AOS" — a Lusíada continua dona da sua base de dados;
 * só pede ao AOS que confirme quem é a pessoa.
 *
 * O percurso: EntrarPage manda a pessoa para o AOS (/entrar/lusiada) com um
 * `state` opaco; o AOS devolve-a a /conta/callback com um código de uso
 * único; `trocarCodigo` troca esse código pela identidade (nome, email,
 * email verificado) em POST /v1/identity/exchange, autenticado com uma
 * chave de organização (AOS_IDENTITY_API_KEY) com scope `identity:read` e
 * portal "lusiada" — nunca com sessão de utilizador.
 *
 * Um email não verificado do lado do AOS é recusado aqui — nunca se liga
 * uma conta por uma palavra do próprio pedido.
 */
import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

// A instância viva do AOS — "staging" é só o nome da branch; é este o
// deployment que serve tudo hoje (ver AOS/CLAUDE.md).
const AOS_BASE_URL = "https://staging.aos.ardo.vc";
const TOKEN_TTL_MS = 2 * 60 * 1000;

type IdentidadeAos = {
  name: string | null;
  email: string;
  emailVerified: boolean;
};

export const trocarCodigo = action({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const chave = process.env.AOS_IDENTITY_API_KEY;
    if (!chave) {
      throw new Error("A ligação à conta AOS ainda não está configurada.");
    }

    const resposta = await fetch(`${AOS_BASE_URL}/v1/identity/exchange`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: args.code }),
    });
    if (!resposta.ok) {
      throw new Error("Não foi possível confirmar a tua conta AOS.");
    }
    const identidade = (await resposta.json()) as IdentidadeAos;
    if (!identidade.emailVerified) {
      throw new Error(
        "Confirma primeiro o teu email na conta AOS antes de entrares aqui."
      );
    }

    const email = identidade.email.toLowerCase().trim();
    const { user } = await createAccount(ctx, {
      provider: "aos-account",
      account: { id: email },
      profile: {
        email,
        name: identidade.name ?? undefined,
        emailVerificationTime: Date.now(),
      },
      shouldLinkViaEmail: true,
    });

    const token: string = await ctx.runMutation(
      internal.aosAccount.emitirTokenInterno,
      { userId: user._id }
    );
    return { token };
  },
});

export const emitirTokenInterno = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(
      /-/g,
      ""
    );
    await ctx.db.insert("aos_login_tokens", {
      token,
      user_id: args.userId,
      expira_em: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
      usado: false,
    });
    return token;
  },
});

/** Resgata o bilhete local exactamente uma vez — chamado pelo provider "aos-account". */
export const redimirTokenInterno = internalMutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const linha = await ctx.db
      .query("aos_login_tokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!linha || linha.usado) {
      throw new Error("Token inválido ou já usado");
    }
    if (linha.expira_em < new Date().toISOString()) {
      throw new Error("Token expirado");
    }
    await ctx.db.patch(linha._id, { usado: true });
    return { userId: linha.user_id };
  },
});
