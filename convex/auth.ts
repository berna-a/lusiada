import Google from "@auth/core/providers/google";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { CodigoPorEmail } from "./emailVerificacao";

/**
 * Entrar na Lusíada.
 *
 * Duas portas, ambas dão o mesmo: uma conta. Quem entra passa a ser titular
 * de conta e pode navegar a Arca e contribuir. Ser sócio é outro degrau, que
 * se pede depois — ver `memberships`.
 *
 * - **Google** — um toque, sem palavra-passe para inventar nem esquecer.
 * - **Password** — email e palavra-passe, para quem não quer usar a Google.
 *   Não depende de serviço nenhum de fora e não custa nada.
 *
 * Falta a confirmação por email: precisa de um serviço de envio ligado.
 * Até lá entra-se logo e a conta fica por verificar.
 */
/**
 * A confirmação por email liga-se sozinha assim que a `AUTH_RESEND_KEY`
 * existir no Convex. Enquanto não existir, entra-se logo e a conta fica por
 * confirmar — mais vale isso do que uma porta fechada.
 */
const comConfirmacao = Boolean(process.env.AUTH_RESEND_KEY);

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    comConfirmacao ? Password({ verify: CodigoPorEmail }) : Password(),
    // "Entrar com conta AOS" (convex/aosAccount.ts) — resgata o bilhete
    // local de uso único emitido depois de trocar o código do AOS pela
    // identidade da pessoa. Nunca autentica por password nem por token
    // externo directamente — só por este bilhete, já verificado.
    ConvexCredentials({
      id: "aos-account",
      authorize: async (params, ctx) => {
        const { userId } = await ctx.runMutation(
          internal.aosAccount.redimirTokenInterno,
          { token: params.token as string }
        );
        return { userId };
      },
    }),
  ],
});
