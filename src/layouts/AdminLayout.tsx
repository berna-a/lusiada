import { Outlet, Link, useLocation } from "react-router-dom";
import { Settings, LayoutDashboard, ChevronLeft } from "lucide-react";

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Definições", to: "/admin/definicoes", icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-card border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm text-foreground">Admin</h2>
        </div>
        <nav className="flex-1 py-2">
          {adminLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
