import { ArrowLeft, Languages, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import type { DicEntry } from "@/lib/grafia/dicionario";
import { useGrafia } from "@/lib/grafia/store";
import type { Verbete, VerbeteContext } from "@/lib/grafia/verbetes";

function asciiSlug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Loaded =
  | { kind: "grafia"; entry: DicEntry; dropped: string | null }
  | { kind: "verbete"; context: VerbeteContext }
  | { kind: "none" };

export default function PalavraPage() {
  const { slug } = useParams();
  const [state, setState] = useState<Loaded | undefined>();

  // 1.º procura como palavra de grafia (ação/acção); se não existir, procura
  // como verbete do dicionário completo (definição).
  useEffect(() => {
    let alive = true;
    (async () => {
      const grafia = await import("@/lib/grafia/dicionario");
      const entry = slug ? grafia.getEntry(slug) : null;
      if (entry) {
        if (alive) {
          setState({
            kind: "grafia",
            entry,
            dropped: grafia.droppedLetter(entry),
          });
        }
        return;
      }
      const { getVerbeteContext } = await import("@/lib/grafia/verbetes");
      const context = slug ? await getVerbeteContext(slug) : null;
      if (alive) {
        setState(context ? { kind: "verbete", context } : { kind: "none" });
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (state.kind === "none") {
    return (
      <main
        className="mx-auto max-w-[760px] px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <h1 className="font-display text-[32px] text-primary">
          Palavra não encontrada
        </h1>
        <Link
          className="mt-8 inline-flex items-center gap-2 font-body text-accent"
          to="/dicionario"
        >
          <ArrowLeft className="h-4 w-4" /> Dicionário
        </Link>
      </main>
    );
  }

  if (state.kind === "verbete") {
    return <VerbeteView context={state.context} />;
  }

  return <GrafiaView dropped={state.dropped} entry={state.entry} />;
}

const GRAFIAS = [
  { id: "pz", label: "Portuguez" },
  { id: "pre", label: "Pré-acordo" },
  { id: "ao", label: "AO 1990" },
] as const;

function VerbeteSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const slug = asciiSlug(q);
        if (slug) {
          navigate(`/dicionario/${slug}`);
        }
      }}
    >
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        className="h-11 w-full rounded-xl border border-border bg-card pr-3 pl-9 font-body text-[15px] text-foreground outline-none transition-colors focus:border-accent/50"
        onChange={(e) => setQ(e.target.value)}
        placeholder="Procurar outra palavra…"
        value={q}
      />
    </form>
  );
}

function VerbeteView({ context }: { context: VerbeteContext }) {
  const { verbete: v, neighbors } = context;
  const { grafia, setGrafia, convert } = useGrafia();

  return (
    <main
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description={`${v.word}${v.pos ? ` (${v.pos})` : ""}: ${v.defs[0]}`}
        noindex
        path={`/dicionario/${v.slug}`}
        title={`${v.word} — Dicionário da Língua | Lusopédia`}
        type="article"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          className="inline-flex shrink-0 items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
          to="/dicionario"
        >
          <ArrowLeft className="h-4 w-4" /> Dicionário
        </Link>
        <div className="w-full sm:max-w-xs">
          <VerbeteSearch />
        </div>
      </div>

      <article className="mt-8 rounded-2xl border border-border bg-card p-7 sm:p-9">
        {/* Cabeçalho: palavra + classe à esquerda, grafia (discreta) à direita */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-[44px] text-primary leading-[1.05] tracking-[-0.01em]">
              {convert(v.word)}
            </h1>
            {v.pos && (
              <span className="font-body text-[14px] text-muted-foreground italic">
                {v.pos}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2.5 pt-2.5">
            <Languages
              aria-hidden
              className="h-3.5 w-3.5 text-muted-foreground/40"
            />
            {GRAFIAS.map((g) => (
              <button
                className={`font-body text-[12px] transition-colors ${
                  grafia === g.id
                    ? "text-accent"
                    : "text-muted-foreground/55 hover:text-foreground"
                }`}
                key={g.id}
                onClick={() => setGrafia(g.id)}
                title={`Ler em ${g.label}`}
                type="button"
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fonética + divisão silábica (camada Wiktionary) */}
        {(v.syl || v.ipa) && (
          <p className="mt-2.5 font-body text-[15px] text-muted-foreground">
            {v.syl}
            {v.syl && v.ipa && (
              <span className="px-2 text-muted-foreground/40">·</span>
            )}
            {v.ipa && <span className="text-foreground/70">{v.ipa}</span>}
          </p>
        )}

        {/* Sentidos */}
        <ol className="mt-7 space-y-4">
          {v.defs.map((d, i) => (
            <li className="flex gap-3.5" key={i}>
              {v.defs.length > 1 && (
                <span className="shrink-0 pt-[5px] font-display text-[13px] text-accent/70">
                  {i + 1}
                </span>
              )}
              <p className="font-body text-[17px] text-foreground/90 leading-[1.7]">
                {convert(d)}
              </p>
            </li>
          ))}
        </ol>

        {/* Sinónimos (camada Wiktionary) */}
        {v.syns && v.syns.length > 0 && (
          <div className="mt-7 border-border/50 border-t pt-5">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              Sinónimos
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {v.syns.map((s) => (
                <Link
                  className="rounded-md bg-muted px-2.5 py-1 font-body text-[14px] text-accent transition-colors hover:bg-accent/10"
                  key={s}
                  to={`/dicionario/${asciiSlug(s)}`}
                >
                  {convert(s)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Exemplos (quando existem) */}
        {v.ex && v.ex.length > 0 && (
          <div className="mt-7 border-border/50 border-t pt-5">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              Exemplos
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {v.ex.map((q, i) => (
                <li
                  className="font-body text-[15px] text-foreground/70 italic leading-relaxed"
                  key={i}
                >
                  «{convert(q)}»
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Origem (etimologia) */}
        {v.etym && (
          <div className="mt-7 border-border/50 border-t pt-5">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              Origem
            </p>
            <p className="mt-1.5 font-body text-[15px] text-foreground/75 italic leading-relaxed">
              {convert(v.etym)}
            </p>
          </div>
        )}
      </article>

      {/* Palavras vizinhas — teia interna */}
      {neighbors.length > 0 && (
        <div className="mt-9">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            Palavras vizinhas
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {neighbors.map((nb) => (
              <Link
                className="rounded-full border border-border bg-card px-3.5 py-1.5 font-display text-[15px] text-foreground/80 transition-colors hover:border-accent/40 hover:text-accent"
                key={nb.slug}
                to={`/dicionario/${nb.slug}`}
              >
                {convert(nb.word)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Fonte */}
      <p className="mt-10 font-body text-[12px] text-muted-foreground/80 leading-relaxed">
        Verbete do{" "}
        <a
          className="hover:text-accent hover:underline"
          href="https://dicionario-aberto.net"
          rel="noreferrer"
          target="_blank"
        >
          Dicionário-Aberto
        </a>{" "}
        (Cândido de Figueiredo, 1913 · domínio público) — definições na
        ortografia de 1913, a rever em Portuguez. Fonética, divisão silábica e
        sinónimos do{" "}
        <a
          className="hover:text-accent hover:underline"
          href="https://pt.wiktionary.org"
          rel="noreferrer"
          target="_blank"
        >
          Wikcionário
        </a>{" "}
        (CC BY-SA).
      </p>
    </main>
  );
}

function GrafiaView({
  entry,
  dropped,
}: {
  entry: DicEntry;
  dropped: string | null;
}) {
  const rule =
    entry.kind === "consoante"
      ? `A diferença está numa consoante muda: o Acordo Ortográfico de 1990 eliminou o «${dropped ?? ""}» que não se pronuncia. A ortografia anterior e o Portuguez mantêm-no.`
      : "Os nomes dos meses escrevem-se com maiúscula inicial em Portuguez e na ortografia anterior; o Acordo Ortográfico de 1990 passou-os a minúscula.";

  return (
    <main
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description={`Escreve-se «${entry.ao}» no Acordo Ortográfico de 1990 e «${entry.pre}» na ortografia anterior. Em Portuguez: «${entry.pre}».`}
        path={`/dicionario/${entry.slug}`}
        title={`«${entry.ao}» ou «${entry.pre}»? — Dicionário Lusopédia`}
        type="article"
      />
      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to="/dicionario"
      >
        <ArrowLeft className="h-4 w-4" /> Dicionário
      </Link>
      <h1 className="mt-6 font-display text-[36px] text-primary leading-[1.1] sm:text-[44px]">
        «{entry.ao}» ou «{entry.pre}»?
      </h1>
      <p className="mt-4 font-body text-[17px] text-foreground/85 leading-relaxed">
        Escreve-se <strong>«{entry.ao}»</strong> no Acordo Ortográfico de 1990 e{" "}
        <strong>«{entry.pre}»</strong> na ortografia anterior ao Acordo.
      </p>

      {entry.definition && (
        <>
          <h2 className="mt-10 font-display text-[22px] text-primary">
            Significado
          </h2>
          <p className="mt-3 font-body text-[16px] text-foreground/80 leading-relaxed">
            {entry.definition}
          </p>
        </>
      )}

      <h2 className="mt-10 font-display text-[22px] text-primary">
        As três grafias
      </h2>
      <dl className="mt-4 space-y-3">
        {[
          { label: "Portuguez (grafia da Lusíada)", value: entry.pre },
          { label: "Português (pré-acordo)", value: entry.pre },
          { label: "Português (AO 1990)", value: entry.ao },
        ].map((row) => (
          <div
            className="flex items-baseline gap-3 border-border/60 border-b pb-2"
            key={row.label}
          >
            <dt className="w-56 font-body text-[13px] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="font-display text-[20px] text-foreground">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 font-display text-[22px] text-primary">
        Porquê a diferença?
      </h2>
      <p className="mt-3 font-body text-[16px] text-foreground/80 leading-relaxed">
        {rule}
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-card p-5">
        <p className="font-body text-[15px] text-foreground/80 leading-relaxed">
          A <strong>Lusopédia</strong>, a enciclopédia da Associação Memória
          Lusíada, escreve-se em Portuguez — e pode ler-se em qualquer das três
          grafias.
        </p>
        <Link
          className="mt-3 inline-flex font-body text-[14px] text-accent hover:underline"
          to="/arca/lusopedia"
        >
          Visitar a Lusopédia →
        </Link>
      </div>
    </main>
  );
}
