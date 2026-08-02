import { useConvexAuth, useQuery } from "convex/react";
import { ChevronDown, Menu, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SiteControlPanel } from "@/components/SiteControlPanel";
import { useOnDarkSection } from "@/hooks/use-on-dark-section";
import { api } from "../../convex/_generated/api";

type DropdownItem = { label: string; subtitle?: string; to: string };
type MenuKey = "arca" | "programa" | "sobre";

const menus: Record<MenuKey, { label: string; items: DropdownItem[] }> = {
  arca: {
    label: "Arca",
    items: [
      {
        label: "Panteão",
        subtitle: "Heróis e figuras maiores",
        to: "/arca/panteao",
      },
      {
        label: "Lusopédia",
        subtitle: "A enciclopédia da lusofonia",
        to: "/arca/lusopedia",
      },
      {
        label: "Os Lusíadas",
        subtitle: "A epopeia, anotada verso a verso",
        to: "/os-lusiadas",
      },
      {
        label: "Obras",
        subtitle: "Cânone literário lusíada",
        to: "/arca/obras",
      },
      { label: "Lugares", subtitle: "Lugares de memória", to: "/arca/lugares" },
      {
        label: "Azulejos",
        subtitle: "O mapa do que está nas paredes",
        to: "/azulejos",
      },
    ],
  },
  programa: {
    label: "Programa",
    items: [
      { label: "Agenda", subtitle: "Próximos eventos", to: "/programa/agenda" },
      {
        label: "Iniciativas",
        subtitle: "Linhas de acção",
        to: "/programa/iniciativas",
      },
      {
        label: "Blogue",
        subtitle: "Crónicas e ensaios",
        to: "/programa/blogue",
      },
    ],
  },
  sobre: {
    label: "Sobre",
    items: [
      { label: "Associação", subtitle: "Quem somos", to: "/sobre/associacao" },
      {
        label: "Manifesto",
        subtitle: "A nossa declaração",
        to: "/sobre/manifesto",
      },
      {
        label: "Objectivos",
        subtitle: "Aquilo a que nos propomos",
        to: "/sobre/objectivos",
      },
    ],
  },
};

