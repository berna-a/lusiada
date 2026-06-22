import { useQuery } from "convex/react";
import {
  BookOpen,
  Check,
  Link2,
  Loader2,
  MessageSquare,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import {
  type FeedTarget,
  LusiadasFeed,
} from "@/components/lusiadas/LusiadasFeed";
import { useGrafia } from "@/lib/grafia/store";
import type { Grafia } from "@/lib/grafia/lexicon";
import { api } from "../../../convex/_generated/api";

const cantoLoaders = import.meta.glob("../../data/lusiadas/canto*.json");

const ROMANS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const GRAFIAS: { id: Grafia; label: string }[] = [
  { id: "pz", label: "Portuguez" },
  { id: "pre", label: "Pré-acordo" },
  { id: "ao", label: "AO 1990" },
];

type Canto = {
  canto: number;
  titulo: string;
  stanzas: { n: number; lines: string[] }[];
};

/** No domínio dedicado oslusiadas.pt as rotas vivem na raiz; na alusiada.pt sob /os-lusiadas. */
function useBasePath() {
  return useMemo(() => {
    const dedicated =
      typeof window !== "undefined" &&
      /(^|\.)oslusiadas\.pt$/i.test(window.location.hostname);
    return dedicated ? "" : "/os-lusiadas";
  }, []);
}

function cantoHref(base: string, num: number): string {
  if (num === 1) {
    return base || "/";
  }
  return `${base}/canto/${num}`;
}

export default function OsLusiadasPage() {
  const params = useParams();
  const n = Math.min(10, Math.max(1, Number.parseInt(params.n ?? "1", 10) || 1));
  const base = useBasePath();
  const { grafia, setGrafia, convert } = useGrafia();
  const [canto, setCanto] = useState<Canto | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feed, setFeed] = useState<FeedTarget | null>(null);
  const counts = useQuery(api.lusiadas.countsByCanto, { canto: n }) ?? {};

  useEffect(() => {
    let alive = true;
    setCanto(null);
    const cl = cantoLoaders[`../../data/lusiadas/canto${n}.json`];
    (cl ? cl() : Promise.resolve(null)).then((c) => {
      if (alive) {
        setCanto((c as { default: Canto } | null)?.default ?? null);
      }
    });
    return () => {
      alive = false;
    };
  }, [n]);

  // Endereçabilidade: ao carregar o canto, salta para a estrofe da âncora (#estrofe-N).
  useEffect(() => {
    if (!canto) {
      window.scrollTo(0, 0);
      return;
    }
    const hash = window.location.hash;
    if (hash.startsWith("#estrofe-")) {
      requestAnimationFrame(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ block: "center" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [canto]);

  function copyAnchor(stanza: number) {
    const url = `${window.location.origin}${cantoHref(base, n)}#estrofe-${stanza}`;
    navigator.clipboard?.writeText(url).catch(() => {
      // clipboard indisponível — ignora
    });
    window.history.replaceState(null, "", `#estrofe-${stanza}`);
    setCopied(stanza);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
    }
    copyTimer.current = setTimeout(() => setCopied(null), 1600);
  }

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Os Lusíadas de Luiz Vaz de Camões, lidos verso a verso nas três grafias da língua — a epopeia da nação Portugueza, para estudar, anotar e debater."
        path={n === 1 ? "/os-lusiadas" : `/os-lusiadas/canto/${n}`}
        title={`Os Lusíadas — Canto ${ROMANS[n]}${canto ? `: ${canto.titulo.replace(/^Canto\s+\w+\s*/, "")}` : ""} | Camões`}
        type="article"
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Luiz Vaz de Camões
        </p>
        <h1 className="mt-3 font-display text-[48px] text-primary leading-[1] sm:text-[60px]">
          Os Lusíadas
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-[16px] text-foreground/65 leading-relaxed">
          A epopeia da nação Portugueza, para ler e estudar verso a verso — nas{" "}
          <strong>três grafias</strong> da língua.
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-1.5 font-body text-[14px] text-accent transition-all hover:gap-2.5"
          to="/arca/lusopedia/os-lusiadas"
        >
          <BookOpen className="h-4 w-4" /> Sobre a obra, na Lusopédia →
        </Link>
        <div className="mt-3">
          <button
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-muted-foreground transition-colors hover:text-accent"
            onClick={() =>
              setFeed({ target: "epic", canto: 0, label: "Os Lusíadas — a obra" })
            }
            type="button"
          >
            <Users className="h-3.5 w-3.5" /> Discussão da obra
            {counts.epic ? (
              <span className="rounded-full bg-accent/15 px-1.5 text-[11px] text-accent">
                {counts.epic}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      {/* Seletor de grafia */}
      <div className="mt-7 flex justify-center">
        <div className="inline-flex rounded-lg border border-border p-0.5">
          {GRAFIAS.map((g) => (
            <button
              className={`rounded-md px-3 py-1.5 font-body text-[13px] transition-colors ${
                grafia === g.id
                  ? "bg-accent/15 text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              key={g.id}
              onClick={() => setGrafia(g.id)}
              type="button"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navegação dos cantos */}
      <nav className="mt-6 flex flex-wrap justify-center gap-2">
        {ROMANS.slice(1).map((r, i) => {
          const num = i + 1;
          const active = num === n;
          return (
            <Link
              className={`rounded-full border px-3.5 py-1.5 font-display text-[14px] transition-colors ${
                active
                  ? "border-accent/50 bg-accent/15 text-accent"
                  : "border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
              }`}
              key={r}
              to={cantoHref(base, num)}
            >
              {r}
            </Link>
          );
        })}
      </nav>

      {canto === null ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : (
        <>
          <div className="mt-8 border-border/60 border-t pt-8 text-center">
            <h2 className="font-display text-[26px] text-primary">
              {convert(canto.titulo)}
            </h2>
            <p className="mt-2 font-body text-[12px] text-muted-foreground">
              {canto.stanzas.length} estrofes · clica no número para ligar a uma
              estrofe
            </p>
          </div>

          <div className="mt-6 space-y-1">
            {canto.stanzas.map((s) => {
              const stanzaTarget = `c${n}:e${s.n}`;
              const stanzaCount = counts[stanzaTarget] ?? 0;
              return (
                <article
                  className="group flex gap-4 rounded-xl px-3 py-3 transition-colors target:bg-accent/10 hover:bg-accent/[0.04]"
                  id={`estrofe-${s.n}`}
                  key={s.n}
                >
                  <div className="flex shrink-0 flex-col items-center gap-1.5 pt-1">
                    <button
                      aria-label={`Anotações da estrofe ${s.n}`}
                      className="font-display text-[14px] text-muted-foreground/60 transition-colors hover:text-accent"
                      onClick={() =>
                        setFeed({
                          target: stanzaTarget,
                          canto: n,
                          label: `Canto ${ROMANS[n]} · estrofe ${s.n}`,
                        })
                      }
                      title="Anotar / debater esta estrofe"
                      type="button"
                    >
                      {s.n}
                    </button>
                    {stanzaCount > 0 && (
                      <span className="flex items-center gap-0.5 font-body text-[11px] text-accent">
                        <MessageSquare className="h-3 w-3" />
                        {stanzaCount}
                      </span>
                    )}
                    <button
                      aria-label={`Copiar ligação da estrofe ${s.n}`}
                      className="text-muted-foreground/0 transition-colors hover:!text-accent group-hover:text-muted-foreground/50"
                      onClick={() => copyAnchor(s.n)}
                      title="Copiar ligação"
                      type="button"
                    >
                      {copied === s.n ? (
                        <Check className="h-3.5 w-3.5 text-accent" />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="min-w-0 flex-1 font-body text-[17px] text-foreground/90 leading-[1.9]">
                    {s.lines.map((line, i) => {
                      const verseTarget = `${stanzaTarget}:v${i + 1}`;
                      const verseCount = counts[verseTarget] ?? 0;
                      return (
                        <button
                          className="group/v -mx-2 flex w-full items-center gap-2 rounded px-2 text-left transition-colors hover:bg-accent/[0.06]"
                          key={i}
                          onClick={() =>
                            setFeed({
                              target: verseTarget,
                              canto: n,
                              excerpt: convert(line),
                              label: `Canto ${ROMANS[n]} · estrofe ${s.n} · verso ${i + 1}`,
                            })
                          }
                          type="button"
                        >
                          <span className="flex-1">{convert(line)}</span>
                          {verseCount > 0 ? (
                            <span className="flex shrink-0 items-center gap-0.5 font-body text-[11px] text-accent">
                              <MessageSquare className="h-3 w-3" />
                              {verseCount}
                            </span>
                          ) : (
                            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/0 transition-colors group-hover/v:text-muted-foreground/40" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Discussão do canto inteiro */}
          <div className="mt-10 flex justify-center">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-body text-[14px] text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
              onClick={() =>
                setFeed({
                  target: `c${n}`,
                  canto: n,
                  label: `Discussão do Canto ${ROMANS[n]}`,
                })
              }
              type="button"
            >
              <Users className="h-4 w-4" /> Discutir o Canto {ROMANS[n]}
              {counts[`c${n}`] ? (
                <span className="rounded-full bg-accent/15 px-1.5 text-[12px] text-accent">
                  {counts[`c${n}`]}
                </span>
              ) : null}
            </button>
          </div>

          {/* Navegação inferior entre cantos */}
          <div className="mt-10 flex items-center justify-between border-border/60 border-t pt-6 font-body text-[14px]">
            {n > 1 ? (
              <Link
                className="text-accent hover:underline"
                to={cantoHref(base, n - 1)}
              >
                ← Canto {ROMANS[n - 1]}
              </Link>
            ) : (
              <span />
            )}
            {n < 10 ? (
              <Link
                className="text-accent hover:underline"
                to={cantoHref(base, n + 1)}
              >
                Canto {ROMANS[n + 1]} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </>
      )}

      {feed && (
        <LusiadasFeed
          canto={feed.canto}
          excerpt={feed.excerpt}
          label={feed.label}
          onClose={() => setFeed(null)}
          target={feed.target}
        />
      )}
    </main>
  );
}
