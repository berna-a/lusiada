import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Seo } from "@/components/Seo";

type Modo = "entrar" | "criar";

const MIN_PASSE = 8;
const CHAVE_ESTADO = "aos_entrar_estado";

function entrarComContaAos() {
  const estado = crypto.randomUUID();
  sessionStorage.setItem(CHAVE_ESTADO, estado);
  const url = new URL("https://staging.aos.ardo.vc/entrar/lusiada");
  url.searchParams.set("state", estado);
  window.location.href = url.toString();
}

/** As mensagens do servidor de autenticação são cruas; traduzem-se aqui. */
function traduzirErro(bruto: string, modo: Modo): string {
  const m = bruto.toLowerCase();
  if (m.includes("invalidaccountid") || m.includes("invalid password")) {
    return modo === "entrar"
      ? "Email ou palavra-passe errados."
      : "Não foi possível criar a conta com estes dados.";
  }
  if (m.includes("already exists") || m.includes("taken")) {
    return "Já existe uma conta com este email. Tente entrar.";
  }
  if (m.includes("password")) {
    return `A palavra-passe tem de ter pelo menos ${MIN_PASSE} caracteres.`;
  }
  return modo === "entrar"
    ? "Não foi possível entrar. Confirme os dados e tente outra vez."
    : "Não foi possível criar a conta. Tente outra vez.";
}

export default function EntrarPage({ modoInicial }: { modoInicial: Modo }) {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destino = params.get("destino") ?? "/bem-vindo";

  const [modo, setModo] = useState<Modo>(modoInicial);
  const [email, setEmail] = useState("");
  const [passe, setPasse] = useState("");
  const [aEnviar, setAEnviar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Quem já entrou não tem nada a fazer aqui.
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(destino, { replace: true });
    }
  }, [isLoading, isAuthenticated, destino, navigate]);

  const submeter = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    const mail = email.trim().toLowerCase();
    if (!mail.includes("@")) {
      setErro("Escreva um email válido.");
      return;
    }
    if (passe.length < MIN_PASSE) {
      setErro(`A palavra-passe tem de ter pelo menos ${MIN_PASSE} caracteres.`);
      return;
    }
    setAEnviar(true);
    try {
      await signIn("password", {
        email: mail,
        password: passe,
        flow: modo === "criar" ? "signUp" : "signIn",
      });
      navigate(destino, { replace: true });
    } catch (err) {
      setErro(traduzirErro(err instanceof Error ? err.message : "", modo));
    } finally {
      setAEnviar(false);
    }
  };

  const campo =
    "mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 font-body text-[16px] text-foreground outline-none transition-colors focus:border-accent";
  const rotulo =
    "font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]";

  return (
    <main
      className="mx-auto max-w-md px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Entre ou crie a sua conta na Associação Memória Lusíada."
        noindex
        path={modo === "criar" ? "/criar-conta" : "/entrar"}
        title={
          modo === "criar"
            ? "Criar conta — Memória Lusíada"
            : "Entrar — Memória Lusíada"
        }
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Memória Lusíada
        </p>
        <h1 className="mt-3 font-display text-[34px] text-primary leading-[1.1] sm:text-[42px]">
          {modo === "criar" ? "Criar conta" : "Entrar"}
        </h1>
        <p className="mx-auto mt-5 max-w-[340px] font-body text-[15px] text-foreground/70 leading-relaxed">
          {modo === "criar"
            ? "Uma conta dá-lhe acesso à Arca e deixa-o contribuir. É grátis — ser sócio é outro passo, que se pede depois."
            : "Bem-vindo de volta."}
        </p>
      </header>

      <button
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card py-3.5 font-body text-[15px] text-foreground transition-colors hover:border-accent/50"
        onClick={() => signIn("google", { redirectTo: destino })}
        type="button"
      >
        <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18">
          <title>Google</title>
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
            fill="#EA4335"
          />
        </svg>
        Continuar com Google
      </button>

      <button
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card py-3.5 font-body text-[15px] text-foreground transition-colors hover:border-accent/50"
        onClick={entrarComContaAos}
        type="button"
      >
        Entrar com conta AOS
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.16em]">
          ou
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submeter}>
        <label className="block">
          <span className={rotulo}>Email</span>
          <input
            autoComplete="email"
            className={campo}
            inputMode="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="o.seu@email.pt"
            type="email"
            value={email}
          />
        </label>
        <label className="mt-4 block">
          <span className={rotulo}>Palavra-passe</span>
          <input
            autoComplete={
              modo === "criar" ? "new-password" : "current-password"
            }
            className={campo}
            minLength={MIN_PASSE}
            onChange={(e) => setPasse(e.target.value)}
            placeholder={`Pelo menos ${MIN_PASSE} caracteres`}
            type="password"
            value={passe}
          />
        </label>

        {erro && (
          <p className="mt-4 font-body text-[14px] text-destructive leading-relaxed">
            {erro}
          </p>
        )}

        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-body text-[15px] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={aEnviar}
          type="submit"
        >
          {aEnviar && <Loader2 className="h-4 w-4 animate-spin" />}
          {modo === "criar" ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center font-body text-[14px] text-muted-foreground">
        {modo === "criar" ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
        <button
          className="text-primary underline underline-offset-4"
          onClick={() => {
            setModo(modo === "criar" ? "entrar" : "criar");
            setErro(null);
          }}
          type="button"
        >
          {modo === "criar" ? "Entrar" : "Criar conta"}
        </button>
      </p>

      <p className="mt-8 text-center font-body text-[12px] text-muted-foreground leading-relaxed">
        Ao criar conta aceita os{" "}
        <Link className="underline underline-offset-2" to="/sobre/termos">
          termos
        </Link>{" "}
        e a{" "}
        <Link className="underline underline-offset-2" to="/sobre/privacidade">
          política de privacidade
        </Link>
        .
      </p>
    </main>
  );
}
