import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormularioPerfil } from "@/components/conta/FormularioPerfil";
import { Seo } from "@/components/Seo";
import { api } from "../../../convex/_generated/api";

/**
 * Boas-vindas: o único passo obrigatório depois de criar conta.
 *
 * Pede-se o mínimo — como quer ser tratado e o endereço do perfil. Tudo o
 * resto pode ficar para depois; quem entra quer ver a casa, não preencher
 * formulários.
 */
export default function BemVindoPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const perfil = useQuery(api.perfis.meu, isAuthenticated ? {} : "skip");
  const navigate = useNavigate();

  useEffect(() => {
    if (!(isLoading || isAuthenticated)) {
      navigate("/entrar?destino=/bem-vindo", { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Quem já passou por aqui vai directo ao perfil.
  useEffect(() => {
    if (perfil?.existe && perfil.onboardingFeito) {
      navigate("/perfil", { replace: true });
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
  if (!perfil) {
    return null;
  }

  return (
    <main
      className="mx-auto max-w-md px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Complete o seu perfil na Associação Memória Lusíada."
        noindex
        path="/bem-vindo"
        title="Bem-vindo — Memória Lusíada"
      />
      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Bem-vindo
        </p>
        <h1 className="mt-3 font-display text-[34px] text-primary leading-[1.1] sm:text-[42px]">
          Diga-nos quem é
        </h1>
        <p className="mx-auto mt-5 max-w-[340px] font-body text-[15px] text-foreground/70 leading-relaxed">
          Dois campos e está. O resto pode preencher quando quiser.
        </p>
      </header>

      <div className="mt-10">
        <FormularioPerfil
          inicial={
            perfil.existe
              ? {
                  handle: perfil.handle,
                  nomePublico: perfil.nomePublico,
                  bio: perfil.bio ?? "",
                  concelho: perfil.concelho ?? "",
                  avatarUrl: perfil.avatarUrl,
                  capaUrl: perfil.capaUrl,
                  perfilPrivado: perfil.perfilPrivado,
                }
              : {
                  handle: perfil.sugestaoHandle,
                  nomePublico: perfil.sugestaoNome,
                  bio: "",
                  concelho: "",
                  avatarUrl: null,
                  capaUrl: null,
                  perfilPrivado: false,
                }
          }
          modo="boas-vindas"
          onGuardado={() => navigate("/perfil", { replace: true })}
        />
      </div>
    </main>
  );
}
