import {
  Archive,
  BookA,
  BookMarked,
  BookOpen,
  Calendar,
  FolderOpen,
  Landmark,
  MapPin,
  Menu,
  Sword,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const arcaLinks = [
  { label: "Arca", to: "/arca", icon: Archive },
  { label: "Panteão", to: "/arca/panteao", icon: Landmark },
  { label: "Lusopédia", to: "/arca/lusopedia", icon: BookMarked },
  { label: "Dicionário", to: "/dicionario", icon: BookA },
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
        aria-label="Abrir menu de exploração"
        className={`glass-nav left-3 z-50 flex h-12 w-12 items-center justify-center rounded-full text-foreground transition-all duration-300 hover:text-accent hover:shadow-[0_0_20px_-4px_hsl(var(--accent)/0.4)] md:left-4 ${
          stuck ? "fixed top-[10px] animate-fade-in" : "absolute bottom-[10px]"
        }`}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fade-in fixed inset-0 z-[60] animate-in bg-background/40 backdrop-blur-sm duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`glass-nav fixed top-0 left-0 z-[70] flex h-screen w-[280px] flex-col border-nav-glass-border border-r transition-transform duration-500 ease-out sm:w-[320px] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow: open
            ? "8px 0 48px -8px hsl(220 40% 6% / 0.4), inset -1px 0 0 hsl(0 0% 100% / 0.06)"
            : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-border/20 border-b px-5 pt-6 pb-5">
          <span className="font-body font-semibold text-accent text-xs uppercase tracking-[0.3em]">
            Explorar
          </span>
          <button
            aria-label="Fechar menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted/40 hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {arcaLinks.map((link) => {
            const active =
              location.pathname === link.to ||
              location.pathname.startsWith(`${link.to}/`);
            return (
              <Link
                className={`mx-3 my-0.5 flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm transition-all duration-200 ${
                  active
                    ? "bg-accent/15 font-medium text-accent shadow-[inset_0_1px_0_hsl(0_0%_100%/0.06)]"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
                key={link.to}
                to={link.to}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer hint */}
        <div className="border-border/20 border-t px-5 py-4">
          <p className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-wide">
            Arca · Memória Lusíada
          </p>
        </div>
      </aside>
    </>
  );
}
