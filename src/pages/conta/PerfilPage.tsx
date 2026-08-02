import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { ExternalLink, Loader2, LogOut, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormularioPerfil } from "@/components/conta/FormularioPerfil";
import { Seo } from "@/components/Seo";
import { api } from "../../../convex/_generated/api";

const NIVEL = {
  adepto: "Titular de conta",
  pending: "Adesão em análise",
  approved: "Sócio — quota por pagar",
  member: "Sócio",
  visitor: "Visitante",
} as const;

/** O meu perfil: ver, editar, e o degrau em que estou na casa. */
export default function PerfilPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const perfil = useQuery(api.perfis.meu, isAuthenticated ? {} : "skip");
  const associacao = useQuery(
    api.memberships.myMembership,
    isAuthenticated ? {} : "skip"
  );
  const [aEditar, setAEditar] = useState(false);

  useEffect(() => {
    if (!(isLoading || isAuthenticated)) {
      navigate("/entrar?destino=/perfil", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Sem perfil ainda? Passa primeiro pelas boas-vindas.
  useEffect(() => {
    if (perfil && !perfil.existe) {
      navigate("/bem-vindo", { replace: true });
    }
  }, [perfil, navigate]);

  if (isLoading || perfil === undefined) {
    return (
      <main
        className="flex min-h-[60vh] items-center justify-center"
        data-nav-theme="light"
      >
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </main>
    );
  }
  if (!perfil?.existe) {
    return null;
  }

  const nivel = associacao?.level ?? "adepto";

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="O seu perfil na Associação Memória Lusíada."
        noindex
        path="/perfil"
        title="O meu perfil — Memória Lusíada"
      />

      {aEditar ? (
        <>
          <header className="text-center">
            <h1 className="font-display text-[30px] text-primary leading-tight sm:text-[38px]">
              Editar perfil
            </h1>
          </header>
          <div className="mt-8">
            <FormularioPerfil
              inicial={{
                handle: perfil.handle,
                nomePublico: perfil.nomePublico,
                bio: perfil.bio ?? "",
                concelho: perfil.concelho ?? "",
                avatarUrl: perfil.avatarUrl,
                perfilPrivado: perfil.perfilPrivado,
              }}
              modo="editar"
              onGuardado={() => setAEditar(false)}
            />
            <button
              className="mt-3 w-full rounded-xl border border-border py-3 font-body text-[14px] text-muted-foreground"
              onClick={() => setAEditar(false)}
              type="button"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <header className="flex flex-col items-center text-center">
            <span className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
              {perfil.avatarUrl ? (
                <img
                  alt={perfil.nomePublico}
                  className="h-full w-full object-cover"
                  src={perfil.avatarUrl}
                />
              ) : (
                <span className="font-display text-[30px] text-primary">
                  {perfil.nomePublico.slice(0, 1).toUpperCase()}
                </span>
              )}
            </span>
            <h1 className="mt-5 font-display text-[30px] text-primary leading-tight sm:text-[38px]">
              {perfil.nomePublico}
            </h1>
            <p className="mt-1.5 font-body text-[14px] text-muted-foreground">
              /u/{perfil.handle}
              {perfil.concelho ? ` · ${perfil.concelho}` : ""}
            </p>
            <span className="mt-4 rounded-full border border-accent/40 px-4 py-1.5 font-body text-[12px] text-primary uppercase tracking-[0.14em]">
              {NIVEL[nivel as keyof typeof NIVEL] ?? "Titular de conta"}
            </span>
            {perfil.bio && (
              <p className="mx-auto mt-6 max-w-[440px] font-body text-[16px] text-foreground/80 leading-relaxed">
                {perfil.bio}
              </p>
            )}
          </header>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
              onClick={() => setAEditar(true)}
              type="button"
            >
              <Pencil size={15} strokeWidth={1.75} />
              Editar perfil
            </button>
            {!perfil.perfilPrivado && (
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-6 py-2.5 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
                to={`/u/${perfil.handle}`}
              >
                <ExternalLink size={15} strokeWidth={1.75} />
                Ver como público
              </Link>
            )}
          </div>

          {/* O degrau seguinte na casa, quando faz sentido. */}
          {nivel === "adepto" && (
            <section className="mt-12 rounded-2xl border border-accent/30 bg-secondary px-7 py-7 text-center">
              <h2 className="font-display text-[20px] text-primary leading-snug">
                Quer tornar-se sócio?
              </h2>
              <p className="mx-auto mt-3 max-w-[420px] font-body text-[15px] text-foreground/80 leading-relaxed">
                Ter conta já lhe dá a Arca e os contributos. Ser sócio é o
                degrau seguinte — e é o que sustenta a casa.
              </p>
              <Link
                className="mt-5 inline-flex rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
                to="/aderir"
              >
                Pedir adesão
              </Link>
            </section>
          )}

          <div className="mt-12 border-border border-t pt-8 text-center">
            <Link
              className="font-body text-[14px] text-muted-foreground underline underline-offset-4"
              to="/conta"
            >
              Adesão, quotas e dados pessoais
            </Link>
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 font-body text-[14px] text-muted-foreground transition-colors hover:text-destructive"
              onClick={() => {
                signOut();
                navigate("/");
              }}
              type="button"
            >
              <LogOut size={15} strokeWidth={1.75} />
              Terminar sessão
            </button>
          </div>
        </>
      )}
    </main>
  );
}
