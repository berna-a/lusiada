import { useQuery } from "convex/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";

export type HeroSlot = {
  name: string;
  epithet?: string | null;
  slug?: string;
};

type ContentPanelProps = {
  slot: HeroSlot;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function ContentPanel({
  slot,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: ContentPanelProps) {
  const data = useQuery(
    api.figures.getBySlug,
    slot.slug ? { slug: slot.slug } : "skip"
  );
  const isLoading = Boolean(slot.slug) && data === undefined;
  const figure = data?.figure;
  const blocks = data?.blocks ?? [];
  const dates = figure
    ? [figure.birth_year, figure.death_year].filter(Boolean).join(" — ")
    : "";

  return (
    <aside
      className="absolute inset-x-0 bottom-0 z-20 flex max-h-[58%] flex-col md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[42%] md:max-w-[520px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(8,16,30,0.86), rgba(6,12,24,0.96))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(201,168,76,0.18)",
        boxShadow: "0 -10px 60px rgba(0,0,0,0.5)",
        animation: "panel-in 0.5s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Barra superior: navegação (desce abaixo do navbar no desktop) */}
      <div className="flex items-center justify-between px-6 pt-5 md:px-8 md:pt-24">
        <div className="flex items-center gap-2">
          <button
            aria-label="Anterior"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#f4f1ec]/15 text-[#f4f1ec]/70 transition-colors hover:border-accent/50 hover:text-accent"
            onClick={onPrev}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-body text-[#f4f1ec]/40 text-[12px] tracking-[0.2em]">
            {index + 1} / {total}
          </span>
          <button
            aria-label="Seguinte"
            className="grid h-9 w-9 place-items-center rounded-full border border-[#f4f1ec]/15 text-[#f4f1ec]/70 transition-colors hover:border-accent/50 hover:text-accent"
            onClick={onNext}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          aria-label="Fechar"
          className="grid h-9 w-9 place-items-center rounded-full border border-[#f4f1ec]/15 text-[#f4f1ec]/70 transition-colors hover:border-accent/50 hover:text-accent"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">
        <p className="font-body text-[11px] text-accent/80 uppercase tracking-[0.3em]">
          {figure?.category ?? "Panteão"}
        </p>
        <h2 className="mt-2 font-display text-[#f4f1ec] text-[30px] leading-[1.1] md:text-[38px]">
          {slot.name}
        </h2>
        {slot.epithet && (
          <p className="mt-2 font-display text-[16px] text-accent italic">
            {slot.epithet}
          </p>
        )}
        {dates && (
          <p className="mt-2 font-body text-[#f4f1ec]/45 text-[13px] tracking-wide">
            {dates}
          </p>
        )}

        <div className="mt-6 h-px w-12 bg-accent/40" />

        {!slot.slug && (
          <p className="mt-6 font-body text-[#f4f1ec]/60 text-[15px] leading-relaxed">
            Esta figura do Panteão está a ser preparada. Em breve, a sua vida e
            obra — e as memórias partilhadas pela comunidade.
          </p>
        )}

        {isLoading && (
          <div className="mt-6 space-y-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-[#f4f1ec]/10" />
            <div className="h-3 w-full animate-pulse rounded bg-[#f4f1ec]/10" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-[#f4f1ec]/10" />
          </div>
        )}

        <div className="mt-6 space-y-7">
          {blocks.map((b) =>
            b.block_type === "quote" ? (
              <blockquote
                className="whitespace-pre-line border-accent/40 border-l-2 pl-4 font-display text-[#f4f1ec]/90 text-[17px] italic leading-relaxed"
                key={b._id}
              >
                {b.content}
                {b.attribution && (
                  <footer className="mt-2 font-body text-[#f4f1ec]/40 text-[11px] uppercase not-italic tracking-[0.18em]">
                    {b.attribution}
                  </footer>
                )}
              </blockquote>
            ) : (
              <section key={b._id}>
                {b.title && (
                  <h3 className="font-display text-[12px] text-accent uppercase tracking-[0.25em]">
                    {b.title}
                  </h3>
                )}
                <p className="mt-2 whitespace-pre-line font-body text-[#f4f1ec]/75 text-[15px] leading-relaxed">
                  {b.content}
                </p>
              </section>
            )
          )}
        </div>

        {slot.slug && (
          <Link
            className="mt-8 inline-flex items-center gap-1 font-body text-[12px] text-accent uppercase tracking-[0.2em] transition-all hover:gap-2"
            to={`/arca/herois/${slot.slug}`}
          >
            Página completa <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </aside>
  );
}
