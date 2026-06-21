// Dados do dicionário de grafias — para as páginas de SEO (/dicionario/:slug)
// que respondem "ação ou acção?" e apresentam o Portuguez.
//
// Carrega o mesmo `divergencias.json` do conversor (~300 KB) — usado só nas
// páginas do dicionário (lazy-load), não no bundle principal.

import divergencias from "./divergencias.json";

export type DicEntry = {
  slug: string;
  /** Acordo Ortográfico de 1990. */
  ao: string;
  /** Pré-acordo (= Portuguez no eixo consoante). */
  pre: string;
  kind: "consoante" | "mes";
};

export function asciiSlug(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let ENTRIES: DicEntry[] | null = null;
let BY_SLUG: Map<string, DicEntry> | null = null;

function build() {
  if (ENTRIES && BY_SLUG) {
    return { entries: ENTRIES, bySlug: BY_SLUG };
  }
  const entries: DicEntry[] = [];
  const bySlug = new Map<string, DicEntry>();
  const data = divergencias as {
    general: Record<string, string>;
    case_change: Record<string, string>;
  };
  const add = (pre: string, ao: string, kind: DicEntry["kind"]) => {
    const slug = asciiSlug(ao);
    if (!slug || bySlug.has(slug)) {
      return;
    }
    const e: DicEntry = { slug, ao, pre, kind };
    entries.push(e);
    bySlug.set(slug, e);
  };
  for (const [pre, ao] of Object.entries(data.general)) {
    add(pre, ao, "consoante");
  }
  for (const [pre, ao] of Object.entries(data.case_change)) {
    add(pre, ao, "mes");
  }
  ENTRIES = entries;
  BY_SLUG = bySlug;
  return { entries, bySlug };
}

export function getEntry(slug: string): DicEntry | null {
  return build().bySlug.get(slug) ?? null;
}

export function allEntries(): DicEntry[] {
  return build().entries;
}

/** Letra muda que o AO90 eliminou (primeira posição onde pré e AO divergem). */
export function droppedLetter(entry: DicEntry): string | null {
  if (entry.kind !== "consoante") {
    return null;
  }
  for (let i = 0; i < entry.pre.length; i += 1) {
    if (entry.pre[i] !== entry.ao[i]) {
      return entry.pre[i].toUpperCase();
    }
  }
  return null;
}

/** Palavras de alta procura (slugs ascii) — entram no sitemap e no índice. */
export const COMMON_WORDS = [
  "acao",
  "acoes",
  "objetivo",
  "objeto",
  "direcao",
  "diretor",
  "otimo",
  "exato",
  "correto",
  "ator",
  "atriz",
  "atividade",
  "atual",
  "atualidade",
  "fator",
  "colecao",
  "selecao",
  "protecao",
  "projeto",
  "rececao",
  "excecao",
  "arquiteto",
  "arquitetura",
  "perspetiva",
  "respetivo",
  "ativo",
  "adocao",
  "batismo",
  "dialeto",
  "eletricidade",
  "eletrico",
  "reacao",
  "fratura",
  "infecao",
  "inspecao",
  "espetaculo",
  "espetador",
  "olfato",
  "teto",
  "tato",
  "coletivo",
  "letivo",
  "afeto",
];
