import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import type { DicEntry } from "@/lib/grafia/dicionario";

type Loaded = { entry: DicEntry | null; dropped: string | null };

export default function PalavraPage() {
  const { slug } = useParams();
  const [state, setState] = useState<Loaded | undefined>();

  // Carrega o dicionário (chunk separado) e procura a palavra.
  useEffect(() => {
    let alive = true;
    import("@/lib/grafia/dicionario").then((m) => {
      if (!alive) {
        return;
      }
      const entry = slug ? m.getEntry(slug) : null;
      setState({ entry, dropped: entry ? m.droppedLetter(entry) : null });
    });
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

  const entry = state.entry;
  if (!entry) {
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

  const rule =
    entry.kind === "consoante"
      ? `A diferença está numa consoante muda: o Acordo Ortográfico de 1990 eliminou o «${state.dropped ?? ""}» que não se pronuncia. A ortografia anterior e o Portuguez mantêm-no.`
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
