import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

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
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Password],
});
