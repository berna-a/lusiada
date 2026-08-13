import { useAuthActions } from "@convex-dev/auth/react";
import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../convex/_generated/api";

const CHAVE_ESTADO = "aos_entrar_estado";

/**
 * Recebe a volta do AOS depois de "Entrar com conta AOS". Confirma o
 * `state` contra o que a EntrarPage guardou antes de sair (protecção
 * contra CSRF), troca o código pela identidade e abre sessão — nunca só
 * por o código estar presente no URL.
 */
export default function CallbackAos() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const trocarCodigo = useAction(api.aosAccount.trocarCodigo);
  const ranRef = useRef(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (ranRef.current) {
      return;
    }
    ranRef.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const estadoEsperado = sessionStorage.getItem(CHAVE_ESTADO);
    sessionStorage.removeItem(CHAVE_ESTADO);

    if (!(code && estadoEsperado) || state !== estadoEsperado) {
      setErro(
        "Não foi possível confirmar o pedido de entrada. Tenta outra vez."
      );
      return;
    }

    trocarCodigo({ code })
      .then(({ token }) => signIn("aos-account", { token }))
      .then(() => navigate("/bem-vindo", { replace: true }))
      .catch((err) => {
        setErro(
          err instanceof Error
            ? err.message
            : "Não foi possível entrar com a conta AOS."
        );
      });
  }, [params, trocarCodigo, signIn, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      {erro ? (
        <div>
          <p className="font-body text-[15px] text-destructive leading-relaxed">
            {erro}
          </p>
          <button
            className="mt-6 text-primary underline underline-offset-4"
            onClick={() => navigate("/entrar", { replace: true })}
            type="button"
          >
            Voltar a entrar
          </button>
        </div>
      ) : (
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      )}
    </main>
  );
}
