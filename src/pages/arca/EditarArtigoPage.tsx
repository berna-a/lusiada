import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArticleForm,
  type ArticleFormData,
} from "@/components/arca/lusopedia/ArticleForm";
import { api } from "../../../convex/_generated/api";

export default function EditarArtigoPage() {
  const { slug } = useParams();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const article = useQuery(api.articles.getBySlug, slug ? { slug } : "skip");
  const proposeEdit = useMutation(api.articles.proposeEdit);
  const navigate = useNavigate();

  if (isLoading || article === undefined) {
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
        <h1 className="font-display text-3xl text-primary">Propor edição</h1>
        <p className="mt-4 font-body text-foreground/70">
          Inicie sessão para propor uma edição.
        </p>
      </main>
    );
  }

  if (article === null) {
    return (
      <main
        className="mx-auto max-w-md px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <h1 className="font-display text-3xl text-primary">
          Artigo não encontrado
        </h1>
      </main>
    );
  }

  const onSubmit = async (data: ArticleFormData) => {
    await proposeEdit({ articleId: article._id, ...data });
    navigate(`/arca/lusopedia/${article.slug}?edicao=enviada`);
  };

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Link
        className="font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] hover:text-accent"
        to={`/arca/lusopedia/${article.slug}`}
      >
        ← {article.title}
      </Link>
      <h1 className="mt-6 mb-2 font-display text-[36px] text-primary">
        Propor edição
      </h1>
      <p className="mb-8 font-body text-muted-foreground text-sm leading-relaxed">
        A sua proposta fica pendente até a Direcção a rever e aplicar.
      </p>
      <ArticleForm
        initial={{
          title: article.title,
          category: article.category,
          tags: article.tags ?? [],
          summary: article.summary,
          body: article.body,
          coverUrl: article.coverUrl,
          infobox: article.infobox ?? [],
          sources: article.sources ?? [],
        }}
        onSubmit={onSubmit}
        submitLabel="Enviar proposta de edição"
      />
    </main>
  );
}
