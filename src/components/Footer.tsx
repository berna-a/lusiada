import { Link } from "react-router-dom";

const navLinks = [
  { label: "Associação", to: "/associacao" },
  { label: "Programa", to: "/programa" },
  { label: "Apoiar", to: "/apoiar" },
  { label: "Contactos", to: "/contactos" },
];

const arcaLinks = [
  { label: "Panteão", to: "/arca/panteao" },
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
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-primary text-primary-foreground py-14 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,hsl(var(--electric)/0.05),transparent)]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold font-display">Associação Lusíada</h3>
            <p className="text-xs text-primary-foreground/45 max-w-xs leading-relaxed font-body">
              Preservar, celebrar e transmitir a herança lusófona para as gerações futuras.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-primary-foreground/30 hover:text-accent transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-medium text-primary-foreground/60 mb-3 text-xs uppercase tracking-[0.2em] font-body">Institucional</h4>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs text-primary-foreground/35 hover:text-accent font-body transition-colors duration-200">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Arca */}
          <div>
            <h4 className="font-medium text-primary-foreground/60 mb-3 text-xs uppercase tracking-[0.2em] font-body">Arca Lusíada</h4>
            <div className="flex flex-col gap-1.5">
              {arcaLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs text-primary-foreground/35 hover:text-accent font-body transition-colors duration-200">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-primary-foreground/60 mb-3 text-xs uppercase tracking-[0.2em] font-body">Contacto</h4>
            <div className="flex flex-col gap-1.5 text-xs text-primary-foreground/35 font-body">
              <span>info@associacaolusíada.pt</span>
              <Link to="/contactos" className="hover:text-accent transition-colors duration-200">
                Formulário de contacto →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-primary-foreground/8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-primary-foreground/25 font-body">
            © {new Date().getFullYear()} Associação Lusíada. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-primary-foreground/20 hover:text-accent transition-colors duration-200 sm:hidden"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
