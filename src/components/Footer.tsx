import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Associação Lusíada</h3>
            <p className="text-sm text-muted-foreground">
              Preservar, celebrar e transmitir a herança lusófona.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Navegação</h4>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Associação", to: "/associacao" },
                { label: "Programa", to: "/programa" },
                { label: "Apoiar", to: "/apoiar" },
                { label: "Contactos", to: "/contactos" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3 text-sm">Arca</h4>
            <div className="flex flex-col gap-1.5">
              {["Panteão", "Calendário", "Heróis", "Lugares"].map((l) => (
                <Link key={l} to={`/arca/${l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Associação Lusíada. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
