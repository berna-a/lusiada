import { CircleUser, Search } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";

/** Navegação própria do domínio dedicado oslusiadas.pt (substitui a da alusiada.pt). */
export function LusiadasNavbar() {
  const base = useMemo(lusiadasBase, []);
  const { pathname } = useLocation();

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
    { label: "Plano", to: `${base}/plano`, active: pathname.endsWith("/plano") },
    { label: "Dicionário", to: "/dicionario", active: pathname.startsWith("/dicionario") },
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="-translate-x-1/2 fixed top-4 left-1/2 z-50 w-[92%] max-w-[1000px]"
    >
      <div className="glass-nav-hero overflow-hidden rounded-[28px]">
        <div className="flex h-[58px] items-center gap-3 px-4 md:px-6">
          <Link
            className="shrink-0 font-display text-[20px] text-primary tracking-[0.14em] md:text-[23px]"
            to={base || "/"}
          >
            OS LUSÍADAS
          </Link>
          <div className="flex flex-1 items-center justify-end gap-4 overflow-x-auto md:gap-6">
            {links.map((l) => (
              <Link
                className={`shrink-0 font-display text-[13px] uppercase tracking-[0.12em] transition-colors ${
                  l.active
                    ? "text-accent"
                    : "text-primary/75 hover:text-primary"
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
                pathname.endsWith("/procurar")
                  ? "text-accent"
                  : "text-primary/75 hover:text-primary"
              }`}
              to={`${base}/procurar`}
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link
              aria-label="O meu espaço"
              className={`shrink-0 transition-colors ${
                pathname.endsWith("/perfil")
                  ? "text-accent"
                  : "text-primary/75 hover:text-primary"
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
