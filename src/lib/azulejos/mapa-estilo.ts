import type { StyleSpecification } from "maplibre-gl";

/**
 * Estilo próprio do mapa: um painel de azulejo, não um mapa de estradas.
 *
 * A lógica é a de um azulejo pintado — o mar a cobalto cheio, a terra no
 * branco quente do vidrado, e todo o desenho (rios, vias, limites) a cobalto
 * por cima. Nada de verdes, nada de cores de trânsito, nada de pontos de
 * interesse: a única coisa que destoa no ecrã são os painéis registados.
 *
 * O branco é `#F7F5F1` e não `#FFFFFF` de propósito: o vidrado de um azulejo
 * nunca é branco puro, e o branco puro fazia o mapa desaparecer no fundo da
 * página.
 *
 * Dados: OpenFreeMap (OpenStreetMap, esquema OpenMapTiles) — livre, sem chave
 * nem registo. A atribuição é obrigatória e vai no canto do mapa.
 */

/** Paleta do azulejo. Cobalto escuro e dessaturado, longe do azul de postal. */
export const COBALTO = {
  vidrado: "#F7F5F1",
  lavado: "#DDE7F1",
  claro: "#A9C0D8",
  medio: "#4E7BAE",
  forte: "#1E4C8A",
  escuro: "#123A6B",
  tinta: "#0C2A4F",
} as const;

/** Cores dos painéis. Discos com halo branco — legíveis no mar e na terra. */
export const COR_ESTADO = {
  integro: "#1E4C8A",
  danificado: "#C98A2B",
  em_risco: "#C2410C",
  desaparecido: "#93A3B3",
} as const;

export const ROTULO_ESTADO = {
  integro: "Íntegro",
  danificado: "Danificado",
  em_risco: "Em risco",
  desaparecido: "Desaparecido",
} as const;

export type Estado = keyof typeof COR_ESTADO;

export const ATRIBUICAO =
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

const FONTE = "openmaptiles";
const TILES = "https://tiles.openfreemap.org/planet";

export const ESTILO_AZULEJO: StyleSpecification = {
  version: 8,
  name: "Azulejo",
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    [FONTE]: { type: "vector", url: TILES },
  },
  layers: [
    // A terra é o fundo, no branco do vidrado; a água vem por cima, a cobalto.
    //
    // Tem de ser por esta ordem. O contrário — fundo azul e terra desenhada
    // por cima — parece igual mas não é: as camadas `landcover`/`landuse` só
    // trazem florestas, parques e zonas urbanas, não o território todo, e o
    // azul apareceria aos borrões por baixo. O oceano, esse, vem mesmo nos
    // dados (`water`, class=ocean), por isso pinta-se.
    {
      id: "terra",
      type: "background",
      paint: { "background-color": COBALTO.vidrado },
    },
    {
      id: "agua",
      type: "fill",
      source: FONTE,
      "source-layer": "water",
      paint: { "fill-color": COBALTO.forte },
    },
    {
      id: "rios",
      type: "line",
      source: FONTE,
      "source-layer": "waterway",
      minzoom: 6,
      paint: {
        "line-color": COBALTO.medio,
        "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.6, 16, 2.5],
      },
    },

    // Edificado: só ao perto, o sussurro que dá contexto de rua.
    {
      id: "edificado",
      type: "fill",
      source: FONTE,
      "source-layer": "building",
      minzoom: 14.5,
      paint: {
        "fill-color": COBALTO.lavado,
        "fill-outline-color": COBALTO.claro,
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 14.5, 0, 16, 1],
      },
    },

    // Vias: três pesos, todos a cobalto, sem contorno e sem cor de trânsito.
    {
      id: "vias-menores",
      type: "line",
      source: FONTE,
      "source-layer": "transportation",
      minzoom: 12,
      filter: [
        "match",
        ["get", "class"],
        ["minor", "service", "path", "track"],
        true,
        false,
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": COBALTO.claro,
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.6, 18, 4],
      },
    },
    {
      id: "vias-secundarias",
      type: "line",
      source: FONTE,
      "source-layer": "transportation",
      minzoom: 8,
      filter: [
        "match",
        ["get", "class"],
        ["secondary", "tertiary"],
        true,
        false,
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": COBALTO.medio,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.7, 18, 6],
      },
    },
    {
      id: "vias-principais",
      type: "line",
      source: FONTE,
      "source-layer": "transportation",
      minzoom: 5,
      filter: [
        "match",
        ["get", "class"],
        ["motorway", "trunk", "primary"],
        true,
        false,
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": COBALTO.forte,
        "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.8, 18, 7],
      },
    },

    // Limites administrativos, tracejados como a cercadura de um painel.
    {
      id: "limites-concelho",
      type: "line",
      source: FONTE,
      "source-layer": "boundary",
      minzoom: 7,
      filter: [
        "all",
        [">=", ["get", "admin_level"], 3],
        ["<=", ["get", "admin_level"], 6],
        ["!=", ["get", "maritime"], 1],
      ],
      paint: {
        "line-color": COBALTO.claro,
        "line-width": 1,
        "line-dasharray": [3, 2],
      },
    },
    {
      id: "limites-pais",
      type: "line",
      source: FONTE,
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", ["get", "admin_level"], 2],
        ["!=", ["get", "maritime"], 1],
      ],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": COBALTO.escuro, "line-width": 1.6 },
    },

    // Nomes. Poucos, espaçados, sempre com halo do vidrado por baixo.
    {
      id: "nomes-localidades",
      type: "symbol",
      source: FONTE,
      "source-layer": "place",
      minzoom: 9,
      filter: [
        "match",
        ["get", "class"],
        ["town", "village", "suburb", "neighbourhood"],
        true,
        false,
      ],
      layout: {
        "text-field": ["coalesce", ["get", "name:pt"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 9, 10, 15, 13],
        "text-letter-spacing": 0.06,
        "text-max-width": 8,
      },
      paint: {
        "text-color": COBALTO.medio,
        "text-halo-color": COBALTO.vidrado,
        "text-halo-width": 1.4,
      },
    },
    {
      id: "nomes-cidades",
      type: "symbol",
      source: FONTE,
      "source-layer": "place",
      filter: ["==", ["get", "class"], "city"],
      layout: {
        "text-field": ["coalesce", ["get", "name:pt"], ["get", "name"]],
        "text-font": ["Noto Sans Bold"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 4, 11, 12, 16],
        "text-letter-spacing": 0.14,
        "text-transform": "uppercase",
        "text-max-width": 9,
      },
      paint: {
        "text-color": COBALTO.tinta,
        "text-halo-color": COBALTO.vidrado,
        "text-halo-width": 1.8,
      },
    },
  ],
};

/** Portugal continental inteiro no arranque. */
export const VISTA_PORTUGAL = {
  center: [-8.3, 39.6] as [number, number],
  zoom: 6.1,
};
