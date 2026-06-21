// Prerender server-side das páginas do Dicionário de grafias.
//  • /dicionario        → landing (a missão das 3 grafias)
//  • /dicionario/:slug  → "«ação» ou «acção»?" para cada palavra divergente
// Conteúdo + meta + JSON-LD (DefinedTerm) para capturar as pesquisas de dúvidas
// ortográficas e apresentar o Portuguez como solução.

import divergencias from "../src/lib/grafia/divergencias.json";

const BASE = "https://www.alusiada.pt";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/HZLq0vi45GUkFlWe5135LqHlgSd2/social-images/social-1776901317952-Melhor_desenho.webp";
const ORG = {
  "@type": "Organization",
  name: "Associação Memória Lusíada",
  url: BASE,
  logo: `${BASE}/favicon.ico`,
};

// ── Dados ──
const bySlug = new Map();
function asciiSlug(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
for (const [pre, ao] of Object.entries(divergencias.general)) {
  const slug = asciiSlug(ao);
  if (slug && !bySlug.has(slug)) {
    bySlug.set(slug, { slug, ao, pre, kind: "consoante" });
  }
}
for (const [pre, ao] of Object.entries(divergencias.case_change)) {
  const slug = asciiSlug(ao);
  if (slug && !bySlug.has(slug)) {
    bySlug.set(slug, { slug, ao, pre, kind: "mes" });
  }
}

function droppedLetter(entry) {
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

// ── Shell + helpers (mesmo padrão de api/lusopedia.js) ──
let shellCache = null;
async function getShell(req) {
  if (shellCache) {
    return shellCache;
  }
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const r = await fetch(`${proto}://${host}/index.html`);
  shellCache = await r.text();
  return shellCache;
}
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function buildHead({ title, description, path, jsonLd }) {
  const url = BASE + path;
  const graph = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [ORG, ...graph],
  });
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:locale" content="pt_PT" />`,
    `<meta property="og:site_name" content="Lusopédia · Associação Memória Lusíada" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(DEFAULT_IMAGE)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join("\n    ");
}
function stripStatic(shell) {
  return shell
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta[^>]+name="description"[^>]*>/gi, "")
    .replace(/<meta[^>]+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta[^>]+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<link[^>]+rel="canonical"[^>]*>/gi, "");
}
function compose(shell, head, body) {
  return stripStatic(shell)
    .replace("</head>", `    ${head}\n  </head>`)
    .replace(/<div id="root">\s*<\/div>/, `<div id="root">${body}</div>`);
}
function send(res, html) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"
  );
  res.status(200).send(html);
}

function renderWord(shell, entry) {
  const path = `/dicionario/${entry.slug}`;
  const a = esc(entry.ao);
  const p = esc(entry.pre);
  const title = `«${entry.ao}» ou «${entry.pre}»? Como se escreve — Dicionário Lusopédia`;
  const description = `Escreve-se «${entry.ao}» no Acordo Ortográfico de 1990 e «${entry.pre}» na ortografia anterior. Em Portuguez, a grafia da Lusíada: «${entry.pre}».`;
  const rule =
    entry.kind === "consoante"
      ? `A diferença está numa consoante muda: o Acordo Ortográfico de 1990 eliminou o «${esc(droppedLetter(entry) || "")}» que não se pronuncia. A ortografia anterior e o Portuguez mantêm-no.`
      : "Os nomes dos meses escrevem-se com maiúscula inicial em Portuguez e na ortografia anterior; o Acordo Ortográfico de 1990 passou-os a minúscula.";
  const ld = {
    "@type": "DefinedTerm",
    name: entry.pre,
    alternateName: [entry.ao],
    inDefinedTermSet: `${BASE}/dicionario`,
    description,
    inLanguage: "pt-PT",
  };
  const body = `<main><article>
<p>Dicionário de grafias</p>
<h1>«${a}» ou «${p}»?</h1>
<p>Escreve-se <strong>«${a}»</strong> no Acordo Ortográfico de 1990 e <strong>«${p}»</strong> na ortografia anterior ao Acordo.</p>
<h2>As três grafias</h2>
<ul>
<li><strong>Portuguez</strong> (a grafia da Lusíada): «${p}»</li>
<li><strong>Português (pré-acordo)</strong>: «${p}»</li>
<li><strong>Português (AO 1990)</strong>: «${a}»</li>
</ul>
<h2>Porquê a diferença?</h2>
<p>${rule}</p>
<h2>Na Lusopédia</h2>
<p>A enciclopédia da Associação Memória Lusíada escreve-se em Portuguez. Pode ler qualquer artigo em qualquer das três grafias e contribuir para a construção do Portuguez. <a href="/arca/lusopedia">Visite a Lusopédia</a>.</p>
</article></main>`;
  const head = buildHead({ title, description, path, jsonLd: ld });
  return compose(shell, head, body);
}

function renderIndex(shell) {
  const featured = [...bySlug.values()].slice(0, 60);
  const links = featured
    .map(
      (e) =>
        `<li><a href="/dicionario/${esc(e.slug)}">«${esc(e.ao)}» ou «${esc(e.pre)}»?</a></li>`
    )
    .join("");
  const title = "Dicionário de grafias — ação ou acção? | Lusopédia";
  const description =
    "Dúvidas entre o Acordo Ortográfico de 1990 e a ortografia anterior? O dicionário da Lusopédia mostra as três grafias — incluindo o Portuguez, a grafia da Lusíada.";
  const body = `<main><h1>Dicionário de grafias</h1>
<p>Ação ou acção? Objetivo ou objectivo? Aqui encontra como cada palavra se escreve no Acordo Ortográfico de 1990, na ortografia anterior, e em <strong>Portuguez</strong> — a grafia da Associação Memória Lusíada.</p>
<ul>${links}</ul></main>`;
  const head = buildHead({
    title,
    description,
    path: "/dicionario",
    jsonLd: {
      "@type": "CollectionPage",
      name: "Dicionário de grafias",
      description,
      inLanguage: "pt-PT",
    },
  });
  return compose(shell, head, body);
}

export default async function handler(req, res) {
  try {
    const shell = await getShell(req);
    const slug = (req.query && req.query.slug ? req.query.slug : "").toString();
    if (!slug) {
      return send(res, renderIndex(shell));
    }
    const entry = bySlug.get(slug);
    if (!entry) {
      return send(res, shell);
    }
    return send(res, renderWord(shell, entry));
  } catch {
    try {
      return send(res, await getShell(req));
    } catch {
      return res.status(500).send("Erro");
    }
  }
}
