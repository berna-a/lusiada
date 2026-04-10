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
    <footer className="border-t border-border/50 bg-card py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-base font-semibold text-foreground">Associação Lusíada</h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Preservar, celebrar e transmitir a herança lusófona para as gerações futuras.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2 text-xs uppercase tracking-wider">Institucional</h4>
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2 text-xs uppercase tracking-wider">Arca Lusíada</h4>
            <div className="flex flex-col gap-1">
              {arcaLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} Associação Lusíada. Todos os direitos reservados.
          </p>
          <Link to="/contactos" className="text-[11px] text-muted-foreground hover:text-foreground transition-colors">
            Contactos
          </Link>
        </div>
      </div>
    </footer>
  );
}
