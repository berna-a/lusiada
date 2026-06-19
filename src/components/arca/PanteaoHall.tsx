import { Loader2 } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { ContentPanel, type HeroSlot } from "./panteao3d/ContentPanel";

const Scene = lazy(() => import("./panteao3d/Scene"));

const COUNT = 5;
const CAMOES_INDEX = 2;

/** Experiência imersiva 3D do Panteão: galeria de estátuas + painel do herói. */
export function PanteaoHall({ figures }: { figures: Doc<"figures">[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const camoes = figures.find((f) => f.model_url) ?? figures[0];
  const modelUrl = camoes.model_url ?? "";

  const slots: HeroSlot[] = Array.from({ length: COUNT }, (_, i) =>
    i === CAMOES_INDEX
      ? { name: camoes.name, epithet: camoes.epithet, slug: camoes.slug }
      : { name: "Figura em preparação" }
  );

  return (
    <section
      className="relative -mx-4 -mt-4 min-h-screen overflow-hidden sm:-mx-6 sm:-mt-6 md:-mx-10 md:-mt-10"
      data-nav-theme="dark"
      style={{
        background: "radial-gradient(120% 80% at 50% 0%, #122f4f, #050d1a 70%)",
      }}
    >
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          }
        >
          <Scene
            count={COUNT}
            modelUrl={modelUrl}
            onSelect={setSelected}
            selected={selected}
          />
        </Suspense>
      </div>

      {/* Título — só na galeria */}
      {selected === null && (
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
            Clique numa estátua para conhecer cada herói — a sua vida, a sua
            obra e a memória que dele guardamos.
          </p>
        </div>
      )}

      {selected !== null && (
        <ContentPanel
          index={selected}
          onClose={() => setSelected(null)}
          onNext={() => setSelected((selected + 1) % COUNT)}
          onPrev={() => setSelected((selected + COUNT - 1) % COUNT)}
          slot={slots[selected]}
          total={COUNT}
        />
      )}

      {/* Atribuição do modelo 3D (CC BY 4.0) */}
      <a
        className="pointer-events-auto absolute right-3 bottom-3 z-10 font-body text-[#f4f1ec]/30 text-[10px] tracking-wide transition-colors hover:text-[#f4f1ec]/60"
        href="https://www.meshy.ai"
        rel="noreferrer"
        target="_blank"
      >
        Estátuas 3D · Meshy AI (CC BY 4.0)
      </a>
    </section>
  );
}
