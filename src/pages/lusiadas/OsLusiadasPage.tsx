import { useQuery } from "convex/react";
import {
  Bookmark,
  BookmarkCheck,
  BookOpen,
  BookText,
  CalendarDays,
  Check,
  Link2,
  Loader2,
  Map,
  Maximize2,
  MessageSquare,
  Minimize2,
  Share2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EstrofeDoDia } from "@/components/lusiadas/EstrofeDoDia";
import {
  type FeedTarget,
  LusiadasFeed,
} from "@/components/lusiadas/LusiadasFeed";
import { Seo } from "@/components/Seo";
import { RESUMOS_CANTOS } from "@/data/lusiadas/resumos";
import type { Grafia } from "@/lib/grafia/lexicon";
import { useGrafia } from "@/lib/grafia/store";
import { cantoHref, lusiadasBase, setLastRead } from "@/lib/lusiadas/nav";
import { markVisited, toggleSaved, useIsSaved } from "@/lib/lusiadas/saved";
import { api } from "../../../convex/_generated/api";

/** Botão de guardar uma estrofe (favorito local ao dispositivo). */
function SaveButton({
  c,
  e,
  preview,
}: {
  c: number;
  e: number;
  preview: string;
}) {
  const saved = useIsSaved(c, e);
  return (
    <button
      aria-label={
        saved ? `Remover estrofe ${e} dos guardados` : `Guardar estrofe ${e}`
      }
      aria-pressed={saved}
      className={`hover:!text-accent transition-colors ${
        saved
          ? "text-accent"
          : "text-muted-foreground/0 group-hover:text-muted-foreground/50"
      }`}
      onClick={() => toggleSaved(c, e, preview)}
      title={saved ? "Guardada" : "Guardar"}
      type="button"
    >
      {saved ? (
        <BookmarkCheck className="h-3.5 w-3.5" />
      ) : (
        <Bookmark className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

const cantoLoaders = import.meta.glob("../../data/lusiadas/canto*.json");

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

/** Slug ascii de uma palavra, para a ligação ao dicionário. */
function wordSlug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Selection = {
  x: number;
  y: number;
  text: string;
  stanza: number;
  verse?: number;
};

export default function OsLusiadasPage() {
  const params = useParams();
  const n = Math.min(
    10,
    Math.max(1, Number.parseInt(params.n ?? "1", 10) || 1)
  );
  const base = useMemo(lusiadasBase, []);
  const { grafia, setGrafia, convert } = useGrafia();
  const [canto, setCanto] = useState<Canto | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feed, setFeed] = useState<FeedTarget | null>(null);
  const counts = useQuery(api.lusiadas.countsByCanto, { canto: n }) ?? {};
  const senses = useQuery(api.lusiadas.sensesByCanto, { canto: n }) ?? {};
  const [showSense, setShowSense] = useState(false);
  const [sel, setSel] = useState<Selection | null>(null);
  const [focus, setFocus] = useState(() => {
    try {
      return localStorage.getItem("lus-reading") === "1";
    } catch {
      return false;
    }
  });
  const readerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Modo de leitura: guarda a preferência e esconde a navegação global do site.
  useEffect(() => {
    try {
      localStorage.setItem("lus-reading", focus ? "1" : "0");
    } catch {
      // ignora
    }
    document.body.dataset.reading = focus ? "1" : "";
    return () => {
      document.body.dataset.reading = "";
    };
  }, [focus]);

  // Barra de selecção: ao seleccionar texto no poema, mostra acções.
  function onReaderMouseUp() {
    const s = window.getSelection();
    const text = s?.toString().trim() ?? "";
    if (!s || s.isCollapsed || text.length < 1 || !readerRef.current) {
      setSel(null);
      return;
    }
    const node = s.anchorNode;
    const host = node instanceof Element ? node : (node?.parentElement ?? null);
    const stanzaEl = host?.closest<HTMLElement>("[id^=estrofe-]");
    if (!(stanzaEl && readerRef.current.contains(stanzaEl))) {
      setSel(null);
      return;
    }
    const verseEl = host?.closest<HTMLElement>("[data-verse]");
    const rect = s.getRangeAt(0).getBoundingClientRect();
    setSel({
      x: rect.left + rect.width / 2,
      y: rect.top,
      text,
      stanza: Number(stanzaEl.id.replace("estrofe-", "")),
      verse: verseEl ? Number(verseEl.dataset.verse) : undefined,
    });
  }

  // Esconde a barra ao deslizar ou ao clicar fora dela.
  useEffect(() => {
    const onScroll = () => setSel(null);
    const onDown = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setSel(null);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  function share(excerpt: string | undefined, stanza: number) {
    // URL de partilha com cartão social (imagem) — servida por /api/share-verso.
    const params = new URLSearchParams({ c: String(n), e: String(stanza) });
    if (excerpt) {
      params.set("t", excerpt);
    }
    const url = `${window.location.origin}/partilha?${params.toString()}`;
    const text = excerpt
      ? `«${excerpt}» — Os Lusíadas, Canto ${ROMANS[n]}`
      : `Os Lusíadas, Canto ${ROMANS[n]}`;
    if (typeof navigator.share === "function") {
      navigator.share({ title: "Os Lusíadas", text, url }).catch(() => {
        // partilha cancelada — ignora
      });
    } else {
      navigator.clipboard?.writeText(`${text}\n${url}`).catch(() => {
        // ignora
      });
    }
    setSel(null);
  }

  useEffect(() => {
    let alive = true;
    setCanto(null);
    setLastRead(n);
    markVisited(n);
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
      className={`mx-auto max-w-3xl px-6 pb-24 ${focus ? "pt-16" : "pt-32 sm:pt-40"}`}
      data-nav-theme="light"
    >
      <Seo
        description={
          RESUMOS_CANTOS[n]
            ? `Canto ${ROMANS[n]} d'Os Lusíadas: ${RESUMOS_CANTOS[n]}`.slice(
                0,
                160
              )
            : "Os Lusíadas de Luiz Vaz de Camões, lidos verso a verso nas três grafias da língua — a epopeia da nação Portugueza, para estudar, anotar e debater."
        }
        path={n === 1 ? "/os-lusiadas" : `/os-lusiadas/canto/${n}`}
        title={`Os Lusíadas — Canto ${ROMANS[n]} | Texto anotado, verso a verso | Camões`}
        type="article"
      />

      <header className={`text-center ${focus ? "hidden" : ""}`}>
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
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <button
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-muted-foreground transition-colors hover:text-accent"
            onClick={() =>
              setFeed({
                target: "epic",
                canto: 0,
                label: "Os Lusíadas — a obra",
              })
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
          <Link
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-muted-foreground transition-colors hover:text-accent"
            to={`${base || ""}/plano`}
          >
            <CalendarDays className="h-3.5 w-3.5" /> Plano de 30 dias
          </Link>
          <Link
            className="inline-flex items-center gap-1.5 font-body text-[13px] text-muted-foreground transition-colors hover:text-accent"
            to={`${base || ""}/viagem`}
          >
            <Map className="h-3.5 w-3.5" /> A Viagem
          </Link>
        </div>
      </header>

      {!focus && RESUMOS_CANTOS[n] && (
        <section className="mx-auto mt-8 max-w-2xl rounded-lg border border-border/60 bg-secondary/20 px-5 py-4">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
            Resumo do enredo — Canto {ROMANS[n]}
          </p>
          <p className="mt-2 font-body text-[15px] text-foreground/80 leading-relaxed">
            {RESUMOS_CANTOS[n]}
          </p>
        </section>
      )}

      {n === 1 && !focus && <EstrofeDoDia />}

      {/* Seletor de grafia */}
      <div className={`mt-7 flex justify-center ${focus ? "hidden" : ""}`}>
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

      {/* Modo Sentido — paráfrase em português moderno (contributo humano) */}
      <div className="mt-3 flex justify-center">
        <button
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-body text-[13px] transition-colors ${
            showSense
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setShowSense((v) => !v)}
          title="Ver a paráfrase em português moderno, estrofe a estrofe"
          type="button"
        >
          <BookText className="h-3.5 w-3.5" />
          {showSense ? "Sentido ligado" : "Mostrar o sentido"}
        </button>
      </div>

      {/* Navegação dos cantos */}
      <nav
        className={`mt-6 flex flex-wrap justify-center gap-2 ${focus ? "hidden" : ""}`}
      >
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
            <p
              className={`mt-2 font-body text-[12px] text-muted-foreground ${focus ? "hidden" : ""}`}
            >
              {canto.stanzas.length} estrofes · clica no número para ligar a uma
              estrofe
            </p>
          </div>

          <div
            className="mt-6 space-y-1"
            onMouseUp={onReaderMouseUp}
            onTouchEnd={() => setTimeout(onReaderMouseUp, 50)}
            ref={readerRef}
          >
            {canto.stanzas.map((s) => {
              const stanzaTarget = `c${n}:e${s.n}`;
              const stanzaCount = counts[stanzaTarget] ?? 0;
              const sense = senses[stanzaTarget];
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
                      className="hover:!text-accent text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/50"
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
                    <SaveButton
                      c={n}
                      e={s.n}
                      preview={convert(s.lines[0] ?? "")}
                    />
                  </div>
                  <div
                    className={`min-w-0 flex-1 font-body text-foreground/90 ${focus ? "text-[18px] leading-[2.15]" : "text-[17px] leading-[1.9]"}`}
                  >
                    {s.lines.map((line, i) => {
                      const verseTarget = `${stanzaTarget}:v${i + 1}`;
                      const verseCount = counts[verseTarget] ?? 0;
                      return (
                        <div
                          className="group/v -mx-2 flex items-center gap-2 rounded px-2 transition-colors hover:bg-accent/[0.05]"
                          key={i}
                        >
                          <p className="flex-1" data-verse={i + 1}>
                            {convert(line)}
                          </p>
                          <button
                            aria-label={`Anotações do verso ${i + 1}`}
                            className="shrink-0"
                            onClick={() =>
                              setFeed({
                                target: verseTarget,
                                canto: n,
                                excerpt: convert(line),
                                label: `Canto ${ROMANS[n]} · estrofe ${s.n} · verso ${i + 1}`,
                              })
                            }
                            title="Anotar este verso"
                            type="button"
                          >
                            {verseCount > 0 ? (
                              <span className="flex items-center gap-0.5 font-body text-[11px] text-accent">
                                <MessageSquare className="h-3 w-3" />
                                {verseCount}
                              </span>
                            ) : (
                              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground/0 transition-colors hover:text-accent group-hover/v:text-muted-foreground/40" />
                            )}
                          </button>
                        </div>
                      );
                    })}

                    {showSense &&
                      (sense ? (
                        <div className="mt-3 rounded-lg border-accent/30 border-l-2 bg-accent/[0.05] py-2 pr-3 pl-3">
                          <p className="font-body text-[14px] text-foreground/75 italic leading-relaxed">
                            {sense.body}
                          </p>
                          <p className="mt-1 font-body text-[11px] text-muted-foreground">
                            Sentido ·{" "}
                            {sense.verified
                              ? "verificado"
                              : (sense.authorName ?? "comunidade")}
                          </p>
                        </div>
                      ) : (
                        <button
                          className="mt-2 font-body text-[12px] text-accent/70 italic transition-colors hover:text-accent"
                          onClick={() =>
                            setFeed({
                              target: stanzaTarget,
                              canto: n,
                              label: `Canto ${ROMANS[n]} · estrofe ${s.n}`,
                            })
                          }
                          type="button"
                        >
                          + Contribuir com o sentido desta estrofe
                        </button>
                      ))}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Discussão do canto inteiro */}
          <div className={`mt-10 flex justify-center ${focus ? "hidden" : ""}`}>
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
          <div
            className={`mt-10 flex items-center justify-between border-border/60 border-t pt-6 font-body text-[14px] ${focus ? "hidden" : ""}`}
          >
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

      {/* Modo de leitura focado */}
      {canto && (
        <button
          className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3.5 py-2 font-body text-[13px] text-muted-foreground shadow-md backdrop-blur transition-colors hover:text-accent"
          onClick={() => setFocus((f) => !f)}
          type="button"
        >
          {focus ? (
            <>
              <Minimize2 className="h-4 w-4" /> Sair da leitura
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" /> Modo de leitura
            </>
          )}
        </button>
      )}

      {/* Barra de selecção — palavra/passagem seleccionada */}
      {sel && (
        <div
          className="fixed z-40 -translate-x-1/2 -translate-y-full"
          ref={toolbarRef}
          style={{ left: `${sel.x}px`, top: `${sel.y - 8}px` }}
        >
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background p-1 shadow-lg">
            <a
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-body text-[13px] text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              href={`/dicionario/${wordSlug(sel.text.split(/\s+/)[0] ?? "")}`}
              rel="noreferrer"
              target="_blank"
            >
              <BookText className="h-3.5 w-3.5" /> Dicionário
            </a>
            <button
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-body text-[13px] text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              onClick={() => {
                const tokens = sel.text.split(/\s+/).filter(Boolean);
                const v = sel.verse;
                let target = `c${n}:e${sel.stanza}`;
                let label = `Canto ${ROMANS[n]} · estrofe ${sel.stanza}`;
                if (v && tokens.length === 1) {
                  target = `c${n}:e${sel.stanza}:v${v}:w-${wordSlug(tokens[0])}`;
                  label = `Canto ${ROMANS[n]} · estrofe ${sel.stanza} · «${tokens[0]}»`;
                } else if (v) {
                  target = `c${n}:e${sel.stanza}:v${v}`;
                  label = `Canto ${ROMANS[n]} · estrofe ${sel.stanza} · verso ${v}`;
                }
                setFeed({ target, canto: n, excerpt: sel.text, label });
                setSel(null);
              }}
              type="button"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Anotar
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-body text-[13px] text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
              onClick={() => share(sel.text, sel.stanza)}
              type="button"
            >
              <Share2 className="h-3.5 w-3.5" /> Partilhar
            </button>
          </div>
        </div>
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

      {!focus && (
        <p className="mt-16 text-center font-body text-[12px] text-muted-foreground/70">
          <span className="font-display tracking-[0.15em]">Os Lusíadas</span> ·
          um projecto da{" "}
          <a className="hover:text-accent" href="https://www.alusiada.pt">
            Associação Lusíada
          </a>
        </p>
      )}
    </main>
  );
}
