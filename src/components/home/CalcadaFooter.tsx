import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin } from "lucide-react";

const associacaoLinks = [
  { label: "A Associação", to: "/a-associacao" },
  { label: "Estatutos", to: "/estatutos" },
  { label: "Contacto", to: "/contacto" },
  { label: "Aderir", to: "/aderir" },
];

const programaLinks = [
  { label: "Panteão", to: "/panteao" },
  { label: "Os Lusíadas Manuscritos", to: "/programa" },
  { label: "Encontros", to: "/encontros" },
  { label: "Doar", to: "/doar" },
];

export function CalcadaFooter() {
  return (
    <footer
      id="footer"
      className="bg-secondary py-16 px-6"
    >
      <div className="mx-auto max-w-[1200px]">
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-20 premium-shadow-lg"
          style={{ backgroundColor: "#0A3D62", color: "#F4F1EC" }}
        >
          {/* Calçada pattern overlay — hardcoded ivory dots, theme-independent */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 12px 12px, rgba(244,241,236,0.06) 1.2px, transparent 1.6px), radial-gradient(circle at 36px 36px, rgba(244,241,236,0.05) 1px, transparent 1.4px)",
              backgroundSize: "48px 48px, 48px 48px",
              backgroundPosition: "0 0, 24px 24px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-10">
            {/* Column 1 */}
            <div>
              <h4 className="font-display text-base tracking-[0.1em] mb-6" style={{ color: "#F4F1EC" }}>
                ASSOCIAÇÃO
              </h4>
              <ul className="flex flex-col gap-1">
                {associacaoLinks.map((l) => (
                  <li key={l.to} style={{ lineHeight: 2.2 }}>
                    <Link
                      to={l.to}
                      className="font-body text-[15px] transition-colors hover:!text-[#F4F1EC]"
                      style={{ color: "rgba(244,241,236,0.7)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-display text-base tracking-[0.1em] mb-6" style={{ color: "#F4F1EC" }}>
                PROGRAMA
              </h4>
              <ul className="flex flex-col gap-1">
                {programaLinks.map((l) => (
                  <li key={l.to} style={{ lineHeight: 2.2 }}>
                    <Link
                      to={l.to}
                      className="font-body text-[15px] transition-colors hover:!text-[#F4F1EC]"
                      style={{ color: "rgba(244,241,236,0.7)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-display text-base tracking-[0.1em] mb-6" style={{ color: "#F4F1EC" }}>
                CONTACTO
              </h4>
              <address className="not-italic font-body text-[15px]" style={{ lineHeight: 2, color: "rgba(244,241,236,0.7)" }}>
                <div>Associação Memória Lusíada</div>
                <div>Lisboa, Portugal</div>
                <div>
                  <a
                    href="mailto:geral@alusiada.pt"
                    className="transition-colors hover:underline hover:!text-[#F4F1EC]"
                  >
                    geral@alusiada.pt
                  </a>
                </div>
              </address>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="transition-colors hover:!text-[#F4F1EC]"
                  style={{ color: "rgba(244,241,236,0.6)" }}
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="transition-colors hover:!text-[#F4F1EC]"
                  style={{ color: "rgba(244,241,236,0.6)" }}
                >
                  <Youtube className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="transition-colors hover:!text-[#F4F1EC]"
                  style={{ color: "rgba(244,241,236,0.6)" }}
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center font-body text-xs text-muted-foreground">
          <span>© 2026 Associação Memória Lusíada</span>
          <span className="mx-2">•</span>
          <Link to="/privacidade" className="hover:text-foreground transition-colors">
            Privacidade
          </Link>
          <span className="mx-2">•</span>
          <Link to="/termos" className="hover:text-foreground transition-colors">
            Termos
          </Link>
        </div>
      </div>
    </footer>
  );
}