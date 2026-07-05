import { useConvexAuth, useQuery } from "convex/react";
import {
  CalendarDays,
  FileText,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

const CATEGORY_LABELS: Record<string, string> = {
  estatutos: "Estatutos",
  atas: "Actas",
  institucional: "Institucional",
  outros: "Outros",
};

function formatDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function MembrosPage() {
  const { isLoading } = useConvexAuth();
  const membership = useQuery(api.memberships.myMembership);
  const isMember = membership?.level === "member";
  const documents = useQuery(
    api.memberArea.listDocuments,
    isMember ? {} : "skip"
  );
  const events = useQuery(api.memberArea.listEvents, isMember ? {} : "skip");

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

  const upcoming = (events ?? []).filter((e) => e.date >= todayIso());

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
          Obrigado por sustentar a missão da Lusíada. Aqui encontra os
          documentos da associação e os próximos encontros de sócios.
        </p>
      </header>

      {/* Próximos encontros */}
      <section className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-[22px] text-primary">
          <CalendarDays className="h-5 w-5 text-accent" /> Próximos encontros
        </h2>
        {events === undefined ? (
          <Loader2 className="mt-6 h-5 w-5 animate-spin text-accent" />
        ) : upcoming.length === 0 ? (
          <p className="mt-4 rounded-xl border border-border border-dashed bg-card/60 p-6 text-center font-body text-[14px] text-muted-foreground">
            Ainda não há encontros agendados. Assim que houver, aparecem aqui.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {upcoming.map((e) => (
              <li
                className="rounded-2xl border border-border bg-card p-5"
                key={e._id}
              >
                <p className="font-body text-[12px] text-accent uppercase tracking-[0.15em]">
                  {formatDate(e.date)}
                  {e.time ? ` · ${e.time}` : ""}
                </p>
                <h3 className="mt-1.5 font-display text-[18px] text-primary">
                  {e.title}
                </h3>
                {e.description && (
                  <p className="mt-2 font-body text-[14px] text-foreground/70 leading-relaxed">
                    {e.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  {e.location && (
                    <p className="inline-flex items-center gap-1.5 font-body text-[13px] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {e.location}
                    </p>
                  )}
                  {e.link && (
                    <a
                      className="font-body text-[13px] text-accent underline-offset-2 hover:underline"
                      href={e.link}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Mais informação →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Documentos */}
      <section className="mt-14">
        <h2 className="flex items-center gap-2 font-display text-[22px] text-primary">
          <FileText className="h-5 w-5 text-accent" /> Documentos da associação
        </h2>
        {documents === undefined ? (
          <Loader2 className="mt-6 h-5 w-5 animate-spin text-accent" />
        ) : documents.length === 0 ? (
          <p className="mt-4 rounded-xl border border-border border-dashed bg-card/60 p-6 text-center font-body text-[14px] text-muted-foreground">
            Os primeiros documentos estão a ser preparados.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {documents.map((d) => (
              <li key={d._id}>
                <a
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/50"
                  href={d.url ?? "#"}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div>
                    <p className="font-body text-[11px] text-accent uppercase tracking-[0.15em]">
                      {CATEGORY_LABELS[d.category] ?? d.category}
                    </p>
                    <h3 className="mt-1 font-display text-[17px] text-primary">
                      {d.title}
                    </h3>
                    {d.description && (
                      <p className="mt-1 font-body text-[13px] text-muted-foreground">
                        {d.description}
                      </p>
                    )}
                  </div>
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-14 text-center">
        <Button asChild variant="outline">
          <Link to="/conta">Voltar à minha conta</Link>
        </Button>
      </div>
    </main>
  );
}
