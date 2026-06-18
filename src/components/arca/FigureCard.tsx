import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doc } from "../../../convex/_generated/dataModel";

function Inicial({ nome }: { nome: string }) {
  const letra = nome.trim().charAt(0).toUpperCase();
  return <span className="font-display text-2xl text-accent">{letra}</span>;
}

/** Cartão de uma figura do Panteão. Usado na galeria e no hub da Arca. */
export function FigureCard({ figure }: { figure: Doc<"figures"> }) {
  const meta = [
    figure.category,
    [figure.birth_year, figure.death_year].filter(Boolean).join("–"),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      className="group premium-shadow flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-accent/40"
      to={`/arca/herois/${figure.slug}`}
    >
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/20 bg-accent/10">
          {figure.portrait_url ? (
            <img
              alt={figure.name}
              className="h-full w-full object-cover"
              src={figure.portrait_url}
            />
          ) : (
            <Inicial nome={figure.name} />
          )}
        </span>
        {figure.is_figure_of_year && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 font-body text-[10px] text-accent uppercase tracking-wider">
            <Star className="h-3 w-3" /> Patrono
          </span>
        )}
      </div>

      <h2 className="mt-5 font-display text-[22px] text-primary leading-tight">
        {figure.name}
      </h2>
      {figure.epithet && (
        <p className="mt-1 font-display text-[14px] text-accent italic">
          {figure.epithet}
        </p>
      )}
      {meta && (
        <p className="mt-2 font-body text-[13px] text-muted-foreground">
          {meta}
        </p>
      )}

      <span className="mt-5 inline-flex items-center gap-1 font-body text-[13px] text-accent transition-all group-hover:gap-2">
        Ver ficha <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
