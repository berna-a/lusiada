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
  { label: "Calendário", to: "/arca/calendario" },
  { label: "Heróis", to: "/arca/herois" },
  { label: "Lugares", to: "/arca/lugares" },
  { label: "Memórias", to: "/arca/memorias" },
  { label: "Colecções", to: "/arca/coleccoes" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <rect height="20" rx="5" width="20" x="2" y="2" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" fill="currentColor" r="1" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect height="12" width="4" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
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
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  aria-label={s.label}
                  className="text-primary-foreground/30 transition-colors duration-200 hover:text-accent"
                  href={s.href}
                  key={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
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
                href="mailto:admin@alusiada.pt"
              >
                admin@alusiada.pt
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
