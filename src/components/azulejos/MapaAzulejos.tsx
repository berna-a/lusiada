import type { Feature, FeatureCollection, Point } from "geojson";
import {
  AttributionControl,
  type GeoJSONSource,
  Map as MapLibreMap,
} from "maplibre-gl";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  ATRIBUICAO,
  COBALTO,
  COR_ESTADO,
  ESTILO_AZULEJO,
  type Estado,
  VISTA_PORTUGAL,
} from "@/lib/azulejos/mapa-estilo";

export type PainelNoMapa = {
  _id: string;
  lat: number;
  lng: number;
  estado: Estado;
  concelho: string | null;
};

export type MapaHandle = {
  /** Aproxima num ponto — usado quando o utilizador se localiza. */
  irPara: (lng: number, lat: number, zoom?: number) => void;
  /** Volta a mostrar Portugal inteiro. */
  verTudo: () => void;
};

type Props = {
  paineis: PainelNoMapa[];
  onSelecionar?: (id: string) => void;
  /** Estado destacado; os restantes esbatem-se. */
  filtro?: Estado | null;
  className?: string;
};

const FONTE = "paineis";
const CAMADA_PONTOS = "paineis-pontos";
const CAMADA_AGLOMERADOS = "aglomerados";

function paraGeoJSON(paineis: PainelNoMapa[]): FeatureCollection<Point> {
  const features: Feature<Point>[] = paineis.map((p) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    properties: { id: p._id, estado: p.estado },
  }));
  return { type: "FeatureCollection", features };
}

/** Expressão de cor por estado, partilhada pelo preenchimento e pelo anel. */
const CORES_POR_ESTADO = [
  "match",
  ["get", "estado"],
  "integro",
  COR_ESTADO.integro,
  "danificado",
  COR_ESTADO.danificado,
  "em_risco",
  COR_ESTADO.em_risco,
  "desaparecido",
  COR_ESTADO.desaparecido,
  COBALTO.forte,
];

/**
 * O mapa. Ao longe agrupa; ao aproximar, abre nos painéis um a um.
 * Os desaparecidos ficam lá, ocos — um mapa com buracos conta o que um mapa
 * cheio não conta.
 */
