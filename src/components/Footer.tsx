import { Link } from "react-router-dom";

const navLinks = [
  { label: "Associação", to: "/associacao" },
  { label: "Programa", to: "/programa" },
  { label: "Apoiar", to: "/apoiar" },
  { label: "Aderir", to: "/aderir" },
  { label: "A minha conta", to: "/conta" },
  { label: "Contactos", to: "/contactos" },
];

const arcaLinks = [
  { label: "Panteão", to: "/arca/panteao" },
  { label: "Lusopédia", to: "/arca/lusopedia" },
  { label: "Os Lusíadas", to: "/os-lusiadas" },
  { label: "Dicionário de grafias", to: "/dicionario" },
  { label: "Calendário", to: "/arca/calendario" },
  { label: "Heróis", to: "/arca/herois" },
  { label: "Mapa", to: "/mapa" },
  { label: "Memórias", to: "/arca/memorias" },
  { label: "Colecções", to: "/arca/coleccoes" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-border/40 border-t bg-primary py-14 text-primary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,hsl(var(--electric)/0.05),transparent)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 space-y-4 md:col-span-2">
            <h3 className="font-display font-semibold text-lg">
              Associação Lusíada
            </h3>
            <p className="max-w-xs font-body text-primary-foreground/45 text-xs leading-relaxed">
              Preservar, celebrar e transmitir a herança lusófona para as
              gerações futuras.
            </p>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="mb-3 font-body font-medium text-primary-foreground/60 text-xs uppercase tracking-[0.2em]">
              Institucional
            </h4>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((l) => (
                <Link
                  className="font-body text-primary-foreground/35 text-xs transition-colors duration-200 hover:text-accent"
                  key={l.to}
                  to={l.to}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Arca */}
          <div>
            <h4 className="mb-3 font-body font-medium text-primary-foreground/60 text-xs uppercase tracking-[0.2em]">
              Arca Lusíada
            </h4>
            <div className="flex flex-col gap-1.5">
              {arcaLinks.map((l) => (
                <Link
                  className="font-body text-primary-foreground/35 text-xs transition-colors duration-200 hover:text-accent"
                  key={l.to}
                  to={l.to}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-body font-medium text-primary-foreground/60 text-xs uppercase tracking-[0.2em]">
              Contacto
            </h4>
            <address className="flex flex-col gap-1.5 font-body text-primary-foreground/35 text-xs not-italic leading-relaxed">
              <span>Largo da Freiria 6</span>
              <span>3000-196 Coimbra</span>
              <span>NIF 518 533 301</span>
              <a
                className="transition-colors duration-200 hover:text-accent"
                href="mailto:bernardo@alusiada.pt"
              >
                bernardo@alusiada.pt
              </a>
              <Link
                className="transition-colors duration-200 hover:text-accent"
                to="/contactos"
              >
                Formulário de contacto →
              </Link>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-primary-foreground/8 border-t pt-4 text-center sm:flex-row sm:text-left">
          <p className="font-body text-[11px] text-primary-foreground/25">
            © {new Date().getFullYear()} Associação Memória Lusíada. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
