import { useQuery } from "convex/react";
import { ArrowLeft, Loader2, MessageSquare, Users } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { lusiadasBase, targetHref } from "@/lib/lusiadas/nav";
import { api } from "../../../convex/_generated/api";

/** "há 3 dias", "há 2 h", "agora" — tempo relativo em PT-PT. */
function timeAgo(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) {
    return "agora";
  }
  const m = Math.round(s / 60);
  if (m < 60) {
    return `há ${m} min`;
  }
  const h = Math.round(m / 60);
  if (h < 24) {
    return `há ${h} h`;
  }
  const d = Math.round(h / 24);
  if (d < 30) {
    return `há ${d} ${d === 1 ? "dia" : "dias"}`;
  }
  const mo = Math.round(d / 30);
  return `há ${mo} ${mo === 1 ? "mês" : "meses"}`;
}

export default function ComunidadePage() {
  const base = useMemo(lusiadasBase, []);
  const activity = useQuery(api.lusiadas.recentActivity, {});

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="A comunidade d'Os Lusíadas — as anotações e os sentidos mais recentes, partilhados verso a verso por quem lê e estuda a epopeia."
        path="/os-lusiadas/comunidade"
        title="Comunidade — Os Lusíadas"
      />

      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to={base || "/"}
      >
        <ArrowLeft className="h-4 w-4" /> Os Lusíadas
      </Link>

      <header className="mt-6 text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Lida em conjunto
        </p>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
          Comunidade
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-[16px] text-foreground/65 leading-relaxed">
          As anotações e os sentidos mais recentes, verso a verso.
        </p>
      </header>

      <div className="mt-8">
        {activity === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          </div>
        ) : activity.length === 0 ? (
          <p className="flex items-center gap-2 rounded-xl border border-border border-dashed bg-card/50 px-4 py-6 font-body text-[14px] text-muted-foreground">
            <Users className="h-4 w-4 shrink-0" /> Ainda sem contributos. Sê o
            primeiro a anotar uma estrofe no leitor.
          </p>
        ) : (
          <ul className="space-y-2">
            {activity.map((a) => (
              <li key={a._id}>
                <Link
                  className="block rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
                  to={targetHref(base, a.target)}
                >
                  <div className="flex items-center gap-2 font-body text-[12px] text-muted-foreground">
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        a.kind === "sense"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-foreground/70"
                      }`}
                    >
                      {a.kind === "sense" ? "Sentido" : "Anotação"}
                    </span>
                    <span className="truncate">{a.label}</span>
                    <span className="ml-auto shrink-0">{timeAgo(a.createdAt)}</span>
                  </div>
                  {a.excerpt && (
                    <p className="mt-1.5 font-body text-[13px] text-foreground/60 italic">
                      «{a.excerpt}»
                    </p>
                  )}
                  <p className="mt-1 font-body text-[15px] text-foreground/90 leading-relaxed">
                    {a.body.length > 220 ? `${a.body.slice(0, 220)}…` : a.body}
                  </p>
                  <p className="mt-1.5 flex items-center gap-3 font-body text-[12px] text-muted-foreground">
                    <span>{a.authorName ?? "Anónimo"}</span>
                    {a.upvotes > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {a.upvotes}
                      </span>
                    )}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
