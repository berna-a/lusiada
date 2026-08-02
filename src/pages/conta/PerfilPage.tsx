import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Check, Loader2, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CabecalhoPerfil } from "@/components/conta/CabecalhoPerfil";
import { FormularioPerfil } from "@/components/conta/FormularioPerfil";
import { RodapeGestao } from "@/components/conta/RodapeGestao";
import { Seo } from "@/components/Seo";
import { api } from "../../../convex/_generated/api";

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
  const guardarCapaPos = useMutation(api.perfis.guardarCapaPos);
  const [aEditar, setAEditar] = useState(false);
  // Enquanto se enquadra a capa, a posição vive aqui: só vai para o servidor
  // quando a pessoa disser que está bem.
  const [enquadramento, setEnquadramento] = useState<number | null>(null);

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

  const aEnquadrar = enquadramento !== null;

  if (aEditar) {
    return (
      <main
        className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
        data-nav-theme="light"
      >
        <Seo noindex path="/perfil" title="Editar perfil — Memória Lusíada" />
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
              capaUrl: perfil.capaUrl,
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
      </main>
    );
  }

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

      <CabecalhoPerfil
        // Enquanto se enquadra, o canto da capa passa a ser guardar/desistir:
        // é a única coisa que faz sentido fazer nesse momento.
        accoes={
          aEnquadrar ? (
            <div className="flex gap-2">
              <button
                aria-label="Desistir"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-primary shadow-sm backdrop-blur transition-colors hover:bg-white"
                onClick={() => setEnquadramento(null)}
                type="button"
              >
                <X size={17} strokeWidth={2} />
              </button>
              <button
                className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 font-body text-[13px] text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                onClick={() => {
                  guardarCapaPos({ capaPos: enquadramento });
                  setEnquadramento(null);
                }}
                type="button"
              >
                <Check size={15} strokeWidth={2} />
                Guardar
              </button>
            </div>
          ) : (
            <a
              aria-label="Gerir o perfil"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur transition-colors hover:bg-white"
              href="#gestao"
            >
              <Settings2 size={17} strokeWidth={1.75} />
            </a>
          )
        }
        aEnquadrar={aEnquadrar}
        avatarUrl={perfil.avatarUrl}
        bio={perfil.bio}
        capaPos={enquadramento ?? perfil.capaPos}
        capaUrl={perfil.capaUrl}
        concelho={perfil.concelho}
        nome={perfil.nomePublico}
        onEnquadrar={setEnquadramento}
      />

      {/* O degrau seguinte na casa, quando faz sentido. */}
      {(associacao?.level ?? "adepto") === "adepto" && (
        <section className="mt-12 rounded-2xl border border-accent/30 bg-secondary px-7 py-7 text-center">
          <h2 className="font-display text-[20px] text-primary leading-snug">
            Quer tornar-se sócio?
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] font-body text-[15px] text-foreground/80 leading-relaxed">
            Ter conta já lhe dá a Arca e os contributos. Ser sócio é o degrau
            seguinte — e é o que sustenta a casa.
          </p>
          <Link
            className="mt-5 inline-flex rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            to="/aderir"
          >
            Pedir adesão
          </Link>
        </section>
      )}

      <div id="gestao">
        <RodapeGestao
          email={perfil.email}
          handle={perfil.handle}
          onEditar={() => setAEditar(true)}
          onEnquadrarCapa={() => setEnquadramento(perfil.capaPos)}
          onSair={() => {
            signOut();
            navigate("/");
          }}
          perfilPrivado={perfil.perfilPrivado}
          temCapa={Boolean(perfil.capaUrl)}
        />
      </div>
    </main>
  );
}
