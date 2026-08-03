import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import {
  BookMarked,
  Camera,
  ChevronLeft,
  FolderLock,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";

const adminLinks = [
  { label: "Heróis", to: "/admin", icon: LayoutDashboard },
  { label: "Sócios", to: "/admin/socios", icon: Users },
  { label: "Lusopédia", to: "/admin/lusopedia", icon: BookMarked },
  { label: "Moderação", to: "/admin/moderacao", icon: Inbox },
  { label: "Azulejos", to: "/admin/azulejos", icon: Camera },
  { label: "Portal de Sócios", to: "/admin/portal", icon: FolderLock },
  { label: "Definições", to: "/admin/definicoes", icon: Settings },
];

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="premium-shadow w-full max-w-sm rounded-2xl border border-border bg-card p-10 text-center">
        {children}
      </div>
    </div>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const me = useQuery(api.admin.me);
  const pendingCount = useQuery(api.contributions.adminPendingCount);
  const pendingMembers = useQuery(api.memberships.adminPendingMembersCount);
  const pendingArticles = useQuery(api.articles.adminPendingCount);
  const pendingAzulejos = useQuery(api.azulejos.adminPendingCount);
  const badges: Record<string, number | undefined> = {
    "/admin/moderacao": pendingCount,
    "/admin/socios": pendingMembers,
    "/admin/lusopedia": pendingArticles,
    "/admin/azulejos": pendingAzulejos,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Centered>
        <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.25em]">
          Associação Memória Lusíada
        </p>
        <h1 className="mt-3 font-display text-2xl text-primary">
          Administração
        </h1>
        <p className="mt-3 font-body text-muted-foreground text-sm leading-relaxed">
          Entre com a sua conta Google autorizada para gerir o conteúdo.
        </p>
        <Button
          className="mt-8 w-full"
          onClick={() => signIn("google", { redirectTo: "/admin" })}
          variant="accent"
        >
          Entrar com Google
        </Button>
        <Link
          className="mt-6 inline-block font-body text-muted-foreground text-xs hover:text-foreground"
          to="/"
        >
          ← Voltar ao site
        </Link>
      </Centered>
    );
  }

  if (me === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <Centered>
        <h1 className="font-display text-2xl text-primary">Sem acesso</h1>
        <p className="mt-3 font-body text-muted-foreground text-sm leading-relaxed">
          A conta <strong>{me?.email}</strong> não tem permissões de
          administrador.
        </p>
        <Button
          className="mt-8 w-full"
          onClick={() => signOut()}
          variant="outline"
        >
          Sair
        </Button>
      </Centered>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Ao telemóvel a barra encolhe a uma coluna de ícones: a 375px, os
          224px de menu não deixavam largura nenhuma ao conteúdo e o painel
          transbordava para o lado em todas as páginas. */}
      <aside className="flex w-14 shrink-0 flex-col border-r bg-card md:w-56">
        <div className="hidden border-b p-4 md:block">
          <h2 className="font-display font-semibold text-foreground text-sm">
            Admin · Lusíada
          </h2>
          <p className="mt-0.5 truncate font-body text-[11px] text-muted-foreground">
            {me.email}
          </p>
        </div>
        <nav className="flex-1 py-2">
          {adminLinks.map((link) => {
            const active = location.pathname === link.to;
            const badge = badges[link.to];
            return (
              <Link
                className={`flex items-center justify-center gap-3 py-2 text-sm transition-colors md:justify-start md:px-4 ${
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                key={link.to}
                title={link.label}
                to={link.to}
              >
                <span className="relative">
                  <link.icon className="h-4 w-4" />
                  {/* Sem espaço para o número, o que fica é o sinal de que
                      há algo à espera. */}
                  {typeof badge === "number" && badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent md:hidden" />
                  )}
                </span>
                <span className="hidden md:inline">{link.label}</span>
                {typeof badge === "number" && badge > 0 && (
                  <span className="ml-auto hidden h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 font-body text-[11px] text-accent-foreground md:grid">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t p-4 md:space-y-2">
          <button
            className="flex w-full items-center justify-center gap-1.5 font-body text-muted-foreground text-xs hover:text-foreground md:w-auto md:justify-start"
            onClick={() => signOut()}
            title="Sair"
            type="button"
          >
            <LogOut className="h-3 w-3" />
            <span className="hidden md:inline">Sair</span>
          </button>
          <Link
            className="flex items-center justify-center gap-1 font-body text-muted-foreground text-xs hover:text-foreground md:justify-start"
            title="Voltar ao site"
            to="/"
          >
            <ChevronLeft className="h-3 w-3" />
            <span className="hidden md:inline">Voltar ao site</span>
          </Link>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
