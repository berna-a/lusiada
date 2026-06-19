import { useConvexAuth, useQuery } from "convex/react";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

export default function MembrosPage() {
  const { isLoading } = useConvexAuth();
  const membership = useQuery(api.memberships.myMembership);

  if (isLoading || membership === undefined) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        data-nav-theme="light"
      >
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </main>
    );
  }

  const isMember = membership?.level === "member";

  if (!isMember) {
    return (
      <main
        className="mx-auto max-w-md px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-5 font-display text-3xl text-primary">
          Área reservada a sócios
        </h1>
        <p className="mt-4 font-body text-foreground/70 leading-relaxed">
          Esta secção é exclusiva para sócios da Associação Memória Lusíada.
        </p>
        <Button asChild className="mt-8" variant="accent">
          <Link to={membership?.level === "visitor" ? "/conta" : "/aderir"}>
            {membership?.level === "pending"
              ? "Ver estado da adesão"
              : "Tornar-me sócio"}
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <header className="text-center">
        <ShieldCheck className="mx-auto h-9 w-9 text-accent" />
        <p className="mt-4 font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Área de Sócios
        </p>
        <h1 className="mt-3 font-display text-[36px] text-primary">
          Bem-vindo, sócio.
        </h1>
        <p className="mx-auto mt-4 max-w-lg font-body text-[15px] text-foreground/70 leading-relaxed">
          Obrigado por sustentar a missão da Lusíada. Esta é a sua área
          reservada — os benefícios e conteúdos exclusivos vão crescer aqui.
        </p>
      </header>

      <section className="mt-12 rounded-2xl border border-border border-dashed bg-card/60 p-10 text-center">
        <p className="font-display text-[20px] text-primary">Em breve</p>
        <p className="mx-auto mt-3 max-w-md font-body text-[14px] text-muted-foreground leading-relaxed">
          Documentos da associação, encontros de sócios, votações e pré-estreias
          dos novos espaços da Arca. Estamos a preparar tudo.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/conta">Voltar à minha conta</Link>
        </Button>
      </section>
    </main>
  );
}
