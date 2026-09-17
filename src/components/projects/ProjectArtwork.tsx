import { MindGamesArtwork } from "@/components/MindGamesArtwork";

const labels: Record<string, string> = {
  "calendario-portuguez-2027": "CALENDÁRIO · 2027",
  "azulejos-bairro-piloto": "AZULEJO · TERRITÓRIO",
  "decifrados-piloto": "CAMÕES · DECIFRADOS",
  "primeiro-azulejo-camoes": "CAMÕES · AZULEJO",
  "tertulia-piloto-gravada": "VOZ · MEMÓRIA",
};

function Motif({ slug }: { slug: string }) {
  if (slug === "calendario-portuguez-2027") {
    return (
      <g>
        <circle
          cx="600"
          cy="325"
          fill="none"
          r="205"
          stroke="#d7ad64"
          strokeWidth="3"
        />
        <circle cx="600" cy="325" fill="#d7ad64" fillOpacity=".13" r="124" />
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 12 - Math.PI / 2;
          const x = 600 + Math.cos(angle) * 205;
          const y = 325 + Math.sin(angle) * 205;
          return <circle cx={x} cy={y} fill="#f5ead7" key={index} r="9" />;
        })}
        <path
          d="M600 196v129l92 62"
          fill="none"
          stroke="#f5ead7"
          strokeLinecap="round"
          strokeWidth="12"
        />
      </g>
    );
  }
  if (slug === "azulejos-bairro-piloto" || slug === "primeiro-azulejo-camoes") {
    return (
      <g transform="translate(390 110)">
        <rect fill="#f4ead7" height="430" rx="8" width="430" />
        <path
          d="M215 18C197 113 113 197 18 215c95 18 179 102 197 197 18-95 102-179 197-197-95-18-179-102-197-197Z"
          fill="#1b4f72"
        />
        <circle cx="215" cy="215" fill="#f4ead7" r="88" />
        <circle
          cx="215"
          cy="215"
          fill="none"
          r="63"
          stroke="#a96c43"
          strokeWidth="14"
        />
        <path
          d="M0 0l430 430M430 0 0 430"
          opacity=".22"
          stroke="#d7ad64"
          strokeWidth="3"
        />
      </g>
    );
  }
  if (slug === "decifrados-piloto") {
    return (
      <g>
        <path
          d="M250 165c145-45 258-26 350 42v330c-92-68-205-87-350-42Zm700 0c-145-45-258-26-350 42v330c92-68 205-87 350-42Z"
          fill="#f4ead7"
        />
        <path d="M600 207v330" stroke="#d7ad64" strokeWidth="5" />
        <path
          d="M315 255h205m-205 60h220m-220 60h185m180-120h205m-220 60h220m-185 60h185"
          stroke="#31566a"
          strokeLinecap="round"
          strokeWidth="10"
        />
      </g>
    );
  }
  return (
    <g>
      <circle cx="600" cy="325" fill="#d7ad64" fillOpacity=".13" r="195" />
      <path
        d="M540 210v230c0 58-47 105-105 105M660 210v230c0 58 47 105 105 105"
        fill="none"
        stroke="#f4ead7"
        strokeLinecap="round"
        strokeWidth="24"
      />
      <rect fill="#d7ad64" height="255" rx="58" width="116" x="542" y="150" />
      <path
        d="M600 405v105m-90 0h180"
        stroke="#f4ead7"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        d="M365 260c-30 42-30 88 0 130m470-130c30 42 30 88 0 130"
        fill="none"
        stroke="#d7ad64"
        strokeWidth="10"
      />
    </g>
  );
}

export function ProjectArtwork({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  if (slug === "clube-jogos-da-mente") {
    return <MindGamesArtwork className={className} />;
  }
  return (
    <svg
      aria-label={`Composição gráfica para ${labels[slug] ?? "projecto LUSÍADA"}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 1200 675"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`project-bg-${slug}`} x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#082f49" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>
      <rect fill={`url(#project-bg-${slug})`} height="675" width="1200" />
      <path
        d="M0 540C240 440 375 650 635 535s370-70 565-185v325H0Z"
        fill="#7b263b"
        fillOpacity=".28"
      />
      <Motif slug={slug} />
      <text
        fill="#f5ead7"
        fontFamily="Georgia,serif"
        fontSize="30"
        letterSpacing="8"
        textAnchor="middle"
        x="600"
        y="620"
      >
        {labels[slug] ?? "PROJECTO LUSÍADA"}
      </text>
    </svg>
  );
}
