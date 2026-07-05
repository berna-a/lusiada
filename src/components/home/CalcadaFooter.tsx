import { Link } from "react-router-dom";

const associacaoLinks = [
  { label: "A Associação", to: "/a-associacao" },
  { label: "Manifesto", to: "/sobre/manifesto" },
  { label: "Contacto", to: "/contacto" },
  { label: "Aderir", to: "/aderir" },
];

const programaLinks = [
  { label: "Panteão", to: "/panteao" },
  { label: "Os Lusíadas Manuscritos", to: "/programa" },
  { label: "Apoiar", to: "/apoiar" },
  { label: "Arca", to: "/arca" },
];

export function CalcadaFooter() {
  return (
    <footer className="bg-secondary px-6 py-16" id="footer">
      <div className="mx-auto max-w-[1200px]">
        <div
          className="premium-shadow-lg relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-20"
          style={{ backgroundColor: "#0A3D62", color: "#F4F1EC" }}
        >
          {/* Calçada pattern overlay — hardcoded ivory dots, theme-independent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 12px, rgba(244,241,236,0.06) 1.2px, transparent 1.6px), radial-gradient(circle at 36px 36px, rgba(244,241,236,0.05) 1px, transparent 1.4px)",
              backgroundSize: "48px 48px, 48px 48px",
              backgroundPosition: "0 0, 24px 24px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {/* Column 1 */}
            <div>
              <h4
                className="mb-6 font-display text-base tracking-[0.1em]"
                style={{ color: "#F4F1EC" }}
              >
                ASSOCIAÇÃO
              </h4>
              <ul className="flex flex-col gap-1">
                {associacaoLinks.map((l) => (
                  <li key={l.to} style={{ lineHeight: 2.2 }}>
                    <Link
                      className="hover:!text-[#F4F1EC] font-body text-[15px] transition-colors"
                      style={{ color: "rgba(244,241,236,0.7)" }}
                      to={l.to}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4
                className="mb-6 font-display text-base tracking-[0.1em]"
                style={{ color: "#F4F1EC" }}
              >
                PROGRAMA
              </h4>
              <ul className="flex flex-col gap-1">
                {programaLinks.map((l) => (
                  <li key={l.to} style={{ lineHeight: 2.2 }}>
                    <Link
                      className="hover:!text-[#F4F1EC] font-body text-[15px] transition-colors"
                      style={{ color: "rgba(244,241,236,0.7)" }}
                      to={l.to}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4
                className="mb-6 font-display text-base tracking-[0.1em]"
                style={{ color: "#F4F1EC" }}
              >
                CONTACTO
              </h4>
              <address
                className="font-body text-[15px] not-italic"
                style={{ lineHeight: 2, color: "rgba(244,241,236,0.7)" }}
              >
                <div>Associação Memória Lusíada</div>
                <div>Largo da Freiria 6</div>
                <div>3000-196 Coimbra</div>
                <div>NIF 518 533 301</div>
                <div className="mt-2">
                  <a
                    className="hover:!text-[#F4F1EC] transition-colors hover:underline"
                    href="mailto:admin@alusiada.pt"
                  >
                    admin@alusiada.pt
                  </a>
                </div>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center font-body text-muted-foreground text-xs">
          <span>© 2026 Associação Memória Lusíada</span>
          <span className="mx-2">•</span>
          <Link
            className="transition-colors hover:text-foreground"
            to="/privacidade"
          >
            Privacidade
          </Link>
          <span className="mx-2">•</span>
          <Link
            className="transition-colors hover:text-foreground"
            to="/termos"
          >
            Termos
          </Link>
        </div>
      </div>
    </footer>
  );
}
