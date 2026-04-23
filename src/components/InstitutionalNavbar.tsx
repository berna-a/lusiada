import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Panteão", to: "/panteao" },
  { label: "Associação", to: "/a-associacao" },
  { label: "Contacto", to: "/contacto" },
];

export function InstitutionalNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[800px]"
      >
        <div className="glass-nav-hero rounded-full h-12 pl-5 pr-2 md:pl-6 md:pr-2 flex items-center justify-between">
          {/* Left — wordmark */}
          <Link
            to="/"
            aria-label="Lusíada — Página inicial"
            className="font-display text-[14px] tracking-[0.18em] text-accent"
          >
            LUSÍADA
          </Link>

          {/* Center — desktop links */}
          <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-[14px] transition-colors ${
                  location.pathname === l.to
                    ? "text-primary-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right — Aderir / Hamburger */}
          <div className="flex items-center gap-2">
            <Link
              to="/aderir"
              aria-label="Aderir à Associação Lusíada"
              className="liquid-glass hidden sm:inline-flex items-center justify-center rounded-full px-5 py-1.5 font-display text-[13px] tracking-[0.12em] text-primary-foreground border border-accent/40 bg-accent/15 hover:bg-accent/25 transition-colors"
            >
              Aderir
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              className="md:hidden grid place-items-center h-9 w-9 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--primary) / 0.92), hsl(var(--primary) / 0.96))",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          }}
        >
          <div className="h-full flex flex-col items-center justify-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl tracking-[0.1em] text-primary-foreground hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/aderir"
              onClick={() => setMobileOpen(false)}
              className="liquid-glass mt-4 inline-flex items-center justify-center rounded-full border border-accent/60 bg-accent/20 px-8 py-3 font-display text-base tracking-[0.12em] text-primary-foreground"
            >
              Aderir
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
