import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { SiteControlPanel } from "@/components/SiteControlPanel";

type DropdownItem = { label: string; subtitle?: string; to: string };
type MenuKey = "arca" | "programa" | "sobre";

const menus: Record<MenuKey, { label: string; items: DropdownItem[] }> = {
  arca: {
    label: "Arca",
    items: [
      { label: "Obras", subtitle: "Cânone literário lusíada", to: "/arca/obras" },
      { label: "Lugares", subtitle: "Lugares de memória", to: "/arca/lugares" },
      { label: "Panteão", subtitle: "Heróis e figuras maiores", to: "/arca/panteao" },
    ],
  },
  programa: {
    label: "Programa",
    items: [
      { label: "Agenda", subtitle: "Próximos eventos", to: "/programa/agenda" },
      { label: "Iniciativas", subtitle: "Linhas de acção", to: "/programa/iniciativas" },
      { label: "Blogue", subtitle: "Crónicas e ensaios", to: "/programa/blogue" },
    ],
  },
  sobre: {
    label: "Sobre",
    items: [
      { label: "Associação", subtitle: "Quem somos", to: "/sobre/associacao" },
      { label: "Manifesto", subtitle: "A nossa declaração", to: "/sobre/manifesto" },
      { label: "Objectivos", subtitle: "Aquilo a que nos propomos", to: "/sobre/objectivos" },
    ],
  },
};

export function InstitutionalNavbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [onLight, setOnLight] = useState(true);

  useEffect(() => {
    const navHeight = 80;
    const compute = () => {
      const elements = document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]');
      let overDark = false;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navHeight && rect.bottom >= navHeight) {
          overDark = true;
        }
      });
      setOnLight(!overDark);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    const t = window.setTimeout(compute, 50);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      window.clearTimeout(t);
    };
  }, [location.pathname]);

  const linkBase = onLight
    ? "text-primary/80 hover:text-primary"
    : "text-primary-foreground/80 hover:text-primary-foreground";
  const wordmarkColor = onLight ? "text-primary" : "text-white";
  const hamburgerColor = onLight
    ? "text-primary hover:bg-primary/10"
    : "text-primary-foreground hover:bg-primary-foreground/10";
  const dropdownSubtitle = onLight ? "text-primary/60" : "text-primary-foreground/60";

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const renderTrigger = (key: MenuKey) => {
    const isOpen = openMenu === key;
    return (
      <button
        key={key}
        type="button"
        onMouseEnter={() => setOpenMenu(key)}
        onClick={() => setOpenMenu((v) => (v === key ? null : key))}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1 font-display uppercase tracking-[0.15em] text-[14px] transition-colors ${linkBase}`}
      >
        {menus[key].label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    );
  };

  return (
    <>
      <nav
        aria-label="Navegação principal"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[83%] max-w-[1088px] transition-all duration-300 opacity-100"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div
          className={`glass-nav-hero rounded-[28px] overflow-hidden transition-all duration-[250ms] ease-out ${
            openMenu ? "pb-6" : ""
          }`}
        >
          <div className="h-[58px] pl-4 pr-3 md:pl-6 md:pr-3 grid grid-cols-3 items-center">
            {/* Left — Arca + Programa */}
            <div className="hidden lg:flex items-center gap-5 justify-self-start">
              {renderTrigger("arca")}
              {renderTrigger("programa")}
            </div>

            {/* Center — wordmark */}
            <Link
              to="/"
              aria-label="Lusíada — Página inicial"
              className={`font-display text-[28px] tracking-[0.18em] leading-none justify-self-center transition-colors ${wordmarkColor}`}
            >
              LUSÍADA
            </Link>

            {/* Right — Sobre + Junta-te CTA / Hamburger */}
            <div className="flex items-center gap-6 justify-self-end">
              <div className="hidden lg:flex items-center gap-5">
                {renderTrigger("sobre")}
              </div>
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
              <SiteControlPanel onLight={onLight} />
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileOpen}
                className={`lg:hidden grid place-items-center h-10 w-10 rounded-full transition-colors ${hamburgerColor}`}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Dropdown panel — shared bubble */}
          {(Object.keys(menus) as MenuKey[]).map((key) => (
            <div
              key={key}
              className={`grid transition-all duration-[250ms] ease-out ${
                openMenu === key ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pt-2 pb-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {menus[key].items.map(({ label, subtitle, to }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpenMenu(null)}
                        className="group flex flex-col rounded-2xl p-4 hover:bg-accent/5 transition-colors"
                      >
                        <span className="font-display text-[15px] tracking-[0.1em] text-accent">
                          {label}
                        </span>
                        {subtitle && (
                          <span className={`font-body text-[12px] leading-snug mt-0.5 ${dropdownSubtitle}`}>
                            {subtitle}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
          <div className="h-full flex flex-col items-center justify-center gap-8 overflow-y-auto py-24 px-6">
            {(Object.keys(menus) as MenuKey[]).map((key) => (
              <div key={key} className="w-full max-w-xs flex flex-col items-center gap-3">
                <p className="font-display text-[11px] uppercase tracking-[0.25em] text-accent">
                  {menus[key].label}
                </p>
                {menus[key].items.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-lg tracking-[0.1em] text-primary-foreground hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              to="/aderir"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full px-8 py-3 font-display text-base uppercase tracking-[0.15em] text-white"
              style={{ backgroundColor: "hsl(351 62% 34%)" }}
            >
              Junta-te
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
