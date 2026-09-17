export function MindGamesArtwork({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-label="Composição original de um tabuleiro de Xadrez e pedras de Go"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 1200 675"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mind-bg" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#082f49" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="mind-glow">
          <stop stopColor="#d7ad64" stopOpacity=".45" />
          <stop offset="1" stopColor="#d7ad64" stopOpacity="0" />
        </radialGradient>
        <pattern
          height="100"
          id="chess-board"
          patternUnits="userSpaceOnUse"
          width="100"
        >
          <rect fill="#ead2a2" height="50" width="50" />
          <rect fill="#31566a" height="50" width="50" x="50" y="0" />
          <rect fill="#31566a" height="50" width="50" x="0" y="50" />
          <rect fill="#ead2a2" height="50" width="50" x="50" y="50" />
        </pattern>
        <filter id="mind-shadow">
          <feDropShadow
            dx="0"
            dy="18"
            floodColor="#000"
            floodOpacity=".35"
            stdDeviation="16"
          />
        </filter>
      </defs>
      <rect fill="url(#mind-bg)" height="675" width="1200" />
      <circle cx="920" cy="160" fill="url(#mind-glow)" r="460" />
      <g opacity=".18">
        <path
          d="M80 90h440M80 120h310M810 650h310"
          stroke="#f5ead7"
          strokeWidth="2"
        />
        <circle cx="108" cy="650" fill="none" r="45" stroke="#d7ad64" />
        <circle cx="108" cy="650" fill="none" r="29" stroke="#d7ad64" />
      </g>
      <g filter="url(#mind-shadow)" transform="rotate(-5 405 390)">
        <rect fill="#c89651" height="460" rx="12" width="460" x="175" y="145" />
        <rect
          fill="url(#chess-board)"
          height="400"
          width="400"
          x="205"
          y="175"
        />
        <g fill="#153a4f">
          <path d="M325 480h160l-14 55H339z" />
          <path d="M350 455c7-56 17-119 55-158 38 39 48 102 55 158z" />
          <circle cx="405" cy="279" r="30" />
        </g>
        <g fill="#f7eddc">
          <path d="M235 265h58l-7 98h-44z" />
          <path d="M225 245h78v38h-78z" />
          <path d="M515 403h58l-7 102h-44z" />
          <path d="M505 383h78v38h-78z" />
        </g>
      </g>
      <g filter="url(#mind-shadow)">
        <g fill="none" stroke="#d7ad64" strokeOpacity=".5" strokeWidth="2">
          <path d="M700 200h370M700 275h370M700 350h370M700 425h370M700 500h370" />
          <path d="M715 180v340M800 180v340M885 180v340M970 180v340M1055 180v340" />
        </g>
        <circle cx="800" cy="275" fill="#f5eee2" r="61" />
        <circle
          cx="800"
          cy="275"
          fill="none"
          r="51"
          stroke="#d4c4a9"
          strokeWidth="3"
        />
        <circle cx="970" cy="425" fill="#111827" r="72" />
        <circle
          cx="970"
          cy="425"
          fill="none"
          r="61"
          stroke="#334155"
          strokeWidth="3"
        />
        <circle cx="800" cy="500" fill="#f5eee2" r="48" />
        <circle
          cx="800"
          cy="500"
          fill="none"
          r="39"
          stroke="#d4c4a9"
          strokeWidth="3"
        />
      </g>
      <text
        fill="#f5ead7"
        fontFamily="Georgia,serif"
        fontSize="34"
        letterSpacing="10"
        x="760"
        y="150"
      >
        XADREZ · GO
      </text>
    </svg>
  );
}
