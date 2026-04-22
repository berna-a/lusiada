import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Archive, Landmark, Calendar, Sword, MapPin, BookOpen, FolderOpen,
  Menu, X,
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

export function ArcaSidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Mirror the navbar's sticky behavior so hamburger stays side-by-side
  useEffect(() => {
    const onScroll = () => {
      const trigger = window.innerHeight * 0.7;
      setStuck(window.scrollY > trigger);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Hamburger trigger — fixed top-left, floats over hero */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu de exploração"
        className={`glass-nav left-3 md:left-4 z-50 h-12 w-12 rounded-full flex items-center justify-center text-foreground hover:text-accent transition-all duration-300 hover:shadow-[0_0_20px_-4px_hsl(var(--accent)/0.4)] ${
          stuck
            ? "fixed top-[10px] animate-fade-in"
            : "absolute bottom-[10px]"
        }`}
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-background/40 backdrop-blur-sm animate-in fade-in duration-300"
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 left-0 z-[70] h-screen w-[280px] sm:w-[320px] glass-nav border-r border-nav-glass-border flex flex-col transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow: open
            ? "8px 0 48px -8px hsl(220 40% 6% / 0.4), inset -1px 0 0 hsl(0 0% 100% / 0.06)"
            : "none",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-5 flex items-center justify-between border-b border-border/20">
          <span className="text-xs font-semibold text-accent font-body tracking-[0.3em] uppercase">
            Explorar
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {arcaLinks.map((link) => {
            const active =
              location.pathname === link.to ||
              location.pathname.startsWith(link.to + "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 mx-3 my-0.5 rounded-xl text-sm font-body transition-all duration-200 ${
                  active
                    ? "bg-accent/15 text-accent font-medium shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)]"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer hint */}
        <div className="px-5 py-4 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground/60 font-body tracking-wide uppercase">
            Arca · Memória Lusíada
          </p>
        </div>
      </aside>
    </>
  );
}
