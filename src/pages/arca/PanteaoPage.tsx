import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { Landmark, ArrowRight, Star } from "lucide-react";

import { api } from "../../../convex/_generated/api";

function Inicial({ nome }: { nome: string }) {
  const letra = nome.trim().charAt(0).toUpperCase();
  return <span className="font-display text-2xl text-accent">{letra}</span>;
}

export default function PanteaoPage() {
  const figuras = useQuery(api.figures.list);
  const loading = figuras === undefined;

  return (
    <main
      data-nav-theme="light"
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Header */}
      <header className="text-center">
        <p className="font-body text-[12px] uppercase tracking-[0.25em] text-muted-foreground">
          Arca · Memória Lusíada
        </p>
        <h1 className="mt-4 font-display text-[40px] sm:text-[56px] leading-[1.1] text-primary">
          Panteão
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
        <p className="mx-auto mt-8 max-w-xl font-body text-[17px] leading-relaxed text-foreground/80">
          As grandes figuras que moldaram a história de Portugal e da lusofonia —
          a sua vida, a sua obra, a sua memória.
        </p>
      </header>

      {/* Grid */}
      <section className="mt-16">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-border bg-card/50"
              />
            ))}
          </div>
        )}

        {!loading && figuras.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Landmark className="mx-auto h-8 w-8 text-accent/60" />
            <p className="mt-4 font-display text-xl text-primary">Em breve</p>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              As primeiras figuras do Panteão estão a ser preparadas.
            </p>
          </div>
        )}

        {!loading && figuras.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {figuras.map((f) => (
              <Link
                key={f._id}
                to={`/arca/herois/${f.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-accent/40 premium-shadow"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/20 bg-accent/10">
                    {f.portrait_url ? (
                      <img
                        src={f.portrait_url}
                        alt={f.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Inicial nome={f.name} />
                    )}
                  </span>
                  {f.is_figure_of_year && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-accent font-body">
                      <Star className="h-3 w-3" /> Patrono
                    </span>
                  )}
                </div>

                <h2 className="mt-5 font-display text-[22px] leading-tight text-primary">
                  {f.name}
                </h2>
                {f.epithet && (
                  <p className="mt-1 font-display text-[14px] italic text-accent">
                    {f.epithet}
                  </p>
                )}
                <p className="mt-2 font-body text-[13px] text-muted-foreground">
                  {[
                    f.category,
                    [f.birth_year, f.death_year].filter(Boolean).join("–"),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                <span className="mt-5 inline-flex items-center gap-1 font-body text-[13px] text-accent transition-all group-hover:gap-2">
                  Ver ficha <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
