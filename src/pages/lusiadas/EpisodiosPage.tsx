import { BookOpen } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { EPISODIO_POR_SLUG, EPISODIOS } from "@/data/lusiadas/episodios";
import { lusiadasBase, targetHref } from "@/lib/lusiadas/nav";
import NotFound from "@/pages/NotFound";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
      {children}
    </p>
  );
}

/** Índice dos episódios — /os-lusiadas/episodios */
export default function EpisodiosPage() {
  const base = lusiadasBase();
  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Os episódios mais estudados d'Os Lusíadas — Inês de Castro, o Velho do Restelo, o Adamastor e a Ilha dos Amores: onde estão no poema e o que neles acontece."
        path="/os-lusiadas/episodios"
        title="Os Lusíadas — os episódios | Camões"
        type="article"
      />

      <header className="text-center">
        <Eyebrow>Os Lusíadas</Eyebrow>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[52px]">
          Os episódios
        </h1>
        <p className="mx-auto mt-6 max-w-[520px] font-body text-[16px] text-foreground/65 leading-relaxed">
          Onde estão no poema, o que neles acontece e o que a história
          documenta. O que significam fica para quem os lê.
        </p>
      </header>

      <div className="mt-16 space-y-4">
        {EPISODIOS.map((ep) => (
          <Link
            className="block rounded-lg border border-border/60 px-6 py-5 transition-colors hover:border-accent/50 hover:bg-secondary/20"
            key={ep.slug}
            to={`${base}/episodios/${ep.slug}`}
          >
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
              Canto {ep.cantoRomano} · estrofes {ep.estrofes}
            </p>
            <h2 className="mt-1.5 font-display text-[24px] text-primary">
              {ep.nome}
            </h2>
            <p className="mt-1.5 font-body text-[15px] text-foreground/70 leading-relaxed">
              {ep.sinopse}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}

/** Página de um episódio — /os-lusiadas/episodios/:slug */
export function EpisodioPage() {
  const { slug } = useParams();
  const ep = slug ? EPISODIO_POR_SLUG.get(slug) : undefined;
  const base = lusiadasBase();

  if (!ep) {
    return <NotFound />;
  }

  const lerHref = targetHref(base, `c${ep.canto}:e${ep.estrofeInicial}`);

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description={`${ep.sinopse} Canto ${ep.cantoRomano}, estrofes ${ep.estrofes} d'Os Lusíadas de Camões.`}
        jsonLd={{
          "@type": "Article",
          headline: `${ep.nome} — Os Lusíadas, Canto ${ep.cantoRomano}`,
          about: {
            "@type": "Book",
            name: "Os Lusíadas",
            author: { "@type": "Person", name: "Luís Vaz de Camões" },
          },
          inLanguage: "pt",
        }}
        path={`/os-lusiadas/episodios/${ep.slug}`}
        title={`${ep.nome} — Os Lusíadas, Canto ${ep.cantoRomano} | Camões`}
        type="article"
      />

      <header className="text-center">
        <Eyebrow>
          Canto {ep.cantoRomano} · estrofes {ep.estrofes}
        </Eyebrow>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[52px]">
          {ep.nome}
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </header>

      <blockquote className="mx-auto mt-12 max-w-[560px] border-accent/40 border-l-2 pl-6">
        {ep.citacao.versos.map((v) => (
          <p
            className="font-display text-[19px] text-primary/90 leading-[1.75]"
            key={v}
          >
            {v}
          </p>
        ))}
        <footer className="mt-3 font-body text-[13px] text-muted-foreground">
          {ep.citacao.ref}
        </footer>
      </blockquote>

      <section className="mt-16">
        <h2 className="font-display text-[26px] text-primary">
          O que acontece
        </h2>
        <ol className="mt-5 space-y-3">
          {ep.enredo.map((passo) => (
            <li
              className="flex gap-3 font-body text-[16px] text-foreground/80 leading-[1.8]"
              key={passo}
            >
              <span aria-hidden="true" className="mt-1.5 text-accent">
                —
              </span>
              <span>{passo}</span>
            </li>
          ))}
        </ol>
      </section>

      {ep.contexto.map((c) => (
        <section className="mt-12" key={c.titulo}>
          <h2 className="font-display text-[22px] text-primary">{c.titulo}</h2>
          <p className="mt-2 font-body text-[16px] text-foreground/80 leading-[1.8]">
            {c.texto}
          </p>
        </section>
      ))}

      <section className="mt-20 border-accent/20 border-t pt-10 text-center">
        <p className="font-body text-[15px] text-foreground/70 leading-relaxed">
          Leia o episódio no texto, verso a verso — e anote-o, se quiser
          discutir o que ali se diz.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            to={lerHref}
          >
            <BookOpen size={16} strokeWidth={1.5} />
            Ler no Canto {ep.cantoRomano}
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            to={`${base}/episodios`}
          >
            Os outros episódios
          </Link>
        </div>
      </section>
    </main>
  );
}
