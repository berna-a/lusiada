// robots.txt host-aware: cada domínio aponta o SEU sitemap. Servido como função
// porque o oslusiadas.pt e a alusiada.pt partilham o deploy mas têm sitemaps
// distintos — um robots.txt estático declararia o sitemap errado num deles.

const RE_OSLUSIADAS = /(^|\.)oslusiadas\.pt$/i;

export default function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const base = RE_OSLUSIADAS.test(host)
    ? "https://oslusiadas.pt"
    : "https://www.alusiada.pt";

  const body = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(body);
}
