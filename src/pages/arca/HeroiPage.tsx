import { useQuery } from "convex/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CommunityFeed } from "@/components/arca/CommunityFeed";
import { JoinCTA } from "@/components/JoinCTA";
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
        className="mx-auto max-w-[760px] px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <h1 className="font-display text-[32px] text-primary">
          Figura em preparação
        </h1>
        <p className="mt-4 font-body text-[16px] text-foreground/75 leading-relaxed">
          Esta ficha ainda não foi publicada. Volte em breve — o Panteão está a
          crescer.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 font-body text-[14px] text-accent transition-all hover:gap-3"
          to="/arca/panteao"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Panteão
        </Link>
      </main>
    );
  }

  const { figure, blocks } = data;
  const datas = [figure.birth_year, figure.death_year]
    .filter(Boolean)
    .join(" — ");

  return (
    <article
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      {/* Voltar */}
      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to="/arca/panteao"
      >
        <ArrowLeft className="h-4 w-4" /> Panteão
      </Link>

      {/* Header */}
      <header className="mt-10 text-center">
        {figure.hero_image_url && (
          <img
            alt={figure.name}
            className="mx-auto mb-8 h-40 w-40 rounded-full border border-accent/30 object-cover"
            src={figure.hero_image_url}
          />
        )}
        {figure.category && (
          <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.25em]">
            {figure.category}
          </p>
        )}
        <h1 className="mt-4 font-display text-[40px] text-primary leading-[1.1] sm:text-[52px]">
          {figure.name}
        </h1>
        {figure.epithet && (
          <p className="mt-3 font-display text-[20px] text-accent italic">
            {figure.epithet}
          </p>
        )}
        {datas && (
          <p className="mt-3 font-body text-[14px] text-muted-foreground tracking-wide">
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
              <figure className="text-center" key={b._id}>
                <blockquote className="whitespace-pre-line font-display text-[22px] text-primary italic leading-[1.5] sm:text-[26px]">
                  {b.content}
                </blockquote>
                {b.attribution && (
                  <figcaption className="mt-4 font-body text-[13px] text-muted-foreground uppercase tracking-[0.2em]">
                    {b.attribution}
                  </figcaption>
                )}
              </figure>
            );
          }
          return (
            <section key={b._id}>
              {b.title && (
                <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
                  {b.title}
                </h2>
              )}
              <p className="mt-4 whitespace-pre-line font-body text-[17px] text-foreground/90 leading-[1.85]">
                {b.content}
              </p>
            </section>
          );
        })}
      </div>

      {/* Feed da comunidade */}
      <CommunityFeed figureId={figure._id} figureName={figure.name} />

      {/* CTA */}
      <div className="mt-16">
        <JoinCTA />
      </div>
    </article>
  );
}
