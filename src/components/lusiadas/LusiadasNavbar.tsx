import { CircleUser, Search } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOnDarkSection } from "@/hooks/use-on-dark-section";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";

/** Navegação própria do domínio dedicado oslusiadas.pt (substitui a da alusiada.pt). */
export function LusiadasNavbar() {
  const base = useMemo(lusiadasBase, []);
  const { pathname } = useLocation();
  const onDark = useOnDarkSection();

  // Sobre fundo escuro, o azul da marca fica ilegível — inverter para claro.
  const marca = onDark ? "text-white" : "text-primary";
  const inactivo = onDark
    ? "text-white/75 hover:text-white"
    : "text-primary/75 hover:text-primary";

  const isReader =
    pathname === "/" ||
    /^\/canto\//.test(pathname) ||
    pathname === "/os-lusiadas" ||
    /^\/os-lusiadas\/canto\//.test(pathname);

  const links = [
    { label: "Ler", to: cantoHref(base, 1), active: isReader },
    {
      label: "Explorar",
      to: `${base}/explorar`,
      active: pathname.endsWith("/explorar") || pathname.endsWith("/viagem"),
    },
    {
      label: "Comunidade",
      to: `${base}/comunidade`,
      active: pathname.endsWith("/comunidade"),
    },
    {
      label: "Plano",
      to: `${base}/plano`,
      active: pathname.endsWith("/plano"),
    },
    {
      label: "Dicionário",
      to: "/dicionario",
      active: pathname.startsWith("/dicionario"),
    },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed top-4 left-1/2 z-50 w-[92%] max-w-[1000px] -translate-x-1/2"
    >
      <div className="glass-nav-hero overflow-hidden rounded-[28px]">
        <div className="flex h-[58px] items-center gap-3 px-4 md:px-6">
          <Link
            className={`shrink-0 font-display text-[20px] tracking-[0.14em] transition-colors md:text-[23px] ${marca}`}
            to={base || "/"}
          >
            OS LUSÍADAS
          </Link>
          <div className="flex flex-1 items-center justify-end gap-4 overflow-x-auto md:gap-6">
            {links.map((l) => (
              <Link
                className={`shrink-0 font-display text-[13px] uppercase tracking-[0.12em] transition-colors ${
                  l.active ? "text-accent" : inactivo
                }`}
                key={l.label}
                to={l.to}
              >
                {l.label}
              </Link>
            ))}
            <Link
              aria-label="Procurar na obra"
              className={`shrink-0 transition-colors ${
                pathname.endsWith("/procurar") ? "text-accent" : inactivo
              }`}
              to={`${base}/procurar`}
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link
              aria-label="O meu espaço"
              className={`shrink-0 transition-colors ${
                pathname.endsWith("/perfil") ? "text-accent" : inactivo
              }`}
              to={`${base}/perfil`}
            >
              <CircleUser className="h-[19px] w-[19px]" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
