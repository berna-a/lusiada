// Auto-ligação de palavras divergentes (estilo Wikipédia) às páginas do
// Dicionário. Usa só um conjunto pequeno de palavras de alta procura — não
// carrega o dicionário inteiro. Liga a PRIMEIRA ocorrência de cada palavra,
// para não encher o texto de links.

type Pair = { slug: string; ao: string; pre: string };

const PAIRS: Pair[] = [
  { slug: "acao", ao: "ação", pre: "acção" },
  { slug: "acoes", ao: "ações", pre: "acções" },
  { slug: "objetivo", ao: "objetivo", pre: "objectivo" },
  { slug: "objeto", ao: "objeto", pre: "objecto" },
  { slug: "direcao", ao: "direção", pre: "direcção" },
  { slug: "diretor", ao: "diretor", pre: "director" },
  { slug: "otimo", ao: "ótimo", pre: "óptimo" },
  { slug: "exato", ao: "exato", pre: "exacto" },
  { slug: "correto", ao: "correto", pre: "correcto" },
  { slug: "ator", ao: "ator", pre: "actor" },
  { slug: "atriz", ao: "atriz", pre: "actriz" },
  { slug: "atividade", ao: "atividade", pre: "actividade" },
  { slug: "atual", ao: "atual", pre: "actual" },
  { slug: "atualidade", ao: "atualidade", pre: "actualidade" },
  { slug: "fator", ao: "fator", pre: "factor" },
  { slug: "colecao", ao: "coleção", pre: "colecção" },
  { slug: "selecao", ao: "seleção", pre: "selecção" },
  { slug: "protecao", ao: "proteção", pre: "protecção" },
  { slug: "projeto", ao: "projeto", pre: "projecto" },
  { slug: "rececao", ao: "receção", pre: "recepção" },
  { slug: "excecao", ao: "exceção", pre: "excepção" },
  { slug: "arquiteto", ao: "arquiteto", pre: "arquitecto" },
  { slug: "arquitetura", ao: "arquitetura", pre: "arquitectura" },
  { slug: "perspetiva", ao: "perspetiva", pre: "perspectiva" },
  { slug: "respetivo", ao: "respetivo", pre: "respectivo" },
  { slug: "ativo", ao: "ativo", pre: "activo" },
  { slug: "adocao", ao: "adoção", pre: "adopção" },
  { slug: "batismo", ao: "batismo", pre: "baptismo" },
  { slug: "dialeto", ao: "dialeto", pre: "dialecto" },
  { slug: "eletricidade", ao: "eletricidade", pre: "electricidade" },
  { slug: "eletrico", ao: "elétrico", pre: "eléctrico" },
  { slug: "reacao", ao: "reação", pre: "reacção" },
  { slug: "fratura", ao: "fratura", pre: "fractura" },
  { slug: "infecao", ao: "infeção", pre: "infecção" },
  { slug: "inspecao", ao: "inspeção", pre: "inspecção" },
  { slug: "espetaculo", ao: "espetáculo", pre: "espectáculo" },
  { slug: "espetador", ao: "espetador", pre: "espectador" },
  { slug: "olfato", ao: "olfato", pre: "olfacto" },
  { slug: "teto", ao: "teto", pre: "tecto" },
  { slug: "tato", ao: "tato", pre: "tacto" },
  { slug: "coletivo", ao: "coletivo", pre: "colectivo" },
  { slug: "letivo", ao: "letivo", pre: "lectivo" },
  { slug: "afeto", ao: "afeto", pre: "afecto" },
];

const SLUG_BY_WORD = new Map<string, string>();
for (const p of PAIRS) {
  SLUG_BY_WORD.set(p.ao.toLowerCase(), p.slug);
  SLUG_BY_WORD.set(p.pre.toLowerCase(), p.slug);
}

const TAG_SPLIT = /(<[^>]+>)/;
const WORD = /[\p{L}][\p{L}'-]*/gu;

/**
 * Liga a primeira ocorrência de cada palavra divergente ao Dicionário.
 * Preserva HTML e não liga dentro de âncoras já existentes.
 */
export function autolinkDicionario(html: string): string {
  if (!html) {
    return html;
  }
  const linked = new Set<string>();
  let insideAnchor = false;
  return html
    .split(TAG_SPLIT)
    .map((seg) => {
      if (seg.startsWith("<") && seg.endsWith(">")) {
        if (/^<a\b/i.test(seg)) {
          insideAnchor = true;
        } else if (/^<\/a>/i.test(seg)) {
          insideAnchor = false;
        }
        return seg;
      }
      if (insideAnchor) {
        return seg;
      }
      return seg.replace(WORD, (word) => {
        const slug = SLUG_BY_WORD.get(word.toLowerCase());
        if (slug && !linked.has(slug)) {
          linked.add(slug);
          return `<a class="grafia-termo" href="/dicionario/${slug}">${word}</a>`;
        }
        return word;
      });
    })
    .join("");
}
