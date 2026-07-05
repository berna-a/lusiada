import { ArrowLeft, Check, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";
import {
  loadPlano,
  PLAN_DAYS,
  type PlanoState,
  planoDia,
  type Ref,
  savePlano,
} from "@/lib/lusiadas/plano";

const ROMANS = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

function refHref(base: string, r: Ref) {
  return `${cantoHref(base, r.canto)}#estrofe-${r.stanza}`;
}

export default function PlanoPage() {
  const base = lusiadasBase();
  const [plano, setPlano] = useState<PlanoState>(() => loadPlano());

  function update(next: PlanoState) {
    setPlano(next);
    savePlano(next);
  }

  const started = plano.startedAt !== null;
  const doneSet = new Set(plano.done);
  const nextDay = Array.from({ length: PLAN_DAYS }, (_, i) => i + 1).find(
    (d) => !doneSet.has(d)
  );

  const start = () => update({ startedAt: new Date().toISOString(), done: [] });
  const toggle = (d: number) =>
    update({
      ...plano,
      startedAt: plano.startedAt ?? new Date().toISOString(),
      done: doneSet.has(d)
        ? plano.done.filter((x) => x !== d)
        : [...plano.done, d],
    });

  const pct = Math.round((plano.done.length / PLAN_DAYS) * 100);

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Lê Os Lusíadas de Camões em 30 dias — um plano de leitura guiado, verso a verso, com a obra completa nas três grafias da língua."
        path="/os-lusiadas/plano"
        title="Plano de Leitura — Os Lusíadas em 30 dias | Camões"
        type="article"
      />

      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to={base || "/"}
      >
        <ArrowLeft className="h-4 w-4" /> Os Lusíadas
      </Link>

      <header className="mt-6 text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Plano de Leitura
        </p>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
          Os Lusíadas em 30 dias
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-[16px] text-foreground/65 leading-relaxed">
          Toda a epopeia, ao teu ritmo — cerca de uma centena de versos por dia.
        </p>
      </header>

      {started ? (
        <>
          {/* Progresso */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between font-body text-[13px]">
              <span className="text-foreground/80">
                {plano.done.length} de {PLAN_DAYS} dias
              </span>
              <span className="text-accent">{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* A seguir */}
          {nextDay ? (
            <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/5 p-5">
              <p className="font-body text-[11px] text-accent uppercase tracking-[0.18em]">
                A seguir · Dia {nextDay}
              </p>
              {(() => {
                const r = planoDia(nextDay);
                return (
                  <p className="mt-1.5 font-display text-[18px] text-primary">
                    Canto {ROMANS[r.start.canto]}, estrofe {r.start.stanza} →
                    Canto {ROMANS[r.end.canto]}, estrofe {r.end.stanza}
                  </p>
                );
              })()}
              <div className="mt-4 flex gap-2">
                <Link
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-body text-[14px] text-white transition-all hover:brightness-110"
                  to={refHref(base, planoDia(nextDay).start)}
                >
                  <Play className="h-3.5 w-3.5" /> Ler o Dia {nextDay}
                </Link>
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-body text-[14px] text-muted-foreground transition-colors hover:text-accent"
                  onClick={() => toggle(nextDay)}
                  type="button"
                >
                  <Check className="h-3.5 w-3.5" /> Marcar como lido
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/5 p-6 text-center">
              <p className="font-display text-[20px] text-primary">
                Leste Os Lusíadas inteiros. 🎉
              </p>
              <p className="mt-1 font-body text-[14px] text-muted-foreground">
                Parabéns — completaste a epopeia.
              </p>
            </div>
          )}

          {/* Os 30 dias */}
          <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Array.from({ length: PLAN_DAYS }, (_, i) => i + 1).map((d) => {
              const r = planoDia(d);
              const isDone = doneSet.has(d);
              return (
                <div
                  className={`flex items-center gap-3 rounded-xl border p-3 ${isDone ? "border-accent/30 bg-accent/[0.04]" : "border-border"}`}
                  key={d}
                >
                  <button
                    aria-label={`Marcar Dia ${d}`}
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${isDone ? "border-accent bg-accent text-white" : "border-border text-transparent hover:border-accent/50"}`}
                    onClick={() => toggle(d)}
                    type="button"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[13px] text-foreground/80">
                      Dia {d}
                    </p>
                    <p className="truncate font-body text-[12px] text-muted-foreground">
                      Canto {ROMANS[r.start.canto]} · est. {r.start.stanza}–
                      {r.end.canto === r.start.canto
                        ? r.end.stanza
                        : `${ROMANS[r.end.canto]}.${r.end.stanza}`}
                    </p>
                  </div>
                  <Link
                    className="shrink-0 font-body text-[13px] text-accent hover:underline"
                    to={refHref(base, r.start)}
                  >
                    Ler
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              className="font-body text-[13px] text-muted-foreground hover:text-destructive"
              onClick={() => update({ startedAt: null, done: [] })}
              type="button"
            >
              Recomeçar o plano
            </button>
          </div>
        </>
      ) : (
        <div className="mt-10 text-center">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-[15px] text-white uppercase tracking-[0.1em] transition-all hover:brightness-110"
            onClick={start}
            type="button"
          >
            <Play className="h-4 w-4" /> Começar o plano
          </button>
          <p className="mt-4 font-body text-[13px] text-muted-foreground">
            Ao teu ritmo — marca cada dia conforme leres.
          </p>
        </div>
      )}
    </main>
  );
}
