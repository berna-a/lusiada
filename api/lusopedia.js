// Prerender server-side das páginas da Lusopédia.
// Injeta título/descrição/OpenGraph/Twitter/JSON-LD por página e o conteúdo
// real do artigo no HTML, para que partilhas sociais (WhatsApp, Facebook) e
// robôs que não correm JavaScript (incluindo motores de IA) vejam cada página.
// Os utilizadores recebem o mesmo HTML e a aplicação React monta-se por cima.

const BASE = "https://www.alusiada.pt";
const CONVEX = process.env.VITE_CONVEX_URL;
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/HZLq0vi45GUkFlWe5135LqHlgSd2/social-images/social-1776901317952-Melhor_desenho.webp";
const ORG = {
  "@type": "Organization",
  name: "Associação Memória Lusíada",
  url: BASE,
  logo: `${BASE}/favicon.ico`,
};

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

async function convexQuery(path, args) {
  if (!CONVEX) {
    return null;
  }
  const r = await fetch(`${CONVEX}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const json = await r.json();
  return json && json.status === "success" ? json.value : null;
}

function buildHead({ title, description, path, image, type, jsonLd }) {
  const url = BASE + path;
  const graph = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const ld = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [ORG, ...graph],
  });
  const img = image || DEFAULT_IMAGE;
  const desc = description || "";
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${type || "website"}" />`,
    `<meta property="og:locale" content="pt_PT" />`,
    `<meta property="og:site_name" content="Lusopédia · Associação Memória Lusíada" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
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

function compose(shell, head, bodyHtml) {
  let html = stripStatic(shell).replace("</head>", `    ${head}\n  </head>`);
  if (bodyHtml) {
    html = html.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root">${bodyHtml}</div>`
    );
  }
  return html;
}

function send(res, html) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=3600"
  );
  res.status(200).send(html);
}

function renderArticle(shell, article) {
  const path = `/arca/lusopedia/${article.slug}`;
  const url = BASE + path;
  const published = new Date(article._creationTime).toISOString();
  const tags = article.tags || [];
  const articleLd = {
    "@type": "Article",
    headline: article.title,
    description: article.summary || undefined,
    inLanguage: "pt-PT",
    datePublished: published,
    dateModified: published,
    articleSection: article.category,
    keywords: tags.join(", ") || undefined,
    image: article.coverUrl || undefined,
    author: { "@type": "Organization", name: "Associação Memória Lusíada" },
    publisher: { "@type": "Organization", name: "Associação Memória Lusíada" },
    mainEntityOfPage: url,
  };
  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Arca", item: `${BASE}/arca` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Lusopédia",
        item: `${BASE}/arca/lusopedia`,
      },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };
  const head = buildHead({
    title: `${article.title} — Lusopédia`,
    description: article.summary,
    path,
    image: article.coverUrl,
    type: "article",
    jsonLd: [articleLd, breadcrumbLd],
  });
  const body = `<main><article><p>${esc(article.category)}</p><h1>${esc(
    article.title
  )}</h1>${
    article.summary ? `<p>${esc(article.summary)}</p>` : ""
  }${article.body || ""}</article></main>`;
  return compose(shell, head, body);
}

async function renderIndex(shell) {
  const articles = (await convexQuery("articles:list", {})) || [];
  const links = articles
    .filter((a) => a && a.slug)
    .map(
      (a) =>
        `<li><a href="/arca/lusopedia/${esc(a.slug)}">${esc(a.title)}</a>${
          a.summary ? ` — ${esc(a.summary)}` : ""
        }</li>`
    )
    .join("");
  const head = buildHead({
    title: "Lusopédia — A enciclopédia da lusofonia",
    description:
      "A enciclopédia viva da lusofonia — conceitos, história, pessoas, lugares e obras do Povo Português, escritos e debatidos pela comunidade.",
    path: "/arca/lusopedia",
    type: "website",
    jsonLd: {
      "@type": "CollectionPage",
      name: "Lusopédia",
      description: "A enciclopédia da lusofonia da Associação Memória Lusíada.",
      inLanguage: "pt-PT",
      isPartOf: {
        "@type": "WebSite",
        name: "Lusopédia",
        url: `${BASE}/arca/lusopedia`,
      },
    },
  });
  const body = `<main><h1>Lusopédia</h1><p>A enciclopédia viva da lusofonia — escrita, discutida e votada pela comunidade.</p><ul>${links}</ul></main>`;
  return compose(shell, head, body);
}

export default async function handler(req, res) {
  try {
    const shell = await getShell(req);
    const slug = (req.query && req.query.slug ? req.query.slug : "").toString();

    if (!slug) {
      return send(res, await renderIndex(shell));
    }
    if (slug === "novo") {
      return send(res, shell);
    }
    const article = await convexQuery("articles:getBySlug", { slug });
    if (!article || article.status !== "published") {
      return send(res, shell);
    }
    return send(res, renderArticle(shell, article));
  } catch {
    try {
      return send(res, await getShell(req));
    } catch {
      return res.status(500).send("Erro");
    }
  }
}
