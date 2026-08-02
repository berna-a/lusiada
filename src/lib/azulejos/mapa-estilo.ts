import type { StyleSpecification } from "maplibre-gl";

/**
 * Estilo próprio do mapa dos azulejos: fundo branco, traço a azul cobalto.
 * A ideia não é um mapa de estradas com alfinetes por cima — é um mapa que
 * pareça, ele próprio, desenhado em azulejo. Por isso não há verdes, não há
 * cores de trânsito e não há pontos de interesse: a única coisa colorida no
 * ecrã é o património.
 *
 * Os dados vêm do OpenFreeMap (OpenStreetMap, esquema OpenMapTiles) — serviço
 * livre, sem chave nem registo. A atribuição é obrigatória e está no rodapé
 * do componente do mapa.
 */

/** Paleta de cobalto, do mais lavado ao mais escuro. */
export const COBALTO = {
  lavado: "#DCE8F4",
  claro: "#A8C2DE",
  medio: "#5B84BA",
  forte: "#1B4F9C",
  escuro: "#12345F",
} as const;

/** Cores dos painéis no mapa, por estado de conservação. */
export const COR_ESTADO = {
  integro: "#1B4F9C",
  danificado: "#B8860B",
  em_risco: "#C2410C",
  desaparecido: "#8A8A8A",
} as const;

export const ATRIBUICAO =
  '<a href="https://openfreemap.org" target="_blank" rel="noreferrer">OpenFreeMap</a> · <a href="https://www.openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';

const FONTE = "openmaptiles";

export const ESTILO_AZULEJO: StyleSpecification = {
  version: 8,
  name: "Azulejo",
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    [FONTE]: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
  },
  layers: [
    {
      id: "fundo",
      type: "background",
      paint: { "background-color": "#FFFFFF" },
    },

    // Água: um banho muito claro, como o vidrado de um azulejo branco.
    {
      id: "agua",
      type: "fill",
      source: FONTE,
      "source-layer": "water",
      filter: ["!=", ["get", "brunnel"], "tunnel"],
      paint: { "fill-color": COBALTO.lavado },
    },
    {
      id: "agua-contorno",
      type: "line",
      source: FONTE,
      "source-layer": "water",
      paint: { "line-color": COBALTO.claro, "line-width": 0.6 },
    },
    {
      id: "rios",
      type: "line",
      source: FONTE,
      "source-layer": "waterway",
      minzoom: 7,
      paint: {
        "line-color": COBALTO.claro,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.5, 16, 2],
      },
    },

    // Edificado: só ao perto, e apenas como um sussurro — dá contexto de rua
    // sem competir com os painéis.
    {
      id: "edificado",
      type: "fill",
      source: FONTE,
      "source-layer": "building",
      minzoom: 15,
      paint: {
        "fill-color": "#F2F6FA",
        "fill-outline-color": COBALTO.lavado,
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 15, 0, 16.5, 1],
      },
    },

    // Estradas: três pesos de traço, todos a cobalto. Sem preenchimento,
    // sem casing, sem cor de trânsito.
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.4, 18, 3],
      },
    },
    {
      id: "vias-secundarias",
      type: "line",
      source: FONTE,
      "source-layer": "transportation",
      minzoom: 9,
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.5, 18, 5],
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
        "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 18, 6],
        "line-opacity": 0.75,
      },
    },

    // Fronteiras e limites administrativos, a tracejado — como a cercadura
    // de um painel.
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
        "line-width": 0.8,
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
      paint: { "line-color": COBALTO.medio, "line-width": 1.2 },
    },

    // Nomes de lugar: azul escuro, espaçado, sem halo pesado.
    {
      id: "nomes-localidades",
      type: "symbol",
      source: FONTE,
      "source-layer": "place",
      minzoom: 8,
      filter: [
        "match",
        ["get", "class"],
        ["town", "village", "suburb", "neighbourhood"],
        true,
        false,
      ],
      layout: {
        "text-field": ["get", "name:pt"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 8, 10, 14, 13],
        "text-letter-spacing": 0.08,
        "text-max-width": 8,
      },
      paint: {
        "text-color": COBALTO.medio,
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.2,
      },
    },
    {
      id: "nomes-cidades",
      type: "symbol",
      source: FONTE,
      "source-layer": "place",
      filter: ["==", ["get", "class"], "city"],
      layout: {
        "text-field": ["get", "name:pt"],
        "text-font": ["Noto Sans Bold"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 4, 11, 12, 17],
        "text-letter-spacing": 0.12,
        "text-transform": "uppercase",
        "text-max-width": 9,
      },
      paint: {
        "text-color": COBALTO.escuro,
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 1.5,
      },
    },
  ],
};

/** Enquadramento inicial: Portugal continental inteiro. */
export const VISTA_PORTUGAL = {
  center: [-8.2, 39.6] as [number, number],
  zoom: 5.9,
};

/** Trava a navegação ao território português (continente, Madeira, Açores). */
export const LIMITES_PORTUGAL: [number, number, number, number] = [
  -32, 30, -6, 43,
];
