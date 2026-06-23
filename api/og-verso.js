// Gera o cartão de partilha (imagem PNG) de um verso/passagem d'Os Lusíadas.
// Edge function + @vercel/og (Satori). Sem JSX — usa a forma de objecto.
import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

function h(type, style, children) {
  return { type, props: { style, children } };
}

export default async function handler(req) {
  const url = new URL(req.url);
  const { origin } = url;
  const text = (url.searchParams.get("t") || "Os Lusíadas").slice(0, 240);
  const ref = url.searchParams.get("ref") || "";

  const [cinzel, garamond] = await Promise.all([
    fetch(new URL("/fonts/Cinzel.ttf", origin)).then((r) => r.arrayBuffer()),
    fetch(new URL("/fonts/EBGaramond.ttf", origin)).then((r) => r.arrayBuffer()),
  ]);

  const size = text.length > 160 ? 38 : text.length > 90 ? 46 : 54;

  const tree = h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "#F4EFE4",
      padding: "60px 72px",
      fontFamily: "EBGaramond",
    },
    [
      h(
        "div",
        {
          display: "flex",
          justifyContent: "center",
          fontFamily: "Cinzel",
          fontSize: 30,
          letterSpacing: 12,
          color: "#1E3A5F",
        },
        "OS LUSÍADAS"
      ),
      h(
        "div",
        {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 10px",
        },
        h(
          "div",
          {
            display: "flex",
            textAlign: "center",
            fontSize: size,
            lineHeight: 1.45,
            color: "#22304A",
            maxWidth: 1010,
          },
          `“${text}”`
        )
      ),
      h(
        "div",
        {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        },
        [
          h(
            "div",
            {
              display: "flex",
              color: "#9C6B3C",
              fontFamily: "Cinzel",
              letterSpacing: 4,
              fontSize: 20,
            },
            ref
          ),
          h(
            "div",
            {
              display: "flex",
              color: "#8A8170",
              fontFamily: "Cinzel",
              letterSpacing: 4,
              fontSize: 20,
            },
            "oslusiadas.pt"
          ),
        ]
      ),
    ]
  );

  return new ImageResponse(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Cinzel", data: cinzel, weight: 700, style: "normal" },
      { name: "EBGaramond", data: garamond, weight: 400, style: "normal" },
    ],
  });
}
