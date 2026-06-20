import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import {
  BookMarked,
  ChevronLeft,
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
  const badges: Record<string, number | undefined> = {
    "/admin/moderacao": pendingCount,
    "/admin/socios": pendingMembers,
    "/admin/lusopedia": pendingArticles,
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
      <aside className="flex w-56 flex-col border-r bg-card">
        <div className="border-b p-4">
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
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
                key={link.to}
                to={link.to}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
                {typeof badge === "number" && badge > 0 && (
                  <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 font-body text-[11px] text-accent-foreground">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t p-4">
          <button
            className="flex items-center gap-1.5 font-body text-muted-foreground text-xs hover:text-foreground"
            onClick={() => signOut()}
            type="button"
          >
            <LogOut className="h-3 w-3" /> Sair
          </button>
          <Link
            className="flex items-center gap-1 font-body text-muted-foreground text-xs hover:text-foreground"
            to="/"
          >
            <ChevronLeft className="h-3 w-3" /> Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}
