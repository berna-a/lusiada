import { Link, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { ArrowLeft, Loader2 } from "lucide-react";

import { api } from "../../../convex/_generated/api";

export default function HeroiPage() {
  const { id } = useParams();
  const data = useQuery(api.figures.getBySlug, id ? { slug: id } : "skip");

  // Loading
  if (data === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  // Não encontrado
  if (data === null) {
    return (
      <main
        data-nav-theme="light"
        className="mx-auto max-w-[760px] px-6 pt-40 pb-32 text-center"
      >
        <h1 className="font-display text-[32px] text-primary">Figura em preparação</h1>
        <p className="mt-4 font-body text-[16px] leading-relaxed text-foreground/75">
          Esta ficha ainda não foi publicada. Volte em breve — o Panteão está a crescer.
        </p>
        <Link
          to="/arca/panteao"
          className="mt-8 inline-flex items-center gap-2 font-body text-[14px] text-accent hover:gap-3 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Panteão
        </Link>
      </main>
    );
  }

  const { figure, blocks } = data;
  const datas = [figure.birth_year, figure.death_year].filter(Boolean).join(" — ");

  return (
    <article
      data-nav-theme="light"
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Voltar */}
      <Link
        to="/arca/panteao"
        className="inline-flex items-center gap-2 font-body text-[13px] uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Panteão
      </Link>

      {/* Header */}
      <header className="mt-10 text-center">
        {figure.hero_image_url && (
          <img
            src={figure.hero_image_url}
            alt={figure.name}
            className="mx-auto mb-8 h-40 w-40 rounded-full border border-accent/30 object-cover"
          />
        )}
        {figure.category && (
          <p className="font-body text-[12px] uppercase tracking-[0.25em] text-muted-foreground">
            {figure.category}
          </p>
        )}
        <h1 className="mt-4 font-display text-[40px] sm:text-[52px] leading-[1.1] text-primary">
          {figure.name}
        </h1>
        {figure.epithet && (
          <p className="mt-3 font-display text-[20px] italic text-accent">
            {figure.epithet}
          </p>
        )}
        {datas && (
          <p className="mt-3 font-body text-[14px] tracking-wide text-muted-foreground">
            {datas}
          </p>
        )}
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </header>

      {/* Blocos de conteúdo */}
      <div className="mt-14 space-y-10">
        {blocks.map((b) => {
          if (b.block_type === "quote") {
            return (
              <figure key={b._id} className="text-center">
                <blockquote className="font-display text-[22px] sm:text-[26px] italic leading-[1.5] text-primary whitespace-pre-line">
                  {b.content}
                </blockquote>
                {b.attribution && (
                  <figcaption className="mt-4 font-body text-[13px] uppercase tracking-[0.2em] text-muted-foreground">
                    {b.attribution}
                  </figcaption>
                )}
              </figure>
            );
          }
          return (
            <section key={b._id}>
              {b.title && (
                <h2 className="font-display text-[13px] uppercase tracking-[0.3em] text-accent">
                  {b.title}
                </h2>
              )}
              <p className="mt-4 font-body text-[17px] leading-[1.85] text-foreground/90 whitespace-pre-line">
                {b.content}
              </p>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 flex justify-center">
        <Link
          to="/aderir"
          className="inline-flex items-center justify-center rounded-full px-10 py-4 font-display text-[15px] uppercase tracking-[0.2em] text-white transition-all hover:brightness-110"
          style={{
            backgroundColor: "hsl(351 62% 34%)",
            boxShadow:
              "0 6px 20px hsl(351 62% 20% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
          }}
        >
          Junta-te
        </Link>
      </div>
    </article>
  );
}
