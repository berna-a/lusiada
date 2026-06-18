import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doc } from "../../../convex/_generated/dataModel";
import { StatueFigure } from "./StatueFigure";

const DUST = [
  { left: "18%", delay: "0s", dur: "9s" },
  { left: "34%", delay: "2.5s", dur: "11s" },
  { left: "52%", delay: "5s", dur: "8s" },
  { left: "68%", delay: "1.5s", dur: "12s" },
  { left: "82%", delay: "3.5s", dur: "10s" },
];

/** Experiência imersiva do Panteão: uma sala de mármore com a estátua do herói. */
export function PanteaoHall({ figures }: { figures: Doc<"figures">[] }) {
  const central = figures.find((f) => f.is_figure_of_year) ?? figures[0];

  return (
    <section
      className="relative -mx-4 -mt-4 flex min-h-screen animate-[panteao-enter_1.2s_ease-out] flex-col items-center overflow-hidden sm:-mx-6 sm:-mt-6 md:-mx-10 md:-mt-10"
      data-nav-theme="dark"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #14365c 0%, #0a1f38 38%, #050d1a 100%)",
      }}
    >
      {/* Holofote */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[glow-pulse_6s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(38% 52% at 50% 26%, rgba(255,240,210,0.20), transparent 72%)",
        }}
      />

      {/* Colunas laterais (desktop) */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[4%] hidden w-[7%] lg:block"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(226,217,196,0.14), rgba(226,217,196,0.14) 6px, rgba(160,150,128,0.10) 7px, rgba(160,150,128,0.10) 14px)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 12%, #000 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 12%, #000 78%, transparent)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[4%] hidden w-[7%] lg:block"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(226,217,196,0.14), rgba(226,217,196,0.14) 6px, rgba(160,150,128,0.10) 7px, rgba(160,150,128,0.10) 14px)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 12%, #000 78%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 12%, #000 78%, transparent)",
        }}
      />

      {/* Chão de mármore em perspectiva */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[34%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(20,40,66,0.6)), repeating-linear-gradient(115deg, rgba(226,217,196,0.05) 0 2px, transparent 2px 60px), repeating-linear-gradient(65deg, rgba(226,217,196,0.05) 0 2px, transparent 2px 60px)",
          transform: "perspective(420px) rotateX(58deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, #000, transparent)",
          WebkitMaskImage: "linear-gradient(to top, #000, transparent)",
        }}
      />

      {/* Poeira dourada */}
      {DUST.map((d) => (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[30%] h-1 w-1 rounded-full bg-accent/40 blur-[1px]"
          key={d.left}
          style={{
            left: d.left,
            animation: `dust-float ${d.dur} linear ${d.delay} infinite`,
          }}
        />
      ))}

      {/* Conteúdo */}
      <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-6 pt-24 pb-12 text-center">
        <p className="font-body text-[11px] text-accent/80 uppercase tracking-[0.4em]">
          Arca · Memória Lusíada
        </p>
        <h1
          className="mt-3 font-display text-[#f4f1ec] text-[44px] leading-none tracking-[0.12em] sm:text-[64px]"
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
        >
          PANTEÃO
        </h1>
        <p className="mt-4 max-w-md font-body text-[#f4f1ec]/55 text-[14px] leading-relaxed">
          Entre no Panteão e conheça os que guardam a memória de Portugal.
          Clique numa estátua para descobrir a sua vida e obra.
        </p>

        {/* Estátua */}
        <Link
          aria-label={`Conhecer ${central.name}`}
          className="group relative mt-10 flex flex-col items-center outline-none"
          to={`/arca/herois/${central.slug}`}
        >
          {/* Halo */}
          <div
            aria-hidden="true"
            className="absolute top-6 -z-10 h-[70%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(255,240,210,0.28),transparent_70%)] blur-xl transition-opacity duration-500 group-hover:opacity-100"
          />
          <StatueFigure className="h-64 animate-[statue-rise_1.1s_ease-out_0.2s_both] drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:-translate-y-1 sm:h-80 md:h-[22rem]" />

          {/* Pedestal */}
          <div
            className="-mt-1 h-12 w-44 sm:w-52"
            style={{
              background:
                "linear-gradient(to bottom, #e6decf, #b6ab92 60%, #8d836c)",
              clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
              boxShadow: "0 24px 40px rgba(0,0,0,0.5)",
            }}
          />

          {/* Placa */}
          <div className="mt-6 translate-y-1 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="font-display text-[#f4f1ec] text-[20px] tracking-[0.08em] sm:text-[24px]">
              {central.name}
            </p>
            {central.epithet && (
              <p className="mt-1 font-display text-[13px] text-accent italic">
                {central.epithet}
              </p>
            )}
            <span className="mt-3 inline-flex items-center gap-1 font-body text-[#f4f1ec]/60 text-[12px] uppercase tracking-[0.2em] transition-all group-hover:gap-2 group-hover:text-accent">
              Ver ficha <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
