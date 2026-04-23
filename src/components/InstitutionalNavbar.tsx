import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Library, Crown, MapPin, BookOpen, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Associação", to: "/a-associacao" },
  { label: "Programa", to: "/programa" },
  { label: "Apoiar", to: "/apoiar" },
  { label: "Contactos", to: "/contactos" },
];

const arcaItems = [
  {
    icon: Library,
    label: "Colecções",
    subtitle: "Edições e obras da Lusíada",
    to: "/arca/coleccoes",
  },
  {
    icon: Crown,
    label: "Panteão",
    subtitle: "Figuras tutelares da memória",
    to: "/panteao",
  },
  {
    icon: MapPin,
    label: "Lugares",
    subtitle: "Geografia da alma portuguesa",
    to: "/arca/lugares",
  },
  {
    icon: BookOpen,
    label: "Memórias",
    subtitle: "Arquivo vivo da comunidade",
    to: "/arca/memorias",
  },
];

export function InstitutionalNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [arcaOpen, setArcaOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setArcaOpen(false);
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
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1080px]"
        onMouseLeave={() => setArcaOpen(false)}
      >
        <div
          className={`glass-nav-hero rounded-[28px] overflow-hidden transition-all duration-[250ms] ease-out ${
            arcaOpen ? "pb-6" : ""
          }`}
        >
          <div className="h-[58px] pl-6 pr-3 md:pl-8 md:pr-3 flex items-center justify-between">
            {/* Left — wordmark */}
            <Link
              to="/"
              aria-label="Lusíada — Página inicial"
              className="font-display text-[28px] tracking-[0.18em] text-white leading-none"
            >
              LUSÍADA
            </Link>

            {/* Center — desktop links */}
            <div className="hidden lg:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
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

            {/* Right — Arca dropdown + Junta-te CTA / Hamburger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onMouseEnter={() => setArcaOpen(true)}
                onClick={() => setArcaOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={arcaOpen}
                className="arca-glow liquid-glass hidden sm:inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-6 py-2.5 font-display text-[14px] uppercase tracking-[0.15em] text-white transition-colors"
                style={{
                  borderColor: "hsl(45 95% 65%)",
                  boxShadow:
                    "0 0 14px hsl(45 95% 65% / 0.55), 0 0 28px hsl(45 95% 60% / 0.3), inset 0 0 8px hsl(45 95% 80% / 0.25)",
                }}
              >
                Arca
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    arcaOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <Link
                to="/aderir"
                className="hidden sm:inline-flex items-center justify-center rounded-full px-6 py-2.5 font-display text-[14px] uppercase tracking-[0.15em] text-white transition-all hover:brightness-110"
                style={{
                  backgroundColor: "hsl(351 62% 34%)",
                  boxShadow:
                    "0 4px 14px hsl(351 62% 20% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
                }}
              >
                Junta-te
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileOpen}
                className="lg:hidden grid place-items-center h-10 w-10 rounded-full text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Arca dropdown panel — grows from same bubble */}
          <div
            className={`grid transition-all duration-[250ms] ease-out ${
              arcaOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 pt-2 pb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {arcaItems.map(({ icon: Icon, label, subtitle, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setArcaOpen(false)}
                      className="group flex items-start gap-3 rounded-2xl p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="grid place-items-center h-10 w-10 shrink-0 rounded-full border border-accent/30 bg-accent/5 text-accent group-hover:bg-accent/15 group-hover:border-accent/60 transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display text-[15px] tracking-[0.1em] text-accent group-hover:text-accent">
                          {label}
                        </span>
                        <span className="font-body text-[12px] text-primary-foreground/60 leading-snug mt-0.5">
                          {subtitle}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            background:
              "linear-gradient(160deg, hsl(var(--primary) / 0.92), hsl(var(--primary) / 0.96))",
            backdropFilter: "blur(24px) saturate(1.4)",
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          }}
        >
          <div className="h-full flex flex-col items-center justify-center gap-6 overflow-y-auto py-24">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl tracking-[0.1em] text-primary-foreground hover:text-accent transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/aderir"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full px-8 py-3 font-display text-base uppercase tracking-[0.15em] text-white"
              style={{ backgroundColor: "hsl(351 62% 34%)" }}
            >
              Junta-te
            </Link>
            <div className="mt-4 w-full max-w-xs flex flex-col gap-3 px-6">
              <p className="text-center font-body text-[11px] uppercase tracking-[0.2em] text-accent">
                Arca
              </p>
              {arcaItems.map(({ icon: Icon, label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-3 font-display text-sm tracking-[0.1em] text-primary-foreground hover:bg-accent/15 transition-colors"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
