import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArticleForm,
  type ArticleFormData,
} from "@/components/arca/lusopedia/ArticleForm";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

export default function NovoArtigoPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const create = useMutation(api.articles.create);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main
        className="mx-auto max-w-md px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <h1 className="font-display text-3xl text-primary">Novo artigo</h1>
        <p className="mt-4 font-body text-foreground/70 leading-relaxed">
          Inicie sessão para escrever um artigo na Lusópedia.
        </p>
        <Button
          className="mt-8"
          onClick={() =>
            signIn("google", { redirectTo: "/arca/lusopedia/novo" })
          }
          variant="accent"
        >
          Entrar com Google
        </Button>
      </main>
    );
  }

  const onSubmit = async (data: ArticleFormData) => {
    const { slug } = await create(data);
    navigate(`/arca/lusopedia/${slug}`);
  };

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Link
        className="font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] hover:text-accent"
        to="/arca/lusopedia"
      >
        ← Lusópedia
      </Link>
      <h1 className="mt-6 mb-2 font-display text-[36px] text-primary">
        Novo artigo
      </h1>
      <p className="mb-8 font-body text-muted-foreground text-sm leading-relaxed">
        O artigo fica pendente até a Direcção o aprovar.
      </p>
      <ArticleForm onSubmit={onSubmit} submitLabel="Submeter artigo" />
    </main>
  );
}
