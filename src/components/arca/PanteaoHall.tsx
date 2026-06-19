import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  lazy,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  Suspense,
  useRef,
  useState,
} from "react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { ContentPanel, type HeroSlot } from "./panteao3d/ContentPanel";
import { panLimit, SPACING, xAt } from "./panteao3d/layout";

const Scene = lazy(() => import("./panteao3d/Scene"));

const COUNT = 5;
const CAMOES_INDEX = 2;
const PAN_LIMIT = panLimit(COUNT);
const DRAG_SENS = 0.02;

const clampPan = (v: number) => Math.max(-PAN_LIMIT, Math.min(PAN_LIMIT, v));

/** Experiência imersiva 3D do Panteão: galeria percorrível + painel do herói. */
export function PanteaoHall({ figures }: { figures: Doc<"figures">[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const panRef = useRef(0);
  const drag = useRef({ active: false, startX: 0, startPan: 0, moved: false });

  const camoes = figures.find((f) => f.model_url) ?? figures[0];
  const modelUrl = camoes.model_url ?? "";

  const slots: HeroSlot[] = Array.from({ length: COUNT }, (_, i) =>
    i === CAMOES_INDEX
      ? { name: camoes.name, epithet: camoes.epithet, slug: camoes.slug }
      : { name: "Figura em preparação" }
  );

  const select = (i: number | null) => {
    if (i !== null && drag.current.moved) {
      return; // foi um arrasto, não um clique
    }
    setSelected(i);
  };
  const close = () => {
    if (selected !== null) {
      panRef.current = clampPan(xAt(selected, COUNT));
    }
    setSelected(null);
  };
  const nudge = (dir: number) => {
    panRef.current = clampPan(panRef.current + dir * SPACING);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (selected !== null) {
      return;
    }
    drag.current = {
      active: true,
      startX: e.clientX,
      startPan: panRef.current,
      moved: false,
    };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) {
      return;
    }
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) {
      drag.current.moved = true;
    }
    panRef.current = clampPan(drag.current.startPan - dx * DRAG_SENS);
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (selected !== null) {
      return;
    }
    panRef.current = clampPan(panRef.current + (e.deltaY + e.deltaX) * 0.012);
  };

  return (
    <section
      className="relative -mx-4 -mt-4 min-h-screen overflow-hidden sm:-mx-6 sm:-mt-6 md:-mx-10 md:-mt-10"
      data-nav-theme="dark"
      style={{
        background: "radial-gradient(120% 80% at 50% 0%, #122f4f, #050d1a 70%)",
      }}
    >
      <div
        className="absolute inset-0"
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onWheel={onWheel}
        style={{
          touchAction: "none",
          cursor: selected === null ? "grab" : "default",
        }}
      >
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
            onSelect={select}
            panRef={panRef}
            selected={selected}
          />
        </Suspense>
      </div>

      {/* Título + setas — só na galeria */}
      {selected === null && (
        <>
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
              Arraste para percorrer a sala e clique numa estátua para conhecer
              cada herói.
            </p>
          </div>

          <button
            aria-label="Percorrer para a esquerda"
            className="absolute top-1/2 left-3 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#f4f1ec]/20 bg-[#0a1526]/40 text-[#f4f1ec]/70 backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent md:left-6"
            onClick={() => nudge(-1)}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Percorrer para a direita"
            className="absolute top-1/2 right-3 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-[#f4f1ec]/20 bg-[#0a1526]/40 text-[#f4f1ec]/70 backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent md:right-6"
            onClick={() => nudge(1)}
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {selected !== null && (
        <ContentPanel
          index={selected}
          onClose={close}
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
