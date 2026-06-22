import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import type { DicEntry } from "@/lib/grafia/dicionario";
import type { Verbete } from "@/lib/grafia/verbetes";

type Loaded =
  | { kind: "grafia"; entry: DicEntry; dropped: string | null }
  | { kind: "verbete"; verbete: Verbete }
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
      const { getVerbete } = await import("@/lib/grafia/verbetes");
      const verbete = slug ? await getVerbete(slug) : null;
      if (alive) {
        setState(verbete ? { kind: "verbete", verbete } : { kind: "none" });
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
    return <VerbeteView verbete={state.verbete} />;
  }

  return <GrafiaView dropped={state.dropped} entry={state.entry} />;
}

function VerbeteView({ verbete: v }: { verbete: Verbete }) {
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
      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to="/dicionario"
      >
        <ArrowLeft className="h-4 w-4" /> Dicionário
      </Link>
      <h1 className="mt-6 font-display text-[40px] text-primary leading-[1.1] sm:text-[48px]">
        {v.word}
      </h1>
      {v.pos && (
        <p className="mt-1 font-body text-[14px] text-accent italic">{v.pos}</p>
      )}

      <ol className="mt-8 space-y-4">
        {v.defs.map((d, i) => (
          <li className="flex gap-3" key={i}>
            {v.defs.length > 1 && (
              <span className="shrink-0 pt-0.5 font-display text-[15px] text-muted-foreground/60">
                {i + 1}.
              </span>
            )}
            <p className="font-body text-[17px] text-foreground/85 leading-relaxed">
              {d}
            </p>
          </li>
        ))}
      </ol>

      {v.etym && (
        <p className="mt-6 font-body text-[14px] text-muted-foreground italic">
          {v.etym}
        </p>
      )}

      <div className="mt-12 rounded-2xl border border-border/70 bg-muted/30 p-4">
        <p className="font-body text-[12px] text-muted-foreground leading-relaxed">
          Verbete importado do{" "}
          <a
            className="text-accent hover:underline"
            href="https://dicionario-aberto.net"
            rel="noreferrer"
            target="_blank"
          >
            Dicionário-Aberto
          </a>{" "}
          (Cândido de Figueiredo, 1913 · domínio público · CC BY-SA). A
          definição está na ortografia original de 1913 e será revista e
          reescrita em <strong>Portuguez</strong>.
        </p>
      </div>
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
