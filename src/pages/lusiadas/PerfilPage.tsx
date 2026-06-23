import { useConvexAuth, useQuery } from "convex/react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  MessageSquare,
  Play,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { cantoHref, getLastRead, lusiadasBase } from "@/lib/lusiadas/nav";
import { loadPlano, PLAN_DAYS } from "@/lib/lusiadas/plano";
import { getVisited, removeSaved, useSaved } from "@/lib/lusiadas/saved";
import { api } from "../../../convex/_generated/api";

const ROMANS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Liga um target de anotação ("c5:e40:v2") à estrofe correspondente no leitor. */
function targetHref(base: string, target: string): string {
  const c = Number(target.match(/^c(\d+)/)?.[1] ?? 0);
  const e = target.match(/:e(\d+)/)?.[1];
  if (!c) {
    return cantoHref(base, 1);
  }
  return `${cantoHref(base, c)}${e ? `#estrofe-${e}` : ""}`;
}

export default function PerfilPage() {
  const base = useMemo(lusiadasBase, []);
  const last = getLastRead();
  const plano = useMemo(loadPlano, []);
  const planoDone = plano.startedAt ? plano.done.length : null;
  const visited = useMemo(getVisited, []);
  const saved = useSaved();
  const { isAuthenticated } = useConvexAuth();
  const mine = useQuery(api.lusiadas.listMine, {}) ?? [];

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="O meu espaço em Os Lusíadas — leitura em curso, estrofes guardadas e as minhas anotações."
        path="/os-lusiadas/perfil"
        title="O meu espaço — Os Lusíadas"
      />

      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to={base || "/"}
      >
        <ArrowLeft className="h-4 w-4" /> Os Lusíadas
      </Link>

      <h1 className="mt-6 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
        O meu espaço
      </h1>

      {/* Progresso */}
      <section className="mt-8">
        <h2 className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
          A minha leitura
        </h2>
        <Link
          className="mt-3 flex items-center gap-4 rounded-2xl border border-accent/40 bg-accent/5 p-5 transition-colors hover:bg-accent/10"
          to={cantoHref(base, last ?? 1)}
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
            <Play className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block font-body text-[11px] text-accent uppercase tracking-[0.18em]">
              {last ? "Continuar a leitura" : "Começar a ler"}
            </span>
            <span className="block font-display text-[18px] text-primary">
              {last ? `Canto ${ROMANS[last]}` : "Canto I"}
            </span>
          </span>
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="font-display text-[24px] text-primary">
              {visited.length}
              <span className="font-body text-[14px] text-muted-foreground"> / 10</span>
            </p>
            <p className="font-body text-[13px] text-muted-foreground">Cantos abertos</p>
          </div>
          <Link
            className="rounded-2xl border border-border bg-card p-4 transition-colors hover:border-accent/40"
            to={`${base}/plano`}
          >
            <p className="flex items-center gap-1.5 font-display text-[24px] text-primary">
              <CalendarDays className="h-5 w-5 text-accent" />
              {planoDone === null ? "—" : `${planoDone}/${PLAN_DAYS}`}
            </p>
            <p className="font-body text-[13px] text-muted-foreground">
              {planoDone === null ? "Plano de 30 dias" : "Dias do plano"}
            </p>
          </Link>
        </div>
      </section>

      {/* Guardados */}
      <section className="mt-10">
        <h2 className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
          Guardados {saved.length > 0 && `· ${saved.length}`}
        </h2>
        {saved.length === 0 ? (
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-border border-dashed bg-card/50 px-4 py-5 font-body text-[14px] text-muted-foreground">
            <Bookmark className="h-4 w-4 shrink-0" /> Guarda estrofes no leitor (ícone
            de marcador) e encontra-las aqui.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {[...saved]
              .sort((a, b) => b.ts - a.ts)
              .map((s) => (
                <li
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  key={`${s.c}-${s.e}`}
                >
                  <Link
                    className="min-w-0 flex-1"
                    to={`${cantoHref(base, s.c)}#estrofe-${s.e}`}
                  >
                    <span className="block truncate font-body text-[15px] text-foreground/90 italic">
                      «{s.preview}»
                    </span>
                    <span className="block font-body text-[12px] text-muted-foreground">
                      Canto {ROMANS[s.c]} · estrofe {s.e}
                    </span>
                  </Link>
                  <button
                    aria-label="Remover dos guardados"
                    className="shrink-0 text-muted-foreground/50 transition-colors hover:text-destructive"
                    onClick={() => removeSaved(s.c, s.e)}
                    title="Remover"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
          </ul>
        )}
      </section>

      {/* As minhas anotações */}
      <section className="mt-10">
        <h2 className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
          As minhas anotações {mine.length > 0 && `· ${mine.length}`}
        </h2>
        {!isAuthenticated ? (
          <p className="mt-3 rounded-xl border border-border border-dashed bg-card/50 px-4 py-5 font-body text-[14px] text-muted-foreground">
            <Link className="text-accent hover:underline" to="/aderir">
              Entra
            </Link>{" "}
            para anotar versos e guardar os teus contributos na tua conta.
          </p>
        ) : mine.length === 0 ? (
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-border border-dashed bg-card/50 px-4 py-5 font-body text-[14px] text-muted-foreground">
            <MessageSquare className="h-4 w-4 shrink-0" /> As tuas anotações e sentidos
            aparecem aqui.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {mine.map((m) => (
              <li key={m._id}>
                <Link
                  className="block rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
                  to={targetHref(base, m.target)}
                >
                  <span className="flex items-center gap-2 font-body text-[12px] text-muted-foreground">
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                      {m.kind === "sense" ? "Sentido" : "Anotação"}
                    </span>
                    {m.label}
                  </span>
                  <span className="mt-1 block font-body text-[15px] text-foreground/90 leading-relaxed">
                    {m.body.length > 160 ? `${m.body.slice(0, 160)}…` : m.body}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
