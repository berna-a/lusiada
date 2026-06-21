// Motor de conversão entre grafias (determinístico, sem IA).
//
// Pega num texto/HTML em Portuguez (a forma canónica) e devolve-o noutra grafia,
// trocando apenas as palavras que constam do léxico. Preserva tags HTML,
// pontuação, espaços e o padrão de maiúsculas de cada palavra.

import { type Grafia, LEXICON, type LexEntry } from "./lexicon";

/** Mapa por grafia de origem: forma minúscula → entrada do léxico. */
const MAPS: Record<Grafia, Map<string, LexEntry>> = {
  pz: new Map(),
  ao: new Map(),
  pre: new Map(),
};
for (const entry of LEXICON) {
  MAPS.pz.set(entry.pz.toLowerCase(), entry);
  MAPS.ao.set(entry.ao.toLowerCase(), entry);
  MAPS.pre.set(entry.pre.toLowerCase(), entry);
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

// Divide em tags HTML (preservadas) e texto. Captura o separador.
const TAG_SPLIT = /(<[^>]+>)/;
// Palavras: letras unicode + apóstrofos/hífenes internos.
const WORD = /[\p{L}][\p{L}­'-]*/gu;

/**
 * Converte um texto/HTML de uma grafia para outra.
 * @param text conteúdo (texto simples ou HTML)
 * @param from grafia de origem (por omissão "pz")
 * @param to grafia de destino
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
        return segment; // tag HTML — não tocar
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
