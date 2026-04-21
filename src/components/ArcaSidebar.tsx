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
      <div className="hidden md:block fixed left-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setState("collapsed")}
          className="glass-nav text-foreground p-2.5 rounded-r-xl transition-all duration-300 hover:shadow-[0_0_20px_-4px_hsl(var(--accent)/0.2)]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const collapsed = state === "collapsed";

  return (
    <aside
      className={`hidden md:flex sticky top-0 self-start h-screen border-r border-border/20 flex-col transition-all duration-300 shrink-0 overflow-hidden ${
        collapsed ? "w-14" : "w-56"
      }`}
      style={{
        background: "hsl(var(--sidebar-background))",
        boxShadow: "inset -1px 0 0 hsl(0 0% 100% / 0.03), 4px 0 24px -4px hsl(220 40% 6% / 0.15)",
      }}
    >
      {/* Header */}
      <div className="p-3 pt-[4.5rem] flex items-center justify-between border-b border-sidebar-border/40">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-primary font-display tracking-wide">Explorar</span>
        )}
        <button
          onClick={() => setState(collapsed ? "expanded" : "collapsed")}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent/60 transition-all duration-200"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/50" /> : <ChevronLeft className="h-3.5 w-3.5 text-sidebar-foreground/50" />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {arcaLinks.map((link) => {
          const active = location.pathname === link.to || location.pathname.startsWith(link.to + "/");
          return (
            <Link
              key={link.to}
              to={link.to}
              title={link.label}
              className={`flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-lg text-sm font-body transition-all duration-200 ${
                active
                  ? "bg-sidebar-primary/10 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/40 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground/70"
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
        <div className="p-3 border-t border-sidebar-border/40">
          <button
            onClick={() => setState("pip")}
            className="w-full text-[11px] text-sidebar-foreground/25 hover:text-sidebar-foreground/50 font-body transition-all duration-200 tracking-wide uppercase"
          >
            Minimizar
          </button>
        </div>
      )}
    </aside>
  );
}
