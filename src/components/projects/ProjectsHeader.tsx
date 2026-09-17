import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./projects-theme.css";

export function ProjectsHeader() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const isDemo = pathname.startsWith("/demonstracao/projectos");
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-accent/25 border-b bg-background/95 text-foreground shadow-[0_8px_30px_-22px_hsl(var(--primary)/0.5)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-7">
          <Link
            className="font-display text-primary text-xl tracking-[.16em]"
            to="/"
          >
            LUSÍADA
          </Link>
          <nav
            aria-label="Projectos"
            className="hidden items-center gap-5 text-[13px] md:flex"
          >
            <Link
              className="font-display text-[12px] text-primary uppercase tracking-[.12em]"
              to="/projectos"
            >
              Descobrir projectos
            </Link>
            <Link
              className="font-display text-[12px] uppercase tracking-[.12em] hover:text-primary"
              to="/programa/iniciativas"
            >
              Iniciativas
            </Link>
            <Link
              className="font-display text-[12px] uppercase tracking-[.12em] hover:text-primary"
              to="/apoiar"
            >
              Como ajudar
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            aria-label="Pesquisar projectos"
            className="grid h-10 w-10 place-items-center hover:bg-primary/5"
            to="/projectos?pesquisa="
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          {isDemo && (
            <Link
              className="cf-secondary-action hidden px-4 py-2 font-display text-[11px] uppercase tracking-[.1em] sm:block"
              to="/projectos"
            >
              Sair da gestão
            </Link>
          )}
          <button
            aria-expanded={open}
            aria-label={open ? "Fechar navegação" : "Abrir navegação"}
            className="grid h-10 w-10 place-items-center md:hidden"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          aria-label="Projectos no telemóvel"
          className="border-border border-t bg-card px-4 py-4 text-sm md:hidden"
        >
          <Link
            className="block py-2 font-semibold text-primary"
            onClick={() => setOpen(false)}
            to="/projectos"
          >
            Descobrir projectos
          </Link>
          <Link
            className="block py-2"
            onClick={() => setOpen(false)}
            to="/programa/iniciativas"
          >
            Iniciativas
          </Link>
          <Link
            className="block py-2"
            onClick={() => setOpen(false)}
            to="/apoiar"
          >
            Como ajudar
          </Link>
        </nav>
      )}
    </header>
  );
}
