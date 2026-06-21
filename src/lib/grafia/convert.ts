// Motor de conversão entre grafias (determinístico, sem IA).
//
// Pega num texto/HTML em Portuguez (a forma canónica) e devolve-o noutra grafia,
// trocando apenas as palavras que constam do léxico. Preserva tags HTML,
// pontuação, espaços e o padrão de maiúsculas de cada palavra.
//
// Fontes do léxico:
//  • divergencias.json — eixo consoante/maiúsculas AO90 ↔ pré-AO90 (~7,5k pares).
//  • LEXICON (lexicon.ts) — camada Portuguez (z, nomes, acentos), editável.

import divergencias from "./divergencias.json";
import { type Grafia, LEXICON } from "./lexicon";

type Entry = { pz: string; ao: string; pre: string; caseExact?: boolean };

const MAPS: Record<Grafia, Map<string, Entry>> = {
  pz: new Map(),
  ao: new Map(),
  pre: new Map(),
};

function register(entry: Entry) {
  MAPS.pz.set(entry.pz.toLowerCase(), entry);
  MAPS.ao.set(entry.ao.toLowerCase(), entry);
  MAPS.pre.set(entry.pre.toLowerCase(), entry);
}

// Eixo consoante AO90: Portuguez e pré-AO usam a forma antiga (chave); AO90 a nova.
const data = divergencias as {
  general: Record<string, string>;
  case_change: Record<string, string>;
};
for (const [old, novo] of Object.entries(data.general)) {
  register({ pz: old, ao: novo, pre: old });
}
for (const [old, novo] of Object.entries(data.case_change)) {
  register({ pz: old, ao: novo, pre: old, caseExact: true });
}
// Camada Portuguez (sobrepõe-se, é a nossa decisão autoritária).
for (const entry of LEXICON) {
  register(entry);
}

/** Aplica o padrão de maiúsculas de `source` à palavra `target`. */
function matchCase(source: string, target: string) {
  if (source === source.toUpperCase() && source !== source.toLowerCase()) {
    return target.toUpperCase();
  }
  if (source[0] === source[0].toUpperCase()) {
    return target[0].toUpperCase() + target.slice(1);
  }
  return target;
}

const TAG_SPLIT = /(<[^>]+>)/;
const WORD = /[\p{L}][\p{L}­'-]*/gu;

/**
 * Converte um texto/HTML de uma grafia para outra.
 * @param text conteúdo (texto simples ou HTML)
 * @param to grafia de destino
 * @param from grafia de origem (por omissão "pz")
 */
export function convertGrafia(
  text: string,
  to: Grafia,
  from: Grafia = "pz"
): string {
  if (!text || from === to) {
    return text;
  }
  const source = MAPS[from];
  return text
    .split(TAG_SPLIT)
    .map((segment) => {
      if (segment.startsWith("<") && segment.endsWith(">")) {
        return segment;
      }
      return segment.replace(WORD, (word) => {
        const entry = source.get(word.toLowerCase());
        if (!entry) {
          return word;
        }
        return entry.caseExact ? entry[to] : matchCase(word, entry[to]);
      });
    })
    .join("");
}

/** Nome legível de cada grafia (para o seletor). */
export const GRAFIA_LABELS: Record<Grafia, string> = {
  pz: "Portuguez",
  ao: "Português (AO 1990)",
  pre: "Português (pré-acordo)",
};

/** Número de divergências carregadas (diagnóstico). */
export const LEXICON_SIZE = MAPS.pz.size;
