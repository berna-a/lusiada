import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Check, ChevronUp, Flag, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DiscussionFeed({ articleId }: { articleId: Id<"articles"> }) {
  const posts = useQuery(api.discussion.listPosts, { articleId });
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const addPost = useMutation(api.discussion.addPost);
  const toggleUpvote = useMutation(api.discussion.toggleUpvote);
  const removeOwn = useMutation(api.discussion.removeOwn);
  const report = useMutation(api.discussion.report);
  const promote = useMutation(api.discussion.promoteToArticle);
  const me = useQuery(api.admin.me);

  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (body.trim().length < 2) {
      return;
    }
    setSending(true);
    try {
      await addPost({ articleId, body: body.trim() });
      setBody("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-16 border-border/60 border-t pt-12">
      <header>
        <h2 className="font-display text-[24px] text-primary">Discussão</h2>
        <p className="mt-1 font-body text-[14px] text-muted-foreground leading-relaxed">
          Debata o tema e contribua. Os contributos mais votados sobem ao topo e
          ajudam a definir o conteúdo.
        </p>
      </header>

      <div className="mt-6">
        {isAuthenticated ? (
          <div className="rounded-2xl border border-border bg-card p-4">
            <textarea
              className="min-h-[80px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-body text-[15px] outline-none focus:border-accent/60"
              maxLength={5000}
              onChange={(e) => setBody(e.target.value)}
              placeholder="O seu contributo para este tema…"
              value={body}
            />
            <div className="mt-2 flex justify-end">
              <Button
                disabled={sending || body.trim().length < 2}
                onClick={submit}
                size="sm"
                variant="accent"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Publicar"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border border-dashed bg-card/40 p-5 text-center">
            <p className="font-body text-[14px] text-foreground/70">
              Inicie sessão para participar na discussão.
            </p>
            <Button
              className="mt-3"
              onClick={() =>
                signIn("google", { redirectTo: window.location.pathname })
              }
              size="sm"
              variant="accent"
            >
              Entrar com Google
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        {posts === undefined && (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        )}
        {posts?.length === 0 && (
          <p className="py-4 font-body text-[15px] text-muted-foreground italic">
            Ainda não há contributos. Seja o primeiro a opinar.
          </p>
        )}
        <ul className="space-y-4">
          {posts?.map((p) => (
            <li className="flex gap-3" key={p._id}>
              <div className="flex flex-col items-center pt-1">
                <button
                  aria-label="Gosto"
                  className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
                    p.hasUpvoted
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/50 hover:text-accent"
                  }`}
                  onClick={() => toggleUpvote({ postId: p._id })}
                  type="button"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <span className="mt-1 font-body text-[13px] text-foreground/70">
                  {p.upvotes}
                </span>
              </div>
              <div className="flex-1 rounded-2xl border border-border/60 bg-card/60 p-4">
                <p className="whitespace-pre-line font-body text-[15px] text-foreground/85 leading-relaxed">
                  {p.body}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-body text-[12px] text-muted-foreground uppercase tracking-[0.12em]">
                    <span>
                      {p.authorName ?? "Anónimo"} · {formatDate(p.createdAt)}
                    </span>
                    {p.isPromoted && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 px-2 py-0.5 text-[10px] text-accent tracking-[0.1em]">
                        <Check className="h-3 w-3" /> No artigo
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    {me?.isAdmin && !p.isPromoted && (
                      <button
                        className="inline-flex items-center gap-1 font-body text-[12px] text-accent hover:underline"
                        onClick={() => promote({ postId: p._id })}
                        type="button"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Promover ao artigo
                      </button>
                    )}
                    {p.isMine ? (
                      <button
                        className="inline-flex items-center gap-1 font-body text-[12px] text-muted-foreground hover:text-destructive"
                        onClick={() => removeOwn({ postId: p._id })}
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remover
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center gap-1 font-body text-[12px] text-muted-foreground hover:text-foreground"
                        onClick={() => report({ postId: p._id })}
                        type="button"
                      >
                        <Flag className="h-3.5 w-3.5" /> Denunciar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
