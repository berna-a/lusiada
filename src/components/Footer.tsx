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
    <footer className="border-t bg-card py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Associação Lusíada</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Preservar, celebrar e transmitir a herança lusófona para as gerações futuras.
              Uma comunidade dedicada à memória colectiva.
            </p>
          </div>

          {/* Institutional nav */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Institucional</h4>
            <div className="flex flex-col gap-1.5">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Arca nav */}
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Arca Lusíada</h4>
            <div className="flex flex-col gap-1.5">
              {arcaLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Associação Lusíada. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="/contactos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Contactos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
