import type { Map as MapLibreMap, MapMouseEvent, Point } from "maplibre-gl";
import { COBALTO } from "./mapa-estilo";
import { charneira } from "./zonas";

/**
 * O segundo andar do mapa: as províncias históricas do continente.
 *
 * Minho, Beira Alta, Ribatejo, Alentejo — a divisão de 1936. Não é divisão
 * administrativa nenhuma e não existe em carta oficial, mas é a que as
 * pessoas usam quando dizem de onde são, e é essa que interessa a um mapa
 * de património. A geometria é montada por `scripts/construir_provincias.py`.
 *
 * Entram exactamente onde as zonas saem, e saem quando o mapa passa a ser
 * das ruas. A interacção é a mesma: o nome está sempre escrito, o rato acende
 * a província por baixo dele, o clique entra nela.
 */

/**
 * Quanto é preciso aproximar, a partir da charneira, até o mapa passar a ser
 * das ruas. Três zooms e meio é a distância entre ver o país e ver uma cidade.
 */
const ATE_ÀS_RUAS = 3.4;

const FONTE = "provincias";
const CERCADURA = "provincias-cercadura";
const AREA = "provincias-area";
const REALCE = "provincia-realce";
const NOME = "provincia-nome";

/** Filtro que não apanha nada — o estado de repouso do realce. */
const NENHUMA = " ";

const SO_TIPO = (tipo: string) => ["==", ["get", "tipo"], tipo] as never;

/** Placeholder: a opacidade real é posta por `escalar()`, que sabe o ecrã. */
const desvanecer = (maximo: number) => maximo;

type Opcoes = {
  aoEscolher: (limites: [[number, number], [number, number]]) => void;
  /** Camadas que ganham ao clique — os painéis e os seus aglomerados. */
  camadasDeTopo?: string[];
};

/** Lê os limites que o ficheiro traz em texto. Devolve null se vierem mal. */
function limitesDe(
  valor: unknown
): [[number, number], [number, number]] | null {
  const n = String(valor ?? "")
    .split(",")
    .map(Number);
  if (n.length !== 4 || n.some((v) => !Number.isFinite(v))) {
    return null;
  }
  return [
    [n[0], n[1]],
    [n[2], n[3]],
  ];
}

/**
 * Instala as províncias no mapa. Devolve a função que as desmonta.
 * Chamar dentro do `style.load`, a seguir às zonas e antes dos painéis.
 */
export function instalarProvincias(
  m: MapLibreMap,
  { aoEscolher, camadasDeTopo = [] }: Opcoes
): () => void {
  m.addSource(FONTE, {
    type: "geojson",
    data: "/geo/provincias-portugal.json",
  });

  // A área existe para o rato ter onde pousar; o desenho é a cercadura.
  m.addLayer({
    id: AREA,
    type: "fill",
    source: FONTE,
    filter: SO_TIPO("area"),
    paint: { "fill-color": COBALTO.claro, "fill-opacity": desvanecer(0.12) },
  });

  m.addLayer({
    id: REALCE,
    type: "fill",
    source: FONTE,
    filter: ["==", ["get", "provincia"], NENHUMA],
    paint: { "fill-color": COBALTO.claro, "fill-opacity": desvanecer(0.55) },
  });

  m.addLayer({
    id: CERCADURA,
    type: "line",
    source: FONTE,
    filter: SO_TIPO("area"),
    layout: { "line-join": "round" },
    paint: {
      "line-color": COBALTO.medio,
      "line-width": 1.2,
      "line-dasharray": [4, 3],
      "line-opacity": desvanecer(0.8),
    },
  });

  // Sobre terra clara o nome é escuro — ao contrário do das zonas, que se
  // escreve em cima do mar. O MapLibre põe-no sozinho no centro da forma.
  m.addLayer({
    id: NOME,
    type: "symbol",
    source: FONTE,
    filter: SO_TIPO("nome"),
    layout: {
      "text-field": ["get", "nome"],
      "text-font": ["Noto Sans Bold"],
      "text-size": 13,
      "text-letter-spacing": 0.2,
      "text-transform": "uppercase",
      "text-max-width": 7,
      // Deixar os nomes sobreporem-se resolvia as quedas mas dava
      // «ESTREMADURA» por cima de «RIBATEJO». Assim o MapLibre pode afastar
      // o nome do centro da província até ele caber, em vez de o deitar fora.
      "text-variable-anchor": ["center", "top", "bottom", "left", "right"],
      "text-radial-offset": 0.7,
      "text-justify": "auto",
      "text-padding": 2,
    },
    paint: {
      "text-color": COBALTO.forte,
      "text-halo-color": COBALTO.vidrado,
      "text-halo-width": 2,
      "text-opacity": desvanecer(1),
    },
  });

  // Aparecem quando as zonas se apagam e apagam-se à porta das ruas. Os dois
  // limites dependem da largura do ecrã, por isso recalculam-se no `resize`.
  let entrada = 0;
  let saida = 0;
  const escalar = () => {
    const { inicio, meio, fim } = charneira(m);
    entrada = meio;
    saida = fim + ATE_ÀS_RUAS;
    const curva = (maximo: number) =>
      [
        "interpolate",
        ["linear"],
        ["zoom"],
        inicio,
        0,
        fim,
        maximo,
        saida - 0.6,
        maximo,
        saida,
        0,
      ] as never;
    m.setPaintProperty(AREA, "fill-opacity", curva(0.12));
    m.setPaintProperty(REALCE, "fill-opacity", curva(0.55));
    m.setPaintProperty(CERCADURA, "line-opacity", curva(0.8));
    m.setPaintProperty(NOME, "text-opacity", curva(1));
  };
  escalar();

  let realcada: string | null = null;

  const realcar = (provincia: string | null) => {
    if (provincia === realcada) {
      return;
    }
    realcada = provincia;
    m.setFilter(REALCE, [
      "all",
      SO_TIPO("area"),
      ["==", ["get", "provincia"], provincia ?? NENHUMA],
    ] as never);
    m.getCanvas().style.cursor = provincia ? "pointer" : "";
  };

  const provinciaEm = (ponto: Point) => {
    const zoom = m.getZoom();
    if (zoom <= entrada || zoom >= saida) {
      return null;
    }
    if (m.queryRenderedFeatures(ponto, { layers: camadasDeTopo }).length > 0) {
      return null;
    }
    return m.queryRenderedFeatures(ponto, { layers: [AREA] })[0] ?? null;
  };

  const aoMover = (e: MapMouseEvent) => {
    const f = provinciaEm(e.point);
    const id = f?.properties?.provincia;
    realcar(typeof id === "string" ? id : null);
  };

  const aoSair = () => realcar(null);

  // Arrastar o mapa não é escolher uma província.
  let arrastou = false;
  const aoArrastar = () => {
    arrastou = true;
  };

  const aoClicar = (e: MapMouseEvent) => {
    if (arrastou) {
      arrastou = false;
      return;
    }
    const limites = limitesDe(provinciaEm(e.point)?.properties?.limites);
    if (limites) {
      aoEscolher(limites);
    }
  };

  m.on("resize", escalar);
  m.on("mousemove", aoMover);
  m.on("mouseout", aoSair);
  m.on("dragstart", aoArrastar);
  m.on("click", aoClicar);

  return () => {
    realcar(null);
    m.off("resize", escalar);
    m.off("mousemove", aoMover);
    m.off("mouseout", aoSair);
    m.off("dragstart", aoArrastar);
    m.off("click", aoClicar);
  };
}
