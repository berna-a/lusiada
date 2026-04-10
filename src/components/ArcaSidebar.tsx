import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Archive,
  Landmark,
  Calendar,
  Sword,
  MapPin,
  BookOpen,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
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
  const [state, setState] = useState<SidebarState>("expanded");
  const [pinned, setPinned] = useState(false);

  if (state === "pip") {
    return (
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setState("collapsed")}
          className="bg-sidebar text-sidebar-foreground p-2 rounded-r-lg shadow-lg hover:bg-sidebar-accent transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const collapsed = state === "collapsed";

  return (
    <aside
      className={`${
        pinned ? "relative" : "fixed left-0 top-0 z-40"
      } h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-14" : "w-56"
      }`}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-sm font-semibold text-sidebar-primary">Arca</span>
        )}
        <div className="flex items-center gap-1">
          {!collapsed && (
            <button
              onClick={() => setPinned(!pinned)}
              className="p-1 rounded hover:bg-sidebar-accent transition-colors"
              title={pinned ? "Libertar" : "Fixar"}
            >
              {pinned ? (
                <PinOff className="h-3.5 w-3.5" />
              ) : (
                <Pin className="h-3.5 w-3.5" />
              )}
            </button>
          )}
          <button
            onClick={() =>
              setState(collapsed ? "expanded" : "collapsed")
            }
            className="p-1 rounded hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {arcaLinks.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              title={link.label}
              className={`flex items-center gap-3 px-3 py-2 mx-1 rounded-md text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
            className="w-full text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          >
            Minimizar
          </button>
        </div>
      )}

      {/* Back to site */}
      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/"
          className={`text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors ${
            collapsed ? "text-center block" : ""
          }`}
        >
          {collapsed ? "←" : "← Voltar ao site"}
        </Link>
      </div>
    </aside>
  );
}
