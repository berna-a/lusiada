import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { Landmark, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

const STATUS_LABEL: Record<string, string> = {
  adepto: "Adepto",
  pending: "Sócio · em análise",
  member: "Sócio",
};

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CONTRIB_STATUS: Record<string, string> = {
  pending: "Em análise",
  approved: "Publicada",
  rejected: "Não publicada",
};

export default function MinhaContaPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const membership = useQuery(api.memberships.myMembership);
  const mine = useQuery(api.contributions.mine, isAuthenticated ? {} : "skip");

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        data-nav-theme="light"
      >
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main
        className="mx-auto max-w-md px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <h1 className="font-display text-3xl text-primary">A minha conta</h1>
        <p className="mt-4 font-body text-foreground/70 leading-relaxed">
          Inicie sessão para ver o seu perfil e as suas contribuições.
        </p>
        <Button
          className="mt-8"
          onClick={() => signIn("google", { redirectTo: "/conta" })}
          variant="accent"
        >
          Entrar com Google
        </Button>
      </main>
    );
  }

  const level = membership?.level ?? "adepto";
  const name = membership?.user?.name ?? membership?.member?.full_name ?? "—";
  const email = membership?.user?.email ?? "";

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <header className="mb-10">
        <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.3em]">
          A minha conta
        </p>
        <h1 className="mt-3 font-display text-[36px] text-primary">{name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 font-body text-[12px] tracking-wide ${
              level === "member"
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-muted-foreground"
            }`}
          >
            {STATUS_LABEL[level] ?? "Adepto"}
          </span>
          {email && (
            <span className="font-body text-[13px] text-muted-foreground">
              {email}
            </span>
          )}
        </div>
      </header>

      {/* Ações conforme estatuto */}
      <section className="mb-12 grid gap-3 sm:grid-cols-2">
        {level === "adepto" && (
          <Link
            className="group rounded-2xl border border-accent/30 bg-accent/[0.04] p-5 transition-colors hover:border-accent/50"
            to="/aderir"
          >
            <Landmark className="h-5 w-5 text-accent" />
            <p className="mt-3 font-display text-[17px] text-primary">
              Tornar-me sócio
            </p>
            <p className="mt-1 font-body text-[13px] text-muted-foreground leading-relaxed">
              Apoie a associação e desbloqueie a área reservada.
            </p>
          </Link>
        )}
        {level === "pending" && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="font-display text-[17px] text-primary">
              Adesão em análise
            </p>
            <p className="mt-1 font-body text-[13px] text-muted-foreground leading-relaxed">
              A Direcção está a analisar o seu pedido de sócio.
            </p>
          </div>
        )}
        {level === "member" && (
          <Link
            className="group rounded-2xl border border-accent/30 bg-accent/[0.04] p-5 transition-colors hover:border-accent/50"
            to="/membros"
          >
            <ShieldCheck className="h-5 w-5 text-accent" />
            <p className="mt-3 font-display text-[17px] text-primary">
              Área reservada
            </p>
            <p className="mt-1 font-body text-[13px] text-muted-foreground leading-relaxed">
              Conteúdos e benefícios exclusivos para sócios.
            </p>
          </Link>
        )}
        <Link
          className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/30"
          to="/arca/panteao"
        >
          <p className="font-display text-[17px] text-primary">
            Explorar a Arca
          </p>
          <p className="mt-1 font-body text-[13px] text-muted-foreground leading-relaxed">
            Visite o Panteão e partilhe novas memórias.
          </p>
        </Link>
      </section>

      {/* As minhas memórias */}
      <section>
        <h2 className="mb-4 font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
          As minhas memórias
        </h2>
        {mine === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : mine.length === 0 ? (
          <p className="font-body text-[15px] text-muted-foreground italic">
            Ainda não partilhou nenhuma memória.{" "}
            <Link className="text-accent hover:underline" to="/arca/panteao">
              Visite o Panteão.
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {mine.map((m) => (
              <li
                className="rounded-xl border border-border bg-card p-4"
                key={m._id}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.15em]">
                    {m.figureName} · {formatDate(m.createdAt)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-body text-[11px] ${
                      m.status === "approved"
                        ? "bg-accent/10 text-accent"
                        : m.status === "rejected"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {CONTRIB_STATUS[m.status] ?? m.status}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 font-body text-[14px] text-foreground/80 leading-relaxed">
                  {m.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-12 border-border border-t pt-6">
        <button
          className="inline-flex items-center gap-1.5 font-body text-[13px] text-muted-foreground hover:text-foreground"
          onClick={() => signOut()}
          type="button"
        >
          <LogOut className="h-3.5 w-3.5" /> Terminar sessão
        </button>
      </div>
    </main>
  );
}
