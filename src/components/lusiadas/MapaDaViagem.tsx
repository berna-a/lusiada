import { useNavigate } from "react-router-dom";
import { cantoHref as cantoLink } from "@/lib/lusiadas/nav";

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

export type Episode = {
  key: string;
  x: number;
  y: number;
  side: "l" | "r";
  lugar: string;
  episodio: string;
  canto: number;
};

/** Episódios da viagem, por ordem geográfica da rota das naus. */
export const EPISODES: Episode[] = [
  {
    key: "partida",
    x: 168,
    y: 118,
    side: "r",
    lugar: "Lisboa",
    episodio: "A partida — Despedida do Restelo",
    canto: 4,
  },
  {
    key: "cabo",
    x: 300,
    y: 470,
    side: "r",
    lugar: "Cabo da Boa Esperança",
    episodio: "O Gigante Adamastor",
    canto: 5,
  },
  {
    key: "mocambique",
    x: 428,
    y: 408,
    side: "l",
    lugar: "Moçambique",
    episodio: "Primeiro contacto",
    canto: 1,
  },
  {
    key: "mombaca",
    x: 460,
    y: 356,
    side: "l",
    lugar: "Mombaça",
    episodio: "A cilada dos mouros",
    canto: 2,
  },
  {
    key: "melinde",
    x: 502,
    y: 300,
    side: "l",
    lugar: "Melinde",
    episodio: "Gama narra a história de Portugal",
    canto: 3,
  },
  {
    key: "calecute",
    x: 726,
    y: 222,
    side: "l",
    lugar: "Calecute, Índia",
    episodio: "A chegada e o Samorim",
    canto: 7,
  },
  {
    key: "amores",
    x: 636,
    y: 330,
    side: "r",
    lugar: "Ilha dos Amores",
    episodio: "O prémio dos heróis",
    canto: 9,
  },
];

const ROUTE =
  "M168,118 C150,230 150,340 232,418 C270,455 292,465 300,470 C360,468 405,440 428,408 C446,386 456,372 460,356 C475,332 490,316 502,300 C572,256 668,226 726,222";
const RETURN = "M726,222 C692,266 664,306 636,330";

const LAND = {
  iberia:
    "M120,78 Q170,58 224,86 Q240,128 196,156 Q142,168 116,134 Q104,100 120,78 Z",
  africa:
    "M248,150 Q198,206 168,294 Q204,362 262,438 Q298,492 322,486 Q420,458 470,360 Q502,296 470,228 Q440,168 378,164 Q310,158 248,150 Z",
  india: "M688,176 Q762,186 772,238 Q742,292 700,282 Q664,238 688,176 Z",
  arabia: "M520,150 Q600,150 612,196 Q580,232 528,218 Q500,184 520,150 Z",
};

export function MapaDaViagem({ base }: { base: string }) {
  const navigate = useNavigate();
  const cantoHref = (c: number) => cantoLink(base, c);

  return (
    <svg
      className="w-full"
      role="img"
      viewBox="0 0 820 540"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Mapa da viagem de Os Lusíadas — de Lisboa à Índia</title>
      <rect
        fill="hsl(40 40% 94%)"
        height="540"
        rx="16"
        width="820"
        x="0"
        y="0"
      />

      {/* Linhas de rumo (decorativas) */}
      <g opacity="0.12" stroke="hsl(28 40% 40%)" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={620}
              x2={620 + Math.cos(a) * 520}
              y1={120}
              y2={120 + Math.sin(a) * 520}
            />
          );
        })}
      </g>

      {/* Terra */}
      <g fill="hsl(36 34% 84%)" stroke="hsl(30 30% 62%)" strokeWidth="1.5">
        <path d={LAND.iberia} />
        <path d={LAND.africa} />
        <path d={LAND.india} />
        <path d={LAND.arabia} />
      </g>
      <text fill="hsl(30 25% 55%)" fontSize="13" x="132" y="120">
        Europa
      </text>
      <text fill="hsl(30 25% 55%)" fontSize="13" x="300" y="300">
        África
      </text>
      <text fill="hsl(30 25% 55%)" fontSize="13" x="706" y="240">
        Índia
      </text>

      {/* Rota */}
      <path
        d={ROUTE}
        fill="none"
        stroke="hsl(351 55% 40%)"
        strokeDasharray="2 7"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d={RETURN}
        fill="none"
        opacity="0.5"
        stroke="hsl(351 45% 45%)"
        strokeDasharray="1 8"
        strokeLinecap="round"
        strokeWidth="2.5"
      />

      {/* Pinos dos episódios */}
      {EPISODES.map((e) => {
        const left = e.side === "l";
        const tx = left ? e.x - 12 : e.x + 12;
        return (
          <g
            className="cursor-pointer"
            key={e.key}
            onClick={() => navigate(cantoHref(e.canto))}
          >
            <title>{`${e.lugar} — ${e.episodio} (Canto ${ROMANS[e.canto]})`}</title>
            <circle
              cx={e.x}
              cy={e.y}
              fill="hsl(40 40% 94%)"
              r="7"
              stroke="hsl(351 55% 40%)"
              strokeWidth="3"
            />
            <text
              fill="hsl(214 45% 22%)"
              fontSize="14"
              fontWeight="600"
              textAnchor={left ? "end" : "start"}
              x={tx}
              y={e.y - 2}
            >
              {e.lugar}
            </text>
            <text
              fill="hsl(28 45% 42%)"
              fontSize="11"
              textAnchor={left ? "end" : "start"}
              x={tx}
              y={e.y + 13}
            >
              Canto {ROMANS[e.canto]}
            </text>
          </g>
        );
      })}

      {/* Rosa-dos-ventos */}
      <g transform="translate(620,120)">
        <circle fill="none" r="22" stroke="hsl(28 40% 50%)" strokeWidth="1" />
        <path d="M0,-30 L5,-5 L0,0 L-5,-5 Z" fill="hsl(351 55% 40%)" />
        <path d="M0,30 L5,5 L0,0 L-5,5 Z" fill="hsl(28 40% 50%)" />
        <text
          fill="hsl(28 40% 45%)"
          fontSize="10"
          textAnchor="middle"
          x="0"
          y="-32"
        >
          N
        </text>
      </g>
    </svg>
  );
}
