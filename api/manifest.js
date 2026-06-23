// Web App Manifest host-aware: "Os Lusíadas" no domínio dedicado, "Memória
// Lusíada" na alusiada.pt. Permite instalar como app em cada origem.

export default function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "";
  const lus = /(^|\.)oslusiadas\.pt$/i.test(host);

  const manifest = {
    name: lus ? "Os Lusíadas" : "Memória Lusíada",
    short_name: lus ? "Os Lusíadas" : "Lusíada",
    description: lus
      ? "A epopeia de Camões — ler, estudar e anotar verso a verso, nas três grafias da língua."
      : "A memória viva de Portugal — língua, heróis e história.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pt-PT",
    background_color: "#F4EFE4",
    theme_color: "#0A3D62",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(JSON.stringify(manifest));
}
