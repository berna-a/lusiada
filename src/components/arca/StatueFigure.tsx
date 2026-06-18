/**
 * Estátua de mármore estilizada (figura clássica togada, com coroa de louros
 * e livro). Pensada como marcador de posição elegante até existir um render
 * foto-realista de cada herói. Puro SVG, sem dependências.
 */
export function StatueFigure({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 200 440"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="marble" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f7f3ea" />
          <stop offset="0.45" stopColor="#e6decf" />
          <stop offset="0.8" stopColor="#c9bfa9" />
          <stop offset="1" stopColor="#a99e86" />
        </linearGradient>
        <linearGradient id="marble-rim" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.25" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Robe / corpo togado */}
      <path
        d="M100 96
           C 78 96 70 112 68 132
           C 64 168 54 210 44 300
           C 38 352 34 392 32 420
           L 168 420
           C 166 392 162 352 156 300
           C 146 210 136 168 132 132
           C 130 112 122 96 100 96 Z"
        fill="url(#marble)"
      />
      {/* Dobras do manto */}
      <path
        d="M100 120 L100 416 M76 150 C 70 250 62 340 56 414 M124 150 C 130 250 138 340 144 414 M90 130 C 86 260 82 350 78 416 M110 130 C 114 260 118 350 122 416"
        stroke="#b3a98f"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {/* Ombro/peito sombra */}
      <path
        d="M100 96 C 86 96 78 108 74 128 C 88 120 112 120 126 128 C 122 108 114 96 100 96 Z"
        fill="#bcb295"
        fillOpacity="0.5"
      />
      {/* Livro segurado ao peito */}
      <path
        d="M84 196 L120 188 L122 214 L86 222 Z"
        fill="#efe8d8"
        stroke="#a99e86"
        strokeWidth="1.5"
      />
      <path d="M102 192 L104 218" stroke="#a99e86" strokeWidth="1.5" />

      {/* Pescoço */}
      <path d="M92 86 L108 86 L106 100 L94 100 Z" fill="url(#marble)" />
      {/* Cabeça */}
      <ellipse cx="100" cy="66" fill="url(#marble)" rx="22" ry="26" />
      {/* Barba */}
      <path
        d="M82 70 C 84 92 92 102 100 102 C 108 102 116 92 118 70 C 112 82 88 82 82 70 Z"
        fill="#d8cfba"
      />
      {/* Coroa de louros — assenta à volta do topo da cabeça */}
      <path
        d="M79 52 C 82 44 90 41 100 42 C 110 41 118 44 121 52"
        stroke="#cdbf8e"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M84 49 l-3 -5 M92 45 l-2 -5 M100 44 l0 -5 M108 45 l2 -5 M116 49 l3 -5"
        stroke="#cdbf8e"
        strokeLinecap="round"
        strokeWidth="2.4"
      />

      {/* Luz de contorno */}
      <path
        d="M100 96 C 78 96 70 112 68 132 C 64 168 54 210 44 300 C 38 352 34 392 32 420 L 52 420 C 58 360 70 250 84 150 C 88 118 92 104 100 100 Z"
        fill="url(#marble-rim)"
      />
    </svg>
  );
}
