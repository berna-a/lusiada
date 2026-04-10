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

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-primary text-primary-foreground py-12 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_100%,hsl(var(--electric)/0.06),transparent)]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-lg font-semibold font-display">Associação Lusíada</h3>
            <p className="text-xs text-primary-foreground/50 max-w-xs leading-relaxed font-body">
              Preservar, celebrar e transmitir a herança lusófona para as gerações futuras.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-primary-foreground/70 mb-3 text-xs uppercase tracking-[0.2em] font-body">Institucional</h4>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs text-primary-foreground/40 hover:text-accent font-body transition-colors duration-200">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-primary-foreground/70 mb-3 text-xs uppercase tracking-[0.2em] font-body">Arca Lusíada</h4>
            <div className="flex flex-col gap-1.5">
              {arcaLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs text-primary-foreground/40 hover:text-accent font-body transition-colors duration-200">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-4 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-primary-foreground/30 font-body">
            © {new Date().getFullYear()} Associação Lusíada. Todos os direitos reservados.
          </p>
          <Link to="/contactos" className="text-[11px] text-primary-foreground/30 hover:text-accent font-body transition-colors duration-200">
            Contactos
          </Link>
        </div>
      </div>
    </footer>
  );
}
