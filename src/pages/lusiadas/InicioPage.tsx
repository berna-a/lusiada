import { useQuery } from "convex/react";
import {
  Bookmark,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Compass,
  Play,
  Search,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { EstrofeDoDia } from "@/components/lusiadas/EstrofeDoDia";
import { timeAgo } from "@/lib/lusiadas/format";
import {
  cantoHref,
  getLastRead,
  lusiadasBase,
  targetHref,
} from "@/lib/lusiadas/nav";
import { loadPlano, PLAN_DAYS } from "@/lib/lusiadas/plano";
import { useSaved } from "@/lib/lusiadas/saved";
import { api } from "../../../convex/_generated/api";

const ROMANS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function InicioPage() {
  const base = useMemo(lusiadasBase, []);
  const last = getLastRead();
  const plano = useMemo(loadPlano, []);
  const planoDone = plano.startedAt ? plano.done.length : null;
  const planoPct = planoDone === null ? 0 : Math.round((planoDone / PLAN_DAYS) * 100);
  const saved = useSaved();
  const activity = useQuery(api.lusiadas.recentActivity, {});

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Os Lusíadas de Luiz Vaz de Camões — a epopeia da nação Portugueza, para ler, estudar e anotar verso a verso, nas três grafias da língua."
        path="/os-lusiadas"
        title="Os Lusíadas — Luiz Vaz de Camões"
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Luiz Vaz de Camões
        </p>
        <h1 className="mt-3 font-display text-[52px] text-primary leading-[1] sm:text-[68px]">
          Os Lusíadas
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-[16px] text-foreground/65 leading-relaxed">
          A epopeia da nação Portugueza — ler, estudar e anotar verso a verso,
          nas três grafias da língua.
        </p>
      </header>

      {/* Continuar / Começar */}
      <Link
        className="mt-8 flex items-center gap-4 rounded-2xl border border-accent/40 bg-accent/5 p-5 transition-colors hover:bg-accent/10"
        to={cantoHref(base, last ?? 1)}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
          <Play className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-body text-[11px] text-accent uppercase tracking-[0.18em]">
            {last ? "Continuar a leitura" : "Começar a ler"}
          </span>
          <span className="block font-display text-[20px] text-primary">
            {last ? `Canto ${ROMANS[last]}` : "Canto I"}
          </span>
        </span>
        <ChevronRight className="h-5 w-5 text-accent" />
      </Link>

      {/* Índice dos cantos */}
      <nav className="mt-4 flex flex-wrap justify-center gap-2">
        {ROMANS.slice(1).map((r, i) => (
          <Link
            className="rounded-full border border-border px-3.5 py-1.5 font-display text-[14px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
            key={r}
            to={cantoHref(base, i + 1)}
          >
            {r}
          </Link>
        ))}
      </nav>

      <EstrofeDoDia />

      {/* Plano */}
      <Link
        className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
        to={`${base}/plano`}
      >
        <CalendarDays className="h-6 w-6 shrink-0 text-accent" />
        <div className="flex-1">
          <p className="font-display text-[16px] text-primary">
            {planoDone === null
              ? "Plano — Os Lusíadas em 30 dias"
              : `Plano · Dia ${planoDone} de ${PLAN_DAYS}`}
          </p>
          {planoDone === null ? (
            <p className="font-body text-[13px] text-muted-foreground">
              Lê a epopeia inteira, ao teu ritmo.
            </p>
          ) : (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${planoPct}%` }}
              />
            </div>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      {/* Atalhos */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { to: `${base}/explorar`, icon: Compass, label: "Explorar" },
          { to: `${base}/procurar`, icon: Search, label: "Procurar" },
          { to: "/dicionario", icon: BookOpen, label: "Dicionário" },
          { to: "/arca/lusopedia/os-lusiadas", icon: BookOpen, label: "Sobre a obra" },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-4 text-center transition-colors hover:border-accent/40"
            key={label}
            to={to}
          >
            <Icon className="h-5 w-5 text-accent" />
            <span className="font-body text-[13px] text-foreground/80">{label}</span>
          </Link>
        ))}
      </div>

      {/* Guardados — só quando há */}
      {saved.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
              <Bookmark className="h-3.5 w-3.5" /> Guardados
            </h2>
            <Link className="font-body text-[12px] text-accent hover:underline" to={`${base}/perfil`}>
              Ver tudo →
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {[...saved]
              .sort((a, b) => b.ts - a.ts)
              .slice(0, 3)
              .map((s) => (
                <li key={`${s.c}-${s.e}`}>
                  <Link
                    className="block rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
                    to={`${cantoHref(base, s.c)}#estrofe-${s.e}`}
                  >
                    <span className="block truncate font-body text-[15px] text-foreground/90 italic">
                      «{s.preview}»
                    </span>
                    <span className="block font-body text-[12px] text-muted-foreground">
                      Canto {ROMANS[s.c]} · estrofe {s.e}
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* Comunidade — só quando há atividade */}
      {activity && activity.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
              <Users className="h-3.5 w-3.5" /> Na comunidade
            </h2>
            <Link className="font-body text-[12px] text-accent hover:underline" to={`${base}/comunidade`}>
              Ver tudo →
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {activity.slice(0, 3).map((a) => (
              <li key={a._id}>
                <Link
                  className="block rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
                  to={targetHref(base, a.target)}
                >
                  <span className="flex items-center gap-2 font-body text-[12px] text-muted-foreground">
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        a.kind === "sense" ? "bg-accent/10 text-accent" : "bg-muted text-foreground/70"
                      }`}
                    >
                      {a.kind === "sense" ? "Sentido" : "Anotação"}
                    </span>
                    <span className="truncate">{a.label}</span>
                    <span className="ml-auto shrink-0">{timeAgo(a.createdAt)}</span>
                  </span>
                  <span className="mt-1 block font-body text-[14px] text-foreground/85 leading-relaxed">
                    {a.body.length > 130 ? `${a.body.slice(0, 130)}…` : a.body}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-center font-body text-[12px] text-muted-foreground/70">
        <span className="font-display tracking-[0.15em]">Os Lusíadas</span> · um
        projecto da{" "}
        <a className="hover:text-accent" href="https://www.alusiada.pt">
          Associação Lusíada
        </a>
      </p>
    </main>
  );
}