export function InstitutionalNavbar() {
  const { isAuthenticated: autenticado } = useConvexAuth();
  const perfil = useQuery(api.perfis.meu, autenticado ? {} : "skip");
  // Só o primeiro nome: o botão é estreito e é assim que se trata alguém.
  const primeiroNome =
    perfil?.existe === true ? perfil.nomePublico.trim().split(/\s+/)[0] : null;
  const location = useLocation();
  const isLusiadas =
    typeof window !== "undefined" &&
    /(^|\.)oslusiadas\.pt$/i.test(window.location.hostname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const onLight = !useOnDarkSection();

  const linkBase = onLight
    ? "text-primary/80 hover:text-primary"
    : "text-primary-foreground/80 hover:text-primary-foreground";
  const wordmarkColor = onLight ? "text-primary" : "text-white";
  const hamburgerColor = onLight
    ? "text-primary hover:bg-primary/10"
    : "text-primary-foreground hover:bg-primary-foreground/10";
  const dropdownSubtitle = onLight
    ? "text-primary/60"
    : "text-primary-foreground/60";

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
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1 font-display text-[14px] uppercase tracking-[0.15em] transition-colors ${linkBase}`}
        key={key}
        onClick={() => setOpenMenu((v) => (v === key ? null : key))}
        onMouseEnter={() => setOpenMenu(key)}
        type="button"
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
        className="fixed top-4 left-1/2 z-50 w-[83%] max-w-[1088px] -translate-x-1/2 opacity-100 transition-all duration-300"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div
          className={`glass-nav-hero overflow-hidden rounded-[28px] transition-all duration-[250ms] ease-out ${
            openMenu ? "pb-6" : ""
          }`}
        >
          <div className="flex h-[58px] items-center justify-between pr-3 pl-4 md:pr-3 md:pl-6 lg:grid lg:grid-cols-3">
            {/* Left — Arca + Programa + Sobre */}
            <div className="hidden items-center gap-5 justify-self-start lg:flex">
              {renderTrigger("arca")}
              {renderTrigger("programa")}
              {renderTrigger("sobre")}
            </div>

            {/* Center — wordmark */}
            <Link
              aria-label={
                isLusiadas
                  ? "Os Lusíadas — Página inicial"
                  : "Lusíada — Página inicial"
              }
              className={`font-display ${isLusiadas ? "text-[19px] tracking-[0.14em] md:text-[23px]" : "text-[28px] tracking-[0.18em]"} justify-self-center leading-none transition-colors ${wordmarkColor}`}
              to="/"
            >
              {isLusiadas ? "OS LUSÍADAS" : "LUSÍADA"}
            </Link>

            {/* Right — Junta-te CTA + control panel + Hamburger */}
            <div className="flex items-center gap-2 justify-self-end">
              {/* Quem não tem conta vê «Junta-te»; quem tem, vê-se a si próprio
                  — primeiro nome e retrato, a levar ao seu perfil. */}
              {autenticado && primeiroNome ? (
                <Link
                  aria-label="O meu perfil"
                  className="hidden items-center gap-2.5 rounded-full py-1.5 pr-1.5 pl-5 font-display text-[14px] text-white uppercase tracking-[0.15em] transition-all hover:brightness-110 sm:inline-flex"
                  style={{
                    backgroundColor: "hsl(351 62% 34%)",
                    boxShadow:
                      "0 4px 14px hsl(351 62% 20% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
                  }}
                  to="/perfil"
                >
                  {primeiroNome}
                  <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white/20">
                    {perfil?.existe && perfil.avatarUrl ? (
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={perfil.avatarUrl}
                      />
                    ) : (
                      <span className="font-display text-[13px] text-white">
                        {primeiroNome.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </span>
                </Link>
              ) : (
                <>
                  {!autenticado && (
                    <Link
                      className={`hidden items-center gap-1.5 rounded-full border px-4 py-2.5 font-display text-[13px] uppercase tracking-[0.14em] transition-colors sm:inline-flex ${
                        onLight
                          ? "border-primary/25 text-primary hover:bg-primary/5"
                          : "border-white/35 text-white hover:bg-white/10"
                      }`}
                      to="/entrar"
                    >
                      <UserRound size={15} strokeWidth={1.75} />
                      Entrar
                    </Link>
                  )}
                  <Link
                    className="hidden items-center justify-center rounded-full px-6 py-2.5 font-display text-[14px] text-white uppercase tracking-[0.15em] transition-all hover:brightness-110 sm:inline-flex"
                    style={{
                      backgroundColor: "hsl(351 62% 34%)",
                      boxShadow:
                        "0 4px 14px hsl(351 62% 20% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
                    }}
                    to="/aderir"
                  >
                    Junta-te
                  </Link>
                </>
              )}
              {/* Painel de controlo temporariamente oculto — preservado para futura activação */}
              <div className="hidden">
                <SiteControlPanel onLight={onLight} />
              </div>
              <button
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                className={`ml-2 grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden ${hamburgerColor}`}
                onClick={() => setMobileOpen((v) => !v)}
                type="button"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Dropdown panel — shared bubble */}
          {(Object.keys(menus) as MenuKey[]).map((key) => (
            <div
              className={`grid transition-all duration-[250ms] ease-out ${
                openMenu === key
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              key={key}
            >
              <div className="overflow-hidden">
                <div className="px-6 pt-2 pb-2">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {menus[key].items.map(({ label, subtitle, to }) => (
                      <Link
                        className="group flex flex-col rounded-2xl p-4 transition-colors hover:bg-accent/5"
                        key={to}
                        onClick={() => setOpenMenu(null)}
                        to={to}
                      >
                        <span className="font-display text-[15px] text-accent tracking-[0.1em]">
                          {label}
                        </span>
                        {subtitle && (
                          <span
                            className={`mt-0.5 font-body text-[12px] leading-snug ${dropdownSubtitle}`}
                          >
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
          <div className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-24">
            {(Object.keys(menus) as MenuKey[]).map((key) => (
              <div
                className="flex w-full max-w-xs flex-col items-center gap-3"
                key={key}
              >
                <p className="font-display text-[11px] text-accent uppercase tracking-[0.25em]">
                  {menus[key].label}
                </p>
                {menus[key].items.map(({ label, to }) => (
                  <Link
                    className="font-display text-lg text-primary-foreground tracking-[0.1em] transition-colors hover:text-accent"
                    key={to}
                    onClick={() => setMobileOpen(false)}
                    to={to}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              className="mt-2 inline-flex items-center justify-center rounded-full px-8 py-3 font-display text-base text-white uppercase tracking-[0.15em]"
              onClick={() => setMobileOpen(false)}
              style={{ backgroundColor: "hsl(351 62% 34%)" }}
              to="/aderir"
            >
              Junta-te
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
