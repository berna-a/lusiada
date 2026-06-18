import { ChevronRight, Loader2 } from "lucide-react";
import { lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Doc } from "../../../convex/_generated/dataModel";

const Scene = lazy(() => import("./panteao3d/Scene"));

/** Experiência imersiva 3D do Panteão: sala de mármore com a estátua do herói. */
export function PanteaoHall({ figures }: { figures: Doc<"figures">[] }) {
  const navigate = useNavigate();
  const central = figures.find((f) => f.is_figure_of_year) ?? figures[0];
  const fichaUrl = `/arca/herois/${central.slug}`;

  return (
    <section
      className="relative -mx-4 -mt-4 min-h-screen overflow-hidden sm:-mx-6 sm:-mt-6 md:-mx-10 md:-mt-10"
      data-nav-theme="dark"
      style={{
        background: "radial-gradient(120% 80% at 50% 0%, #122f4f, #050d1a 70%)",
      }}
    >
      {/* Cena 3D (lazy) */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          }
        >
          <Scene onSelect={() => navigate(fichaUrl)} />
        </Suspense>
      </div>

      {/* Título (sobreposto, não intercepta o rato) */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center px-6 pt-24 text-center md:pt-28">
        <p className="font-body text-[11px] text-accent/80 uppercase tracking-[0.4em]">
          Arca · Memória Lusíada
        </p>
        <h1
          className="mt-3 font-display text-[#f4f1ec] text-[44px] leading-none tracking-[0.12em] sm:text-[64px]"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}
        >
          PANTEÃO
        </h1>
        <p className="mt-4 max-w-md font-body text-[#f4f1ec]/55 text-[14px] leading-relaxed">
          Arraste para percorrer a sala. Clique na estátua para conhecer a sua
          vida e obra.
        </p>
      </div>

      {/* Placa do herói + atalho acessível */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-10 text-center">
        <p className="font-display text-[#f4f1ec] text-[22px] tracking-[0.08em] sm:text-[26px]">
          {central.name}
        </p>
        {central.epithet && (
          <p className="mt-1 font-display text-[14px] text-accent italic">
            {central.epithet}
          </p>
        )}
        <Link
          className="pointer-events-auto mt-4 inline-flex items-center gap-1 font-body text-[#f4f1ec]/70 text-[12px] uppercase tracking-[0.2em] transition-all hover:gap-2 hover:text-accent"
          to={fichaUrl}
        >
          Ver ficha <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
