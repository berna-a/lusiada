import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../../../convex/_generated/api";

/** Sugere até 3 artigos da mesma categoria, dando prioridade a tags em comum. */
export function RelatedArticles({
  category,
  currentSlug,
  tags,
}: {
  category: string;
  currentSlug: string;
  tags: string[];
}) {
  const articles = useQuery(api.articles.list, {});
  if (!articles) {
    return null;
  }
  const tagSet = new Set(tags);
  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => {
      const shared = (a.tags ?? []).filter((t) => tagSet.has(t)).length;
      const sameCategory = a.category === category ? 1 : 0;
      return { a, score: shared * 10 + sameCategory };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((x) => x.a);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-border/60 border-t pt-12">
      <h2 className="font-display text-[24px] text-primary">
        Artigos relacionados
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {related.map((a) => (
          <Link
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30"
            key={a._id}
            to={`/arca/lusopedia/${a.slug}`}
          >
            <span className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
              {a.category}
            </span>
            <h3 className="mt-1.5 font-display text-[18px] text-primary">
              {a.title}
            </h3>
            {a.summary && (
              <p className="mt-2 line-clamp-2 font-body text-[13px] text-muted-foreground leading-relaxed">
                {a.summary}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
