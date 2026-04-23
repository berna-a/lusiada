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
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 lg:p-20 premium-shadow-lg">
          {/* Calçada pattern overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 calcada-pattern pointer-events-none"
          />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-10">
            {/* Column 1 */}
            <div>
              <h4 className="font-display text-base tracking-[0.1em] text-primary-foreground mb-6">
                ASSOCIAÇÃO
              </h4>
              <ul className="flex flex-col gap-1">
                {associacaoLinks.map((l) => (
                  <li key={l.to} style={{ lineHeight: 2.2 }}>
                    <Link
                      to={l.to}
                      className="font-body text-[15px] text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-display text-base tracking-[0.1em] text-primary-foreground mb-6">
                PROGRAMA
              </h4>
              <ul className="flex flex-col gap-1">
                {programaLinks.map((l) => (
                  <li key={l.to} style={{ lineHeight: 2.2 }}>
                    <Link
                      to={l.to}
                      className="font-body text-[15px] text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-display text-base tracking-[0.1em] text-primary-foreground mb-6">
                CONTACTO
              </h4>
              <address className="not-italic font-body text-[15px] text-primary-foreground/70" style={{ lineHeight: 2 }}>
                <div>Associação Memória Lusíada</div>
                <div>Lisboa, Portugal</div>
                <div>
                  <a
                    href="mailto:geral@alusiada.pt"
                    className="hover:text-primary-foreground hover:underline transition-colors"
                  >
                    geral@alusiada.pt
                  </a>
                </div>
              </address>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Youtube className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center font-body text-xs text-primary-foreground/50">
          <span>© 2026 Associação Memória Lusíada</span>
          <span className="mx-2">•</span>
          <Link to="/privacidade" className="hover:text-primary-foreground transition-colors">
            Privacidade
          </Link>
          <span className="mx-2">•</span>
          <Link to="/termos" className="hover:text-primary-foreground transition-colors">
            Termos
          </Link>
        </div>
      </div>
    </footer>
  );
}