export const MapaAzulejos = forwardRef<MapaHandle, Props>(
  ({ paineis, onSelecionar, filtro, className }, ref) => {
    const contentor = useRef<HTMLDivElement | null>(null);
    const mapa = useRef<MapLibreMap | null>(null);
    const [pronto, setPronto] = useState(false);
    const [falhou, setFalhou] = useState(false);
    const aoSelecionar = useRef(onSelecionar);
    aoSelecionar.current = onSelecionar;

    useImperativeHandle(ref, () => ({
      irPara: (lng, lat, zoom = 16) => {
        mapa.current?.flyTo({ center: [lng, lat], zoom, duration: 1600 });
      },
      verTudo: () => {
        mapa.current?.flyTo({ ...VISTA_PORTUGAL, duration: 1400 });
      },
    }));

    useEffect(() => {
      const alvo = contentor.current;
      if (!alvo || mapa.current) {
        return;
      }

      const m = new MapLibreMap({
        container: alvo,
        // Cópia: o MapLibre altera o objecto de estilo que recebe. Passar
        // sempre a mesma constante fazia com que um segundo mapa (outra
        // página, ou um recarregamento a quente) recebesse um estilo já
        // consumido e ficasse em branco, sem erro nenhum.
        style: structuredClone(ESTILO_AZULEJO),
        center: VISTA_PORTUGAL.center,
        zoom: VISTA_PORTUGAL.zoom,
        minZoom: 4,
        maxZoom: 19,
        attributionControl: false,
        // O mapa é a interface: sem inclinação nem rotação, que só confundem.
        pitchWithRotate: false,
        dragRotate: false,
      });
      mapa.current = m;

      // Um mapa que falha em silêncio é pior do que um que o diz.
      m.on("error", (e) => {
        console.error("[mapa dos azulejos]", e.error?.message ?? e);
        setFalhou(true);
      });

      m.addControl(
        new AttributionControl({
          compact: true,
          customAttribution: ATRIBUICAO,
        }),
        "bottom-left"
      );

      m.on("load", () => {
        setFalhou(false);
        setPronto(true);

        m.addSource(FONTE, {
          type: "geojson",
          data: paraGeoJSON([]),
          cluster: true,
          clusterRadius: 48,
          clusterMaxZoom: 13,
        });

        m.addLayer({
          id: CAMADA_AGLOMERADOS,
          type: "circle",
          source: FONTE,
          filter: ["has", "point_count"],
          paint: {
            "circle-color": COBALTO.forte,
            "circle-radius": [
              "step",
              ["get", "point_count"],
              18,
              10,
              24,
              50,
              30,
              200,
              38,
            ],
            "circle-stroke-width": 3,
            "circle-stroke-color": COBALTO.vidrado,
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
            "text-size": 14,
          },
          paint: { "text-color": COBALTO.vidrado },
        });

        // Halo exterior: faz o ponto ler-se tanto no vidrado como no cobalto.
        m.addLayer({
          id: "paineis-halo",
          type: "circle",
          source: FONTE,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": COBALTO.vidrado,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              8,
              18,
              15,
            ],
          },
        });
        m.addLayer({
          id: CAMADA_PONTOS,
          type: "circle",
          source: FONTE,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": [
              "case",
              ["==", ["get", "estado"], "desaparecido"],
              COBALTO.vidrado,
              CORES_POR_ESTADO,
            ] as never,
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              5.5,
              18,
              11,
            ],
            "circle-stroke-width": 2.5,
            "circle-stroke-color": CORES_POR_ESTADO as never,
          },
        });

        const cursor = (v: string) => {
          m.getCanvas().style.cursor = v;
        };
        for (const camada of [CAMADA_AGLOMERADOS, CAMADA_PONTOS]) {
          m.on("mouseenter", camada, () => cursor("pointer"));
          m.on("mouseleave", camada, () => cursor(""));
        }

        m.on("click", CAMADA_AGLOMERADOS, (e) => {
          const f = e.features?.[0];
          if (!f) {
            return;
          }
          const [lng, lat] = (f.geometry as Point).coordinates;
          m.flyTo({
            center: [lng, lat],
            zoom: m.getZoom() + 2.5,
            duration: 700,
          });
        });
        m.on("click", CAMADA_PONTOS, (e) => {
          const id = e.features?.[0]?.properties?.id;
          if (typeof id === "string") {
            aoSelecionar.current?.(id);
          }
        });
      });

      // O contentor muda de tamanho quando a folha inferior se arrasta.
      const observador = new ResizeObserver(() => m.resize());
      observador.observe(alvo);

      return () => {
        observador.disconnect();
        m.remove();
        mapa.current = null;
        setPronto(false);
      };
    }, []);

    // Dados
    useEffect(() => {
      const m = mapa.current;
      if (!(m && pronto)) {
        return;
      }
      const fonte = m.getSource(FONTE) as GeoJSONSource | undefined;
      fonte?.setData(paraGeoJSON(paineis));
    }, [paineis, pronto]);

    // Filtro por estado: esbate em vez de esconder, para não mentir sobre o mapa.
    useEffect(() => {
      const m = mapa.current;
      if (!(m && pronto && m.getLayer(CAMADA_PONTOS))) {
        return;
      }
      const opacidade = filtro
        ? (["case", ["==", ["get", "estado"], filtro], 1, 0.15] as never)
        : 1;
      m.setPaintProperty(CAMADA_PONTOS, "circle-opacity", opacidade);
      m.setPaintProperty(CAMADA_PONTOS, "circle-stroke-opacity", opacidade);
      m.setPaintProperty("paineis-halo", "circle-opacity", opacidade);
    }, [filtro, pronto]);

    // Não juntar `relative` ao className recebido: quem chama passa
    // `absolute inset-0`, e as duas classes brigam — o Tailwind declara
    // `.relative` depois de `.absolute`, por isso ganhava `relative`, o
    // `inset-0` deixava de ter efeito e o contentor colapsava para 240px de
    // altura. Um elemento absoluto já serve de referência aos filhos
    // absolutos, por isso o `relative` só faz falta no caso por omissão.
    return (
      <div className={className ?? "relative h-full w-full"}>
        <div
          className="[&_.maplibregl-ctrl-attrib]:!text-[9px] [&_.maplibregl-ctrl-attrib]:!bg-white/70 h-full w-full"
          ref={contentor}
        />
        {!(pronto || falhou) && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: COBALTO.lavado }}
          />
        )}
        {falhou && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 px-8 text-center">
            <p className="font-body text-[15px] text-slate-600 leading-relaxed">
              Não foi possível carregar o mapa.
              <br />
              Verifique a ligação e recarregue.
            </p>
          </div>
        )}
      </div>
    );
  }
);

MapaAzulejos.displayName = "MapaAzulejos";
