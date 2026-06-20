import { useQuery } from "convex/react";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { DiscussionFeed } from "@/components/arca/lusopedia/DiscussionFeed";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

export default function ArtigoPage() {
  const { slug } = useParams();
  const article = useQuery(api.articles.getBySlug, slug ? { slug } : "skip");

  if (article === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (article === null) {
    return (
      <main
        className="mx-auto max-w-[760px] px-6 pt-40 pb-32 text-center"
        data-nav-theme="light"
      >
        <h1 className="font-display text-[32px] text-primary">
          Artigo não encontrado
        </h1>
        <p className="mt-4 font-body text-foreground/70 leading-relaxed">
          Este artigo não existe ou ainda não foi publicado.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 font-body text-accent transition-all hover:gap-3"
          to="/arca/lusopedia"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar à Lusopédia
        </Link>
      </main>
    );
  }

  const infobox = article.infobox ?? [];
  const sources = article.sources ?? [];
  const tags = article.tags ?? [];

  const path = `/arca/lusopedia/${article.slug}`;
  const itemUrl = `https://www.alusiada.pt${path}`;
  const publishedAt = new Date(article._creationTime).toISOString();
  const articleLd = {
    "@type": "Article",
    headline: article.title,
    description: article.summary ?? undefined,
    inLanguage: "pt-PT",
    datePublished: publishedAt,
    dateModified: publishedAt,
    articleSection: article.category,
    keywords: tags.join(", ") || undefined,
    image: article.coverUrl ?? undefined,
    author: { "@type": "Organization", name: "Associação Memória Lusíada" },
    publisher: { "@type": "Organization", name: "Associação Memória Lusíada" },
    mainEntityOfPage: itemUrl,
  };
  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Arca", item: "https://www.alusiada.pt/arca" },
      { "@type": "ListItem", position: 2, name: "Lusopédia", item: "https://www.alusiada.pt/arca/lusopedia" },
      { "@type": "ListItem", position: 3, name: article.title, item: itemUrl },
    ],
  };

  return (
    <main
      className="mx-auto max-w-5xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description={article.summary}
        image={article.coverUrl}
        jsonLd={[articleLd, breadcrumbLd]}
        path={path}
        title={`${article.title} — Lusopédia`}
        type="article"
      />
      {article.status !== "published" && (
        <meta content="noindex" name="robots" />
      )}
      <div className="flex items-center justify-between">
        <Link
          className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
          to="/arca/lusopedia"
        >
          <ArrowLeft className="h-4 w-4" /> Lusopédia
        </Link>
        <Button asChild size="sm" variant="outline">
          <Link to={`/arca/lusopedia/${article.slug}/editar`}>
            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Propor edição
          </Link>
        </Button>
      </div>

      {article.status !== "published" && (
        <p className="mt-4 inline-block rounded-full border border-accent/40 px-3 py-1 font-body text-[12px] text-accent">
          Pendente de aprovação
        </p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Corpo */}
        <article>
          <p className="font-body text-[12px] text-accent uppercase tracking-[0.25em]">
            {article.category}
          </p>
          <h1 className="mt-2 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
            {article.title}
          </h1>
          {article.summary && (
            <p className="mt-4 font-display text-[19px] text-foreground/70 italic leading-relaxed">
              {article.summary}
            </p>
          )}
          <div className="mt-8 h-px w-16 bg-accent/40" />
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: conteúdo moderado (aprovado por admin) e gerado pelo editor com esquema controlado */}
          <div
            className="prose prose-stone mt-8 max-w-none font-body text-foreground/85"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {sources.length > 0 && (
            <section className="mt-12">
              <h2 className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
                Fontes
              </h2>
              <ul className="mt-3 space-y-1.5">
                {sources.map((s, i) => (
                  <li
                    className="font-body text-[14px] text-foreground/75"
                    key={i}
                  >
                    {s.url ? (
                      <a
                        className="text-accent hover:underline"
                        href={s.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {s.label}
                      </a>
                    ) : (
                      s.label
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  className="rounded-full bg-muted px-3 py-1 font-body text-[12px] text-muted-foreground"
                  key={t}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Ficha lateral */}
        {(article.coverUrl || infobox.length > 0) && (
          <aside className="lg:pt-2">
            <div className="rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-28">
              {article.coverUrl && (
                <img
                  alt={article.title}
                  className="mb-4 w-full rounded-xl object-cover"
                  src={article.coverUrl}
                />
              )}
              {infobox.length > 0 && (
                <dl className="space-y-2.5">
                  {infobox.map((row, i) => (
                    <div key={i}>
                      <dt className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
                        {row.label}
                      </dt>
                      <dd className="font-body text-[15px] text-foreground/85">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {article.pantheon_slug && (
                <Link
                  className="mt-4 inline-flex font-body text-[13px] text-accent hover:underline"
                  to={`/arca/herois/${article.pantheon_slug}`}
                >
                  Ver no Panteão →
                </Link>
              )}
            </div>
          </aside>
        )}
      </div>

      <DiscussionFeed articleId={article._id} />
    </main>
  );
}
