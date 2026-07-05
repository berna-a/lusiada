// Página de partilha de um verso/passagem: serve HTML com as meta OpenGraph
// (imagem do cartão gerado) para os robôs sociais, e reencaminha o humano para
// o leitor. Funciona em oslusiadas.pt e em alusiada.pt/os-lusiadas.

const RE_OSLUSIADAS = /(^|\.)oslusiadas\.pt$/i;

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

export default function handler(req, res) {
  const host =
    req.headers["x-forwarded-host"] || req.headers.host || "oslusiadas.pt";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const base = `${proto}://${host}`;
  const u = new URL(req.url, base);

  const c = Math.min(
    10,
    Math.max(1, Number.parseInt(u.searchParams.get("c") || "1", 10) || 1)
  );
  const e = (u.searchParams.get("e") || "").replace(/[^0-9]/g, "");
  const t = (u.searchParams.get("t") || "").slice(0, 240);
  const ref = `Canto ${ROMANS[c]}${e ? ` · estrofe ${e}` : ""}`;
  const ogImage = `${base}/api/og-verso?t=${encodeURIComponent(t)}&ref=${encodeURIComponent(ref)}`;

  const dedicated = RE_OSLUSIADAS.test(host);
  let readerPath;
  if (dedicated) {
    readerPath = c === 1 ? "/" : `/canto/${c}`;
  } else {
    readerPath = c === 1 ? "/os-lusiadas" : `/os-lusiadas/canto/${c}`;
  }
  const redirect = `${base}${readerPath}${e ? `#estrofe-${e}` : ""}`;
  const title = `Os Lusíadas — ${ref}`;
  const desc = t || "A epopeia da nação Portugueza, anotada verso a verso.";

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(`<!doctype html>
<html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${esc(redirect)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<meta http-equiv="refresh" content="0; url=${esc(redirect)}">
</head><body>
<script>location.replace(${JSON.stringify(redirect)});</script>
<p>A abrir <a href="${esc(redirect)}">Os Lusíadas</a>…</p>
</body></html>`);
}
