import { Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  COBALTO,
  ESTILO_AZULEJO,
  VISTA_PORTUGAL,
} from "@/lib/azulejos/mapa-estilo";

type Props = {
  /** Ponto de partida, se já houver alguma ideia de onde é. */
  inicio?: { lat: number; lng: number } | null;
  onConfirmar: (lat: number, lng: number) => void;
  onCancelar: () => void;
};

/**
 * Marcar o sítio à mão, quando o GPS não colabora.
 *
 * A mira fica fixa no centro e o mapa é que se arrasta — é o gesto que se usa
 * em toda a parte no telemóvel, e é muito mais fácil do que acertar com o dedo
 * num ponto pequeno.
 */
export function EscolherNoMapa({ inicio, onConfirmar, onCancelar }: Props) {
  const contentor = useRef<HTMLDivElement | null>(null);
  const mapa = useRef<MapLibreMap | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const alvo = contentor.current;
    if (!alvo || mapa.current) {
      return;
    }
    const m = new MapLibreMap({
      container: alvo,
      style: structuredClone(ESTILO_AZULEJO),
      ...(inicio
        ? { center: [inicio.lng, inicio.lat] as [number, number], zoom: 17 }
        : {
            bounds: VISTA_PORTUGAL.limites,
            fitBoundsOptions: { padding: 28 },
          }),
      minZoom: 3,
      maxZoom: 20,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });
    mapa.current = m;
    m.on("load", () => setPronto(true));
    const obs = new ResizeObserver(() => m.resize());
    obs.observe(alvo);
    return () => {
      obs.disconnect();
      m.remove();
      mapa.current = null;
    };
  }, [inicio]);

  const confirmar = () => {
    const c = mapa.current?.getCenter();
    if (c) {
      onConfirmar(c.lat, c.lng);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <header
        className="shrink-0 border-slate-200 border-b px-5 py-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <p
          className="font-display text-[15px] tracking-[0.12em]"
          style={{ color: COBALTO.tinta }}
        >
          MARCAR O SÍTIO
        </p>
        <p className="mt-1 font-body text-[13px] text-slate-500">
          Arraste o mapa até a mira ficar sobre o painel.
        </p>
      </header>

      <div className="relative min-h-0 flex-1">
        <div className="h-full w-full" ref={contentor} />
        {!pronto && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: COBALTO.lavado }}
          />
        )}
        {/* A mira, sempre no centro exacto. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span
            className="block h-6 w-6 rounded-full border-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            style={{
              borderColor: "#FFFFFF",
              backgroundColor: COBALTO.forte,
            }}
          />
        </div>
      </div>

      <div
        className="shrink-0 border-slate-200 border-t px-5 pt-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <button
          className="w-full rounded-2xl py-4 font-body text-[16px] text-white transition-transform active:scale-[0.98]"
          onClick={confirmar}
          style={{ backgroundColor: COBALTO.forte }}
          type="button"
        >
          Confirmar este sítio
        </button>
        <button
          className="mt-2 w-full rounded-2xl border border-slate-200 py-3.5 font-body text-[15px] text-slate-600"
          onClick={onCancelar}
          type="button"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
