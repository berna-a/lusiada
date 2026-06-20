import { useMutation, useQuery } from "convex/react";
import { Check, ExternalLink, Loader2, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

export default function AdminLusopediaPage() {
  const pending = useQuery(api.articles.adminPending);
  const reported = useQuery(api.discussion.adminReported);
  const setArticleStatus = useMutation(api.articles.adminSetArticleStatus);
  const approveEdit = useMutation(api.articles.adminApproveEdit);
  const rejectEdit = useMutation(api.articles.adminRejectEdit);
  const removePost = useMutation(api.discussion.adminRemovePost);
  const keepPost = useMutation(api.discussion.adminKeepPost);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="font-display text-3xl text-primary">Lusópedia</h1>
        <p className="mt-1 font-body text-muted-foreground text-sm">
          Aprove artigos e edições e modere a discussão.
        </p>
      </header>

      {/* Artigos pendentes */}
      <section>
        <h2 className="mb-3 font-body text-muted-foreground text-xs uppercase tracking-[0.2em]">
          Artigos pendentes
        </h2>
        {pending === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : pending.articles.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm italic">
            Nenhum.
          </p>
        ) : (
          <ul className="space-y-3">
            {pending.articles.map((a) => (
              <li
                className="rounded-xl border border-border bg-card p-4"
                key={a._id}
              >
                <div className="flex items-center justify-between gap-2">
                  <Link
                    className="font-display text-foreground hover:text-accent"
                    to={`/arca/lusopedia/${a.slug}`}
                  >
                    {a.title} <ExternalLink className="inline h-3 w-3" />
                  </Link>
                  <span className="font-body text-[11px] text-accent uppercase tracking-[0.15em]">
                    {a.category}
                  </span>
                </div>
                {a.summary && (
                  <p className="mt-1 font-body text-[14px] text-muted-foreground">
                    {a.summary}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() =>
                      setArticleStatus({ id: a._id, status: "published" })
                    }
                    size="sm"
                    variant="accent"
                  >
                    <Check className="mr-1.5 h-3.5 w-3.5" /> Publicar
                  </Button>
                  <Button
                    onClick={() =>
                      setArticleStatus({ id: a._id, status: "rejected" })
                    }
                    size="sm"
                    variant="outline"
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" /> Rejeitar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edições propostas */}
      <section>
        <h2 className="mb-3 font-body text-muted-foreground text-xs uppercase tracking-[0.2em]">
          Edições propostas
        </h2>
        {pending !== undefined && pending.edits.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm italic">
            Nenhuma.
          </p>
        ) : (
          <ul className="space-y-3">
            {pending?.edits.map((e) => (
              <li
                className="rounded-xl border border-border bg-card p-4"
                key={e._id}
              >
                <p className="font-display text-foreground">
                  {e.articleSlug ? (
                    <Link
                      className="hover:text-accent"
                      to={`/arca/lusopedia/${e.articleSlug}`}
                    >
                      {e.articleTitle}
                    </Link>
                  ) : (
                    e.articleTitle
                  )}
                </p>
                {e.note && (
                  <p className="mt-1 font-body text-[14px] text-muted-foreground italic">
                    “{e.note}”
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={() => approveEdit({ revisionId: e._id })}
                    size="sm"
                    variant="accent"
                  >
                    <Check className="mr-1.5 h-3.5 w-3.5" /> Aplicar
                  </Button>
                  <Button
                    onClick={() => rejectEdit({ revisionId: e._id })}
                    size="sm"
                    variant="outline"
                  >
                    <X className="mr-1.5 h-3.5 w-3.5" /> Rejeitar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Contributos denunciados */}
      <section>
        <h2 className="mb-3 font-body text-muted-foreground text-xs uppercase tracking-[0.2em]">
          Contributos denunciados
        </h2>
        {reported === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : reported.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm italic">
            Nenhum.
          </p>
        ) : (
          <ul className="space-y-3">
            {reported.map((p) => (
              <li
                className="rounded-xl border border-destructive/30 bg-card p-4"
                key={p._id}
              >
                <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.15em]">
                  {p.reports} denúncia(s) · {p.authorName ?? "Anónimo"} · em{" "}
                  {p.articleTitle}
                </p>
                <p className="mt-2 whitespace-pre-line font-body text-[14px] text-foreground/85">
                  {p.body}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    className="text-destructive hover:text-destructive"
                    onClick={() => removePost({ postId: p._id })}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remover
                  </Button>
                  <Button
                    onClick={() => keepPost({ postId: p._id })}
                    size="sm"
                    variant="outline"
                  >
                    Manter
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
