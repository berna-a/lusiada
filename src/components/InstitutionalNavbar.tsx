import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Library, MapPin, BookOpen, ChevronDown, ScrollText, Feather, Fish } from "lucide-react";

const navLinks = [
  { label: "Apoiar", to: "/apoiar" },
];

const sobreItems = [
  { label: "Associação", subtitle: "Quem somos e a nossa missão", to: "/a-associacao" },
  { label: "Programa", subtitle: "Linhas de acção e iniciativas", to: "/programa" },
  { label: "Contactos", subtitle: "Fala connosco", to: "/contactos" },
];

const arcaItems = [
  {
    icon: Library,
    label: "Colecções",
    subtitle: "Edições e obras da Lusíada",
    to: "/arca/coleccoes",
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

const obrasItems = [
  {
    icon: ScrollText,
    label: "Os Lusíadas",
    subtitle: "Luís de Camões",
    to: "/obras/os-lusiadas",
  },
  {
    icon: Feather,
    label: "A Mensagem",
    subtitle: "Fernando Pessoa",
    to: "/obras/a-mensagem",
  },
  {
    icon: Fish,
    label: "Sermão de Santo António aos Peixes",
    subtitle: "Padre António Vieira",
    to: "/obras/sermao-de-santo-antonio",
  },
];

export function InstitutionalNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [arcaOpen, setArcaOpen] = useState(false);
  const [sobreOpen, setSobreOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setArcaOpen(false);
    setSobreOpen(false);
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
      {/* Reveal button when navbar is collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Mostrar menu"
          className="fixed top-4 right-4 z-50 grid place-items-center h-10 w-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-md transition-colors"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      <nav
        aria-label="Navegação principal"
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[98%] max-w-[1280px] transition-all duration-300 ${
          collapsed ? "opacity-0 -translate-y-8 pointer-events-none" : "opacity-100"
        }`}
        onMouseLeave={() => {
          setArcaOpen(false);
          setSobreOpen(false);
        }}
      >
        <div
          className={`glass-nav-hero rounded-[28px] overflow-hidden transition-all duration-[250ms] ease-out ${
            arcaOpen || sobreOpen ? "pb-6" : ""
          }`}
        >
          <div className="h-[58px] pl-4 pr-3 md:pl-6 md:pr-3 grid grid-cols-3 items-center">
            {/* Left — Sobre dropdown + nav links */}
            <div className="hidden lg:flex items-center gap-5 justify-self-start">
              <button
                type="button"
                onMouseEnter={() => {
                  setSobreOpen(true);
                  setArcaOpen(false);
                }}
                onClick={() => setSobreOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={sobreOpen}
                className="inline-flex items-center gap-1 font-display uppercase tracking-[0.15em] text-[14px] text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Sobre
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    sobreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                type="button"
                onMouseEnter={() => {
                  setArcaOpen(true);
                  setSobreOpen(false);
                }}
                onClick={() => setArcaOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={arcaOpen}
                className="inline-flex items-center gap-1 font-display uppercase tracking-[0.15em] text-[14px] text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Arca
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    arcaOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Center — wordmark */}
            <Link
              to="/"
              aria-label="Lusíada — Página inicial"
              className="font-display text-[28px] tracking-[0.18em] text-white leading-none justify-self-center"
            >
              LUSÍADA
            </Link>

            {/* Right — Arca dropdown + Junta-te CTA / Hamburger */}
            <div className="flex items-center gap-2 justify-self-end">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`hidden lg:inline-flex font-display uppercase tracking-[0.15em] text-[14px] px-2 transition-colors ${
                    location.pathname === l.to
                      ? "text-primary-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
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
                onClick={() => setCollapsed(true)}
                aria-label="Ocultar menu"
                title="Ocultar menu"
                className="hidden sm:grid place-items-center h-9 w-9 rounded-full text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                <EyeOff className="h-4 w-4" />
              </button>
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

          {/* Sobre dropdown panel — grows from same bubble */}
          <div
            className={`grid transition-all duration-[250ms] ease-out ${
              sobreOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 pt-2 pb-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sobreItems.map(({ label, subtitle, to }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setSobreOpen(false)}
                      className="group flex flex-col rounded-2xl p-4 hover:bg-accent/5 transition-colors"
                    >
                      <span className="font-display text-[15px] tracking-[0.1em] text-accent">
                        {label}
                      </span>
                      <span className="font-body text-[12px] text-primary-foreground/60 leading-snug mt-0.5">
                        {subtitle}
                      </span>
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
            {[...sobreItems, ...navLinks].map((l) => (
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
