import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Archive, Landmark, Calendar, Sword, MapPin, BookOpen, FolderOpen,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const arcaLinks = [
  { label: "Arca", to: "/arca", icon: Archive },
  { label: "Panteão", to: "/arca/panteao", icon: Landmark },
  { label: "Calendário", to: "/arca/calendario", icon: Calendar },
  { label: "Heróis", to: "/arca/herois", icon: Sword },
  { label: "Lugares", to: "/arca/lugares", icon: MapPin },
  { label: "Memórias", to: "/arca/memorias", icon: BookOpen },
  { label: "Colecções", to: "/arca/coleccoes", icon: FolderOpen },
];

type SidebarState = "expanded" | "collapsed" | "pip";

export function ArcaSidebar() {
  const location = useLocation();
  const [state, setState] = useState<SidebarState>("collapsed");

  if (state === "pip") {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setState("collapsed")}
          className="bg-sidebar text-sidebar-foreground p-2.5 rounded-r-xl shadow-[4px_0_16px_-4px_hsl(220_40%_10%/0.2)] hover:bg-sidebar-accent transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const collapsed = state === "collapsed";

  return (
    <aside
      className={`sticky top-20 self-start h-[calc(100vh-5rem)] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 shrink-0 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-primary font-display tracking-wide">Explorar</span>
        )}
        <button
          onClick={() => setState(collapsed ? "expanded" : "collapsed")}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {arcaLinks.map((link) => {
          const active = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
          return (
            <Link
              key={link.to}
              to={link.to}
              title={link.label}
              className={`flex items-center gap-3 px-3 py-2.5 mx-1.5 my-0.5 rounded-lg text-sm font-body transition-all duration-200 ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-[inset_0_1px_0_hsl(0_0%_100%/0.04)]"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Minimize to pip */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setState("pip")}
            className="w-full text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground font-body transition-all duration-200"
          >
            Minimizar
          </button>
        </div>
      )}
    </aside>
  );
}
