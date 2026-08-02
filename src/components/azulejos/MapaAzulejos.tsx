import type { Feature, FeatureCollection, Point } from "geojson";
import {
  AttributionControl,
  type GeoJSONSource,
  GeolocateControl,
  Map as MapLibreMap,
  NavigationControl,
} from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ATRIBUICAO,
  COBALTO,
  COR_ESTADO,
  ESTILO_AZULEJO,
  LIMITES_PORTUGAL,
  VISTA_PORTUGAL,
} from "@/lib/azulejos/mapa-estilo";

export type PainelNoMapa = {
  _id: string;
  lat: number;
  lng: number;
  estado: keyof typeof COR_ESTADO;
  concelho: string | null;
};

type Props = {
  paineis: PainelNoMapa[];
  /** Chamado quando se toca num painel individual. */
  onSelecionar?: (id: string) => void;
  /** Altura do mapa. Por omissão ocupa o contentor. */
  className?: string;
};

const FONTE = "paineis";

function paraGeoJSON(paineis: PainelNoMapa[]): FeatureCollection<Point> {
  const features: Feature<Point>[] = paineis.map((p) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    properties: { id: p._id, estado: p.estado, concelho: p.concelho },
  }));
  return { type: "FeatureCollection", features };
}

/**
 * O mapa dos azulejos. Fundo branco, traço a azul cobalto, e por cima —
 * a única coisa colorida no ecrã — os painéis.
 *
 * Ao longe agrupa por aglomerado; ao aproximar, abre nos painéis um a um.
 * Os desaparecidos ficam no mapa, a cinzento e ocos: um mapa com buracos
 * conta uma história que um mapa cheio não conta.
 */
export function MapaAzulejos({ paineis, onSelecionar, className }: Props) {
  const contentor = useRef<HTMLDivElement | null>(null);
  const mapa = useRef<MapLibreMap | null>(null);
  const [falhou, setFalhou] = useState(false);
  const aoSelecionar = useRef(onSelecionar);
  aoSelecionar.current = onSelecionar;

  // Cria o mapa uma só vez.
  useEffect(() => {
    if (!contentor.current || mapa.current) {
      return;
    }

    const m = new MapLibreMap({
      container: contentor.current,
      style: ESTILO_AZULEJO,
      center: VISTA_PORTUGAL.center,
      zoom: VISTA_PORTUGAL.zoom,
      maxBounds: LIMITES_PORTUGAL,
      minZoom: 5,
      maxZoom: 19,
      attributionControl: false,
    });
    mapa.current = m;

    // Um mapa que falha em silêncio é pior do que um mapa que o diz.
    m.on("error", (e) => {
      console.error("[mapa dos azulejos]", e.error?.message ?? e);
      setFalhou(true);
    });
    m.on("load", () => setFalhou(false));

    m.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: ATRIBUICAO,
      }),
      "bottom-right"
    );
    m.addControl(new NavigationControl({ showCompass: false }), "top-right");
    m.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      "top-right"
    );

    m.on("load", () => {
      m.addSource(FONTE, {
        type: "geojson",
        data: paraGeoJSON([]),
        cluster: true,
        clusterRadius: 46,
        clusterMaxZoom: 13,
      });

      // Aglomerados — discos de cobalto que crescem com a contagem.
      m.addLayer({
        id: "aglomerados",
        type: "circle",
        source: FONTE,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": COBALTO.forte,
          "circle-opacity": 0.9,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            16,
            10,
            22,
            50,
            28,
            200,
            36,
          ],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
        },
      });
      m.addLayer({
        id: "aglomerados-contagem",
        type: "symbol",
        source: FONTE,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 13,
        },
        paint: { "text-color": "#FFFFFF" },
      });

      // Painéis individuais, coloridos pelo estado de conservação.
      m.addLayer({
        id: "paineis",
        type: "circle",
        source: FONTE,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "match",
            ["get", "estado"],
            "integro",
            COR_ESTADO.integro,
            "danificado",
            COR_ESTADO.danificado,
            "em_risco",
            COR_ESTADO.em_risco,
            "desaparecido",
            "#FFFFFF",
            COBALTO.forte,
          ],
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 5, 18, 11],
          "circle-stroke-width": 2.5,
          "circle-stroke-color": [
            "match",
            ["get", "estado"],
            "desaparecido",
            COR_ESTADO.desaparecido,
            "#FFFFFF",
          ],
        },
      });

      const cursor = (valor: string) => {
        m.getCanvas().style.cursor = valor;
      };
      for (const camada of ["aglomerados", "paineis"]) {
        m.on("mouseenter", camada, () => cursor("pointer"));
        m.on("mouseleave", camada, () => cursor(""));
      }

      // Tocar num aglomerado aproxima; tocar num painel abre a ficha.
      m.on("click", "aglomerados", (e) => {
        const f = e.features?.[0];
        if (!f) {
          return;
        }
        const [lng, lat] = (f.geometry as Point).coordinates;
        m.easeTo({ center: [lng, lat], zoom: m.getZoom() + 2.5 });
      });
      m.on("click", "paineis", (e) => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id === "string") {
          aoSelecionar.current?.(id);
        }
      });
    });

    return () => {
      m.remove();
      mapa.current = null;
    };
  }, []);

  // Actualiza os dados sempre que a lista muda.
  useEffect(() => {
    const m = mapa.current;
    if (!m) {
      return;
    }
    const aplicar = () => {
      const fonte = m.getSource(FONTE) as GeoJSONSource | undefined;
      fonte?.setData(paraGeoJSON(paineis));
    };
    if (m.isStyleLoaded() && m.getSource(FONTE)) {
      aplicar();
    } else {
      m.once("idle", aplicar);
    }
  }, [paineis]);

  return (
    <div className={`relative ${className ?? "h-full w-full"}`}>
      <div
        aria-label="Mapa dos painéis de azulejo registados"
        className="h-full w-full"
        ref={contentor}
        role="application"
      />
      {falhou && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-card/90 px-8 text-center">
          <p className="font-body text-[15px] text-muted-foreground leading-relaxed">
            Não foi possível carregar o mapa. Verifique a ligação e recarregue a
            página.
          </p>
        </div>
      )}
    </div>
  );
}
