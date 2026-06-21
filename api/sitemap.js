// Sitemap dinâmico: páginas estáticas + todos os artigos publicados da Lusopédia.
const BASE = "https://www.alusiada.pt";

const STATIC_PATHS = [
  "/",
  "/arca",
  "/arca/lusopedia",
  "/arca/panteao",
  "/dicionario",
  "/associacao",
  "/sobre/manifesto",
  "/sobre/objectivos",
  "/programa",
  "/apoiar",
  "/aderir",
  "/contactos",
];

// Palavras de alta procura do dicionário (subconjunto curado — evita despejar
// milhares de páginas quase-iguais no Google).
const DICIONARIO_SLUGS = [
  "acao", "acoes", "objetivo", "objeto", "direcao", "diretor", "otimo",
  "exato", "correto", "ator", "atriz", "atividade", "atual", "atualidade",
  "fator", "colecao", "selecao", "protecao", "projeto",
  "rececao", "excecao", "arquiteto", "arquitetura", "perspetiva", "respetivo",
  "ativo", "adocao", "batismo", "dialeto", "eletricidade", "eletrico",
  "reacao", "fratura", "infecao", "inspecao", "espetaculo", "espetador",
  "olfato", "teto", "tato", "coletivo", "letivo", "afeto",
];

export default async function handler(_req, res) {
  let articlePaths = [];
  const convexUrl = process.env.VITE_CONVEX_URL;
  if (convexUrl) {
    try {
      const r = await fetch(`${convexUrl}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "articles:list", args: {}, format: "json" }),
      });
      const data = await r.json();
      const items = Array.isArray(data) ? data : (data?.value ?? []);
      articlePaths = items
        .filter((a) => a && a.slug)
        .map((a) => `/arca/lusopedia/${a.slug}`);
    } catch {
      articlePaths = [];
    }
  }

  const dicionarioPaths = DICIONARIO_SLUGS.map((s) => `/dicionario/${s}`);
  const paths = [...STATIC_PATHS, ...articlePaths, ...dicionarioPaths];
  const urls = paths
    .map((p) => `  <url><loc>${BASE}${p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
}
