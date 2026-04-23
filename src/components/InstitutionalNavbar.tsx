import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "Associação", to: "/associacao" },
  { label: "Programa", to: "/programa" },
  { label: "Apoiar", to: "/apoiar" },
  { label: "Contactos", to: "/contactos" },
];

export function InstitutionalNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => {
      // Trigger sticky once user scrolls past most of the hero section
      const trigger = window.innerHeight * 0.7;
      setStuck(window.scrollY > trigger);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-5xl transition-all duration-300 ${
        stuck
          ? "fixed top-[10px] animate-fade-in"
          : "absolute bottom-[10px]"
      }`}
    >
      <div className="glass-nav rounded-full h-12 px-4 md:px-6 flex items-center justify-between">
        {/* Logo — "A." in repouso, expands to "Associação" on navbar hover */}
        <Link
          to="/"
          aria-label="Associação Lusíada"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="font-semibold text-base md:text-2xl uppercase tracking-[0.12em] text-white font-display flex items-baseline whitespace-nowrap"
        >
          <span aria-hidden="true">A</span>
          <span
            aria-hidden="true"
            className="inline-grid overflow-hidden transition-[grid-template-columns] duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ gridTemplateColumns: hovered ? "1fr" : "0fr" }}
          >
            <span
              className="min-w-0 overflow-hidden transition-[opacity,filter,transform] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                opacity: hovered ? 1 : 0,
                filter: hovered ? "blur(0px)" : "blur(4px)",
                transform: hovered ? "translateX(0)" : "translateX(-4px)",
                transitionDelay: hovered ? "150ms" : "0ms",
              }}
            >
              ssociação
            </span>
          </span>
          <span
            aria-hidden="true"
            className="transition-opacity duration-500 ease-out"
            style={{ opacity: hovered ? 0 : 1 }}
          >
            .
          </span>
          <span aria-hidden="true">&nbsp;Lusíada</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-1.5 rounded-full text-sm font-body transition-all duration-200 ${
                location.pathname === link.to
                  ? "bg-primary text-white shadow-[0_2px_8px_-2px_hsl(var(--primary)/0.3)]"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/aderir"
            className={`ml-2 px-4 py-1.5 rounded-full text-sm font-body tracking-wide transition-all duration-200 ${
              location.pathname === "/aderir"
                ? "bg-accent text-accent-foreground shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.5)]"
                : "bg-accent/90 text-accent-foreground hover:bg-accent shadow-[0_2px_8px_-2px_hsl(var(--accent)/0.4)]"
            }`}
          >
            Aderir
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass-nav mt-2 rounded-2xl p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-body transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-primary text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/aderir"
              onClick={() => setMobileOpen(false)}
              className={`mt-2 px-4 py-2.5 rounded-xl text-sm font-body text-center transition-all duration-200 ${
                location.pathname === "/aderir"
                  ? "bg-accent text-accent-foreground"
                  : "bg-accent/90 text-accent-foreground hover:bg-accent"
              }`}
            >
              Aderir
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
