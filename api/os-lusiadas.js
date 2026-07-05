// Prerender server-side do leitor Os Lusíadas no domínio dedicado oslusiadas.pt.
// Injecta título/descrição/OpenGraph (com cartão próprio) e canonical para si
// mesmo, para que partilhas directas e robôs sem JavaScript vejam a obra.

const BASE = "https://oslusiadas.pt";

const RE_TITLE = /<title>[\s\S]*?<\/title>/i;
const ROMANS = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function getShell(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const r = await fetch(`${proto}://${host}/index.html`);
  return r.text();
}

function stripStatic(shell) {
  return shell
    .replace(RE_TITLE, "")
    .replace(/<meta[^>]+name="description"[^>]*>/gi, "")
    .replace(/<meta[^>]+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta[^>]+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<link[^>]+rel="canonical"[^>]*>/gi, "");
}

export default async function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const u = new URL(req.url, `${proto}://${host}`);
  const c = Math.min(
    10,
    Math.max(1, Number.parseInt(u.searchParams.get("c") || "1", 10) || 1)
  );
  const roman = ROMANS[c];
  const home = u.searchParams.get("home") === "1";
  const path = c === 1 ? "/" : `/canto/${c}`;
  const url = BASE + path;
  const title = home
    ? "Os Lusíadas — Luiz Vaz de Camões"
    : `Os Lusíadas — Canto ${roman} | Luiz Vaz de Camões`;
  const desc =
    "A epopeia da nação Portugueza, de Luiz Vaz de Camões — lida e estudada verso a verso nas três grafias da língua, anotada pela comunidade.";
  let ogText;
  if (home || c === 1) {
    ogText = "As armas e os barões assinalados";
  } else {
    ogText = `Os Lusíadas — Canto ${roman}`;
  }
  const ogImage = `${BASE}/api/og-verso?t=${encodeURIComponent(ogText)}&ref=${encodeURIComponent(`Canto ${roman}`)}`;

  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:locale" content="pt_PT" />`,
    `<meta property="og:site_name" content="Os Lusíadas · Associação Lusíada" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${esc(ogImage)}" />`,
  ].join("\n    ");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=3600"
  );
  try {
    const shell = await getShell(req);
    const html = stripStatic(shell).replace(
      "</head>",
      `    ${head}\n  </head>`
    );
    res.status(200).send(html);
  } catch {
    // Falha ao obter o shell — devolve um HTML mínimo com as meta + redirect.
    res.status(200).send(
      `<!doctype html><html lang="pt"><head><meta charset="utf-8">
    ${head}
    <meta http-equiv="refresh" content="0; url=${esc(url)}" />
  </head><body><script>location.replace(${JSON.stringify(url)});</script></body></html>`
    );
  }
}
