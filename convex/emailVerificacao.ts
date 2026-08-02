import { Email } from "@convex-dev/auth/providers/Email";

const REMETENTE = "Memória Lusíada <ola@alusiada.pt>";
const VALIDADE_S = 60 * 15;
const DIGITOS = 6;

/**
 * Código numérico aleatório, com o `crypto` nativo.
 *
 * Descartam-se os bytes a partir de 250: 250 é múltiplo de 10, por isso o que
 * resta (0–249) reparte-se pelos dez dígitos em partes exactamente iguais.
 * Sem isto, os dígitos baixos sairiam mais vezes — e um código previsível não
 * é um código.
 */
function codigoNumerico(digitos: number): string {
  let saida = "";
  const buf = new Uint8Array(digitos * 2);
  while (saida.length < digitos) {
    crypto.getRandomValues(buf);
    for (const b of buf) {
      if (b < 250) {
        saida += (b % 10).toString();
        if (saida.length === digitos) {
          break;
        }
      }
    }
  }
  return saida;
}

/**
 * Confirmação da conta por código enviado para o email.
 *
 * Usa o Resend por HTTP directo — não precisa de biblioteca nenhuma, o `fetch`
 * chega. Só entra em acção se `AUTH_RESEND_KEY` estiver definida no Convex;
 * enquanto não estiver, quem cria conta entra na mesma e fica por confirmar
 * (ver `convex/auth.ts`).
 */
export const CodigoPorEmail = Email({
  id: "resend-otp",
  maxAge: VALIDADE_S,

  // Código curto em vez de link: escreve-se num telemóvel sem sair da página,
  // e não se perde em clientes de email que reescrevem endereços.
  generateVerificationToken() {
    return codigoNumerico(DIGITOS);
  },

  async sendVerificationRequest({ identifier: email, token, expires }) {
    const chave = process.env.AUTH_RESEND_KEY;
    if (!chave) {
      throw new Error(
        "Falta a AUTH_RESEND_KEY no Convex — a confirmação por email não está ligada."
      );
    }
    const minutos = Math.max(
      1,
      Math.round((expires.getTime() - Date.now()) / 60_000)
    );

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: REMETENTE,
        to: [email],
        subject: `${token} — o seu código da Memória Lusíada`,
        text: [
          "Bem-vindo à Memória Lusíada.",
          "",
          `O seu código de confirmação é: ${token}`,
          "",
          `Expira dentro de ${minutos} minutos.`,
          "Se não foi você que pediu, ignore este email.",
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      // A mensagem do Resend ajuda a perceber se é a chave ou o domínio.
      throw new Error(`Não foi possível enviar o email: ${await res.text()}`);
    }
  },
});
