// Sitemap dinâmico: páginas estáticas + todos os artigos publicados da Lusopédia.
import VERBETES from "../src/data/dicionario/indexaveis.json" with {
  type: "json",
};

const BASE = "https://www.alusiada.pt";

const RE_OSLUSIADAS = /(^|\.)oslusiadas\.pt$/i;

const STATIC_PATHS = [
  "/",
  "/arca",
  "/arca/lusopedia",
  "/arca/panteao",
  "/dicionario",
  "/os-lusiadas",
  "/os-lusiadas/canto/2",
  "/os-lusiadas/canto/3",
  "/os-lusiadas/canto/4",
  "/os-lusiadas/canto/5",
  "/os-lusiadas/canto/6",
  "/os-lusiadas/canto/7",
  "/os-lusiadas/canto/8",
  "/os-lusiadas/canto/9",
  "/os-lusiadas/canto/10",
  "/associacao",
  "/sobre/manifesto",
  "/sobre/objectivos",
  "/programa",
  "/desporto",
  "/apoiar",
  "/aderir",
  "/contactos",
  "/os-lusiadas/perguntas",
  "/os-lusiadas/episodios",
  "/os-lusiadas/episodios/ines-de-castro",
  "/os-lusiadas/episodios/velho-do-restelo",
  "/os-lusiadas/episodios/adamastor",
  "/os-lusiadas/episodios/ilha-dos-amores",
  "/os-lusiadas/decifrados",
  "/os-lusiadas/decifrados/temas-de-tese",
];

// Palavras de alta procura do dicionário (subconjunto curado — evita despejar
// milhares de páginas quase-iguais no Google).
const DICIONARIO_SLUGS = [
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
  "ato",
  "atos",
  "atuar",
  "atuacao",
  "ativar",
  "adotar",
  "adjetivo",
  "subjetivo",
  "fracao",
  "atracao",
  "distracao",
  "contracao",
  "tracao",
  "redacao",
  "fatura",
  "faturacao",
  "otica",
  "otimismo",
  "otimista",
  "otimizar",
  "noturno",
  "efetivo",
  "afetivo",
  "coletividade",
  "inseto",
  "detetar",
  "detecao",
  "recetor",
  "concecao",
  "dececao",
  "exceto",
  "correcao",
  "diretorio",
  "eletronico",
  "eletronica",
  "arquitetonico",
  "ereto",
  "perfecionismo",
  "selecionar",
  "colecionar",
];

function isoDate(ms) {
  return new Date(ms).toISOString().split("T")[0];
}

export default async function handler(req, res) {
  const today = isoDate(Date.now());
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";

  // Domínio dedicado oslusiadas.pt — sitemap próprio com o leitor da obra.
  if (RE_OSLUSIADAS.test(host)) {
    const LUS_BASE = "https://oslusiadas.pt";
    const paths = [
      "/",
      "/canto/2",
      "/canto/3",
      "/canto/4",
      "/canto/5",
      "/canto/6",
      "/canto/7",
      "/canto/8",
      "/canto/9",
      "/canto/10",
      "/plano",
      "/viagem",
      "/perguntas",
      "/episodios",
      "/episodios/ines-de-castro",
      "/episodios/velho-do-restelo",
      "/episodios/adamastor",
      "/episodios/ilha-dos-amores",
      "/decifrados",
      "/decifrados/temas-de-tese",
    ];
    const xmlL = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${LUS_BASE}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.status(200).send(xmlL);
    return;
  }

  // entradas: { path, lastmod }
  let articles = [];
  const convexUrl = process.env.VITE_CONVEX_URL;
  if (convexUrl) {
    try {
      const r = await fetch(`${convexUrl}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "articles:list",
          args: {},
          format: "json",
        }),
      });
      const data = await r.json();
      const items = Array.isArray(data) ? data : (data?.value ?? []);
      articles = items
        .filter((a) => a?.slug)
        .map((a) => ({
          path: `/arca/lusopedia/${a.slug}`,
          lastmod: a.createdAt ? isoDate(a.createdAt) : today,
        }));
    } catch {
      articles = [];
    }
  }

  const entries = [
    ...STATIC_PATHS.map((p) => ({ path: p, lastmod: today })),
    ...articles,
    ...DICIONARIO_SLUGS.map((s) => ({
      path: `/dicionario/${s}`,
      lastmod: today,
    })),
    ...VERBETES.map((s) => ({ path: `/dicionario/${s}`, lastmod: today })),
  ];
  const urls = entries
    .map(
      (e) =>
        `  <url><loc>${BASE}${e.path}</loc><lastmod>${e.lastmod}</lastmod></url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
}
