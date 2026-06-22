// Dicionário completo da Língua (verbetes com definição) — piloto: letra A.
//
// Fonte: Dicionário-Aberto (dicionario-aberto.net), baseado no dicionário de
// Cândido de Figueiredo (1913), domínio público. Licença CC BY-SA 2.5 PT.
// As definições estão em ortografia de 1913 (a modernizar) — por isso entram
// como `noindex` até serem revistas/reescritas em Portuguez.
//
// Carrega o ficheiro da letra sob procura (lazy, fora do bundle principal).

export type Verbete = {
  slug: string;
  word: string;
  pos: string;
  defs: string[];
  etym?: string;
  /** Exemplos/citações (quando a fonte os tem). */
  ex?: string[];
};

const letterLoaders = import.meta.glob("../../data/dicionario/*.json");
const cache = new Map<string, Verbete[]>();

function firstLetter(s: string): string | null {
  const c = (s.trim()[0] ?? "").toLowerCase();
  return /[a-z]/.test(c) ? c : null;
}

async function loadLetter(letter: string): Promise<Verbete[]> {
  const cached = cache.get(letter);
  if (cached) {
    return cached;
  }
  const loader = letterLoaders[`../../data/dicionario/${letter}.json`];
  if (!loader) {
    cache.set(letter, []);
    return [];
  }
  const mod = (await loader()) as { default: Verbete[] };
  const list = mod.default ?? [];
  cache.set(letter, list);
  return list;
}

/** Letras já importadas (têm ficheiro). */
export function importedLetters(): string[] {
  return Object.keys(letterLoaders)
    .map((p) => p.match(/\/([a-z])\.json$/)?.[1])
    .filter((l): l is string => Boolean(l))
    .sort();
}

export async function getVerbete(slug: string): Promise<Verbete | null> {
  const letter = firstLetter(slug);
  if (!letter) {
    return null;
  }
  const list = await loadLetter(letter);
  return list.find((v) => v.slug === slug) ?? null;
}

export type VerbeteContext = {
  verbete: Verbete;
  /** Entradas alfabeticamente próximas (teia interna de navegação). */
  neighbors: Verbete[];
};

/** Verbete + palavras vizinhas (3 antes, 3 depois) na ordem alfabética. */
export async function getVerbeteContext(
  slug: string
): Promise<VerbeteContext | null> {
  const letter = firstLetter(slug);
  if (!letter) {
    return null;
  }
  const list = await loadLetter(letter);
  const i = list.findIndex((v) => v.slug === slug);
  if (i < 0) {
    return null;
  }
  const before = list.slice(Math.max(0, i - 3), i);
  const after = list.slice(i + 1, i + 4);
  return { verbete: list[i], neighbors: [...before, ...after] };
}

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase();
}

/** Pesquisa por prefixo (e depois por inclusão) na letra correspondente. */
export async function searchVerbetes(
  query: string,
  limit = 30
): Promise<Verbete[]> {
  const q = norm(query.trim());
  const letter = firstLetter(q);
  if (!letter || q.length < 2) {
    return [];
  }
  const list = await loadLetter(letter);
  const starts: Verbete[] = [];
  const contains: Verbete[] = [];
  for (const v of list) {
    const w = norm(v.word);
    if (w.startsWith(q)) {
      starts.push(v);
    } else if (w.includes(q)) {
      contains.push(v);
    }
    if (starts.length >= limit) {
      break;
    }
  }
  return [...starts, ...contains].slice(0, limit);
}
