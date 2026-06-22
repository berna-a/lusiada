import { ArrowLeft, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { asciiSlug, type DicEntry } from "@/lib/grafia/dicionario";
import { useGrafia } from "@/lib/grafia/store";
import type { Verbete, VerbeteContext } from "@/lib/grafia/verbetes";

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

      <article className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-display text-[40px] text-primary leading-[1] sm:text-[48px]">
            {convert(v.word)}
          </h1>
          {v.pos && (
            <span className="rounded-md bg-muted px-2.5 py-1 font-body text-[12px] text-muted-foreground">
              {v.pos}
            </span>
          )}
        </div>

        {/* Seletor de grafia */}
        <div className="mt-5 inline-flex rounded-lg border border-border p-0.5">
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

        {/* Sentidos */}
        <ol className="mt-7 space-y-3.5">
          {v.defs.map((d, i) => (
            <li className="flex gap-3" key={i}>
              {v.defs.length > 1 && (
                <span className="shrink-0 pt-1 font-display text-[14px] text-accent/70">
                  {i + 1}
                </span>
              )}
              <p className="font-body text-[17px] text-foreground/90 leading-[1.7]">
                {convert(d)}
              </p>
            </li>
          ))}
        </ol>

        {/* Etimologia */}
        {v.etym && (
          <div className="mt-7 border-border/60 border-t pt-5">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
              Etimologia
            </p>
            <p className="mt-1.5 font-body text-[15px] text-foreground/75 italic leading-relaxed">
              {convert(v.etym)}
            </p>
          </div>
        )}
      </article>

      {/* Palavras vizinhas — teia interna */}
      {neighbors.length > 0 && (
        <div className="mt-8">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            Palavras vizinhas
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
        (Cândido de Figueiredo, 1913 · domínio público · CC BY-SA) — na
        ortografia original de 1913, a rever e reescrever em Portuguez.
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
