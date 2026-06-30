import { useQuery } from "convex/react";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { buildArticleContent } from "@/components/arca/lusopedia/articleContent";
import { CiteButton } from "@/components/arca/lusopedia/CiteButton";
import { DiscussionFeed } from "@/components/arca/lusopedia/DiscussionFeed";
import { GrafiaSelector } from "@/components/arca/lusopedia/GrafiaSelector";
import { RelatedArticles } from "@/components/arca/lusopedia/RelatedArticles";
import { TableOfContents } from "@/components/arca/lusopedia/TableOfContents";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { autolinkDicionario } from "@/lib/grafia/autolink";
import { useGrafia } from "@/lib/grafia/store";
import { api } from "../../../convex/_generated/api";

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArtigoPage() {
  const { slug } = useParams();
  const article = useQuery(api.articles.getBySlug, slug ? { slug } : "skip");
  const { convert, grafia, ready } = useGrafia();
  const content = useMemo(
    () => buildArticleContent(autolinkDicionario(convert(article?.body ?? ""))),
    [article?.body, grafia, ready]
  );

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
  const aliases = article.aliases ?? [];

  const path = `/arca/lusopedia/${article.slug}`;
  const itemUrl = `https://www.alusiada.pt${path}`;
  const publishedAt = new Date(article._creationTime).toISOString();
  const articleLd = {
    "@type": "Article",
    headline: article.title,
    alternateName: aliases.length > 0 ? aliases : undefined,
    description: article.summary ?? undefined,
    inLanguage: "pt-PT",
    datePublished: publishedAt,
    dateModified: publishedAt,
    articleSection: article.category,
    keywords: [...tags, ...aliases].join(", ") || undefined,
    image: article.coverUrl ?? undefined,
    author: { "@type": "Organization", name: "Associação Memória Lusíada" },
    publisher: { "@type": "Organization", name: "Associação Memória Lusíada" },
    mainEntityOfPage: itemUrl,
  };
  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Arca",
        item: "https://www.alusiada.pt/arca",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Lusopédia",
        item: "https://www.alusiada.pt/arca/lusopedia",
      },
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

      <div className="mt-6">
        <GrafiaSelector />
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Corpo */}
        <article>
          <p className="font-body text-[12px] text-accent uppercase tracking-[0.25em]">
            {article.category}
          </p>
          <h1 className="mt-2 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
            {convert(article.title)}
          </h1>
          {article.summary && (
            <p className="mt-4 font-display text-[19px] text-foreground/70 italic leading-relaxed">
              {convert(article.summary)}
            </p>
          )}
          {grafia === "pz" && aliases.length > 0 && (
            <p className="mt-3 font-body text-[13px] text-muted-foreground">
              Grafia tradicional:{" "}
              <span className="text-foreground/70">{aliases.join(" · ")}</span>
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-body text-[13px] text-muted-foreground">
            <span>
              Por{" "}
              <span className="text-foreground/80">
                Associação Memória Lusíada
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Publicado a {formatDate(article._creationTime)}</span>
            <span aria-hidden="true">·</span>
            <CiteButton
              title={article.title}
              url={itemUrl}
              year={new Date(article._creationTime).getFullYear()}
            />
          </div>
          <div className="mt-8 h-px w-16 bg-accent/40" />
          <div
            className="mt-8 max-w-none font-body text-[17px] text-foreground/85 leading-[1.8] [&_.grafia-termo]:text-foreground/80 [&_.grafia-termo]:decoration-muted-foreground/40 [&_.grafia-termo]:decoration-dotted hover:[&_.grafia-termo]:text-accent [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-accent [&_blockquote]:my-7 [&_blockquote]:border-accent/40 [&_blockquote]:border-l-2 [&_blockquote]:pl-5 [&_blockquote]:font-display [&_blockquote]:text-[18px] [&_blockquote]:text-foreground/70 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:text-[23px] [&_h2]:text-primary [&_h2]:tracking-[0.06em] [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-28 [&_h3]:text-[19px] [&_h3]:text-primary [&_li]:my-1 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: content.html }}
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

          {/* Nota de curadoria — sinal de autoridade (E-E-A-T) + convite à comunidade */}
          <aside className="mt-12 rounded-2xl border border-border bg-muted/30 p-5">
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
              Sobre este verbete
            </p>
            <p className="mt-2 font-body text-[14px] text-foreground/75 leading-relaxed">
              Verbete curado e revisto pela{" "}
              <span className="text-foreground/90">
                Associação Memória Lusíada
              </span>
              . A Lusopédia é uma enciclopédia viva: cada verbete melhora com o
              saber da comunidade.
            </p>
            <p className="mt-2 font-body text-[13px] text-muted-foreground">
              Encontrou um erro ou tem algo a acrescentar?{" "}
              <Link
                className="text-accent hover:underline"
                to={`/arca/lusopedia/${article.slug}/editar`}
              >
                Proponha uma edição
              </Link>{" "}
              ou junte-se à discussão abaixo.
            </p>
          </aside>
        </article>

        {/* Coluna lateral: índice + ficha */}
        {(content.toc.length >= 2 ||
          article.coverUrl ||
          infobox.length > 0 ||
          article.pantheon_slug) && (
          <aside className="lg:pt-2">
            <div className="space-y-4 lg:sticky lg:top-28">
              {content.toc.length >= 2 && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <TableOfContents items={content.toc} />
                </div>
              )}
              {(article.coverUrl ||
                infobox.length > 0 ||
                article.pantheon_slug) && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  {article.coverUrl && (
                    <figure className="mb-4">
                      <img
                        alt={article.title}
                        className="w-full rounded-xl object-cover"
                        src={article.coverUrl}
                      />
                      {article.image_credit && (
                        <figcaption className="mt-1.5 font-body text-[10px] text-muted-foreground/70">
                          Imagem: {article.image_credit}
                        </figcaption>
                      )}
                    </figure>
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
              )}
            </div>
          </aside>
        )}
      </div>

      <RelatedArticles
        category={article.category}
        currentSlug={article.slug}
        tags={tags}
      />

      <DiscussionFeed articleId={article._id} />
    </main>
  );
}
