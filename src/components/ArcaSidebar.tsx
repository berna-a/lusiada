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
          className="glass-card text-foreground p-2.5 rounded-r-xl hover:shadow-[0_0_20px_-4px_hsl(var(--accent)/0.25)] transition-all duration-300"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const collapsed = state === "collapsed";

  return (
    <aside
      className={`sticky top-20 self-start h-[calc(100vh-5rem)] border-r border-border/30 flex flex-col transition-all duration-300 shrink-0 overflow-hidden ${
        collapsed ? "w-14" : "w-56"
      }`}
      style={{
        background: "hsl(var(--sidebar-background))",
        boxShadow: "inset -1px 0 0 hsl(0 0% 100% / 0.03)",
      }}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border/60">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-primary font-display tracking-wide">Explorar</span>
        )}
        <button
          onClick={() => setState(collapsed ? "expanded" : "collapsed")}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent/80 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {arcaLinks.map((link) => {
          const active = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
          return (
            <Link
              key={link.to}
              to={link.to}
              title={link.label}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-lg text-sm font-body transition-all duration-200 ${
                active
                  ? "bg-sidebar-primary/12 text-sidebar-primary font-medium border border-sidebar-primary/15"
                  : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground/80 border border-transparent"
              } ${collapsed ? "justify-center mx-1.5" : ""}`}
            >
              <link.icon className={`h-4 w-4 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Minimize */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border/60">
          <button
            onClick={() => setState("pip")}
            className="w-full text-[11px] text-sidebar-foreground/30 hover:text-sidebar-foreground/60 font-body transition-all duration-200 tracking-wide uppercase"
          >
            Minimizar
          </button>
        </div>
      )}
    </aside>
  );
}
