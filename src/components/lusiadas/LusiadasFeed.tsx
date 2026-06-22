import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ChevronUp, Flag, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type FeedTarget = {
  target: string;
  canto: number;
  label: string;
  excerpt?: string;
};

/** Painel (drawer) com o feed de anotações de uma unidade da obra. */
export function LusiadasFeed({
  target,
  canto,
  label,
  excerpt,
  onClose,
}: FeedTarget & { onClose: () => void }) {
  const posts = useQuery(api.lusiadas.listByTarget, { target });
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const addPost = useMutation(api.lusiadas.addPost);
  const toggleUpvote = useMutation(api.lusiadas.toggleUpvote);
  const removeOwn = useMutation(api.lusiadas.removeOwn);
  const report = useMutation(api.lusiadas.report);

  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (body.trim().length < 2) {
      return;
    }
    setSending(true);
    try {
      await addPost({ target, canto, body: body.trim(), excerpt });
      setBody("");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Fundo (mobile) */}
      <button
        aria-label="Fechar"
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={onClose}
        type="button"
      />
      <aside
        className="fixed top-0 right-0 z-50 flex h-full w-full max-w-[420px] flex-col border-border border-l bg-background shadow-xl"
        data-nav-theme="light"
      >
        <header className="flex items-start justify-between gap-3 border-border/60 border-b px-5 py-4">
          <div>
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.18em]">
              Anotações
            </p>
            <p className="mt-1 font-display text-[18px] text-primary">{label}</p>
            {excerpt && (
              <p className="mt-1 max-w-[320px] font-body text-[13px] text-muted-foreground italic">
                «{excerpt}»
              </p>
            )}
          </div>
          <button
            aria-label="Fechar"
            className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {posts === undefined && (
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          )}
          {posts?.length === 0 && (
            <p className="py-2 font-body text-[14px] text-muted-foreground italic leading-relaxed">
              Ainda não há anotações. Sê o primeiro a interpretar esta passagem.
            </p>
          )}
          <ul className="space-y-4">
            {posts?.map((p) => (
              <li className="flex gap-3" key={p._id}>
                <div className="flex flex-col items-center pt-0.5">
                  <button
                    aria-label="Votar"
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
                <div className="flex-1 rounded-xl border border-border/60 bg-card/60 p-3">
                  <p className="whitespace-pre-line font-body text-[14px] text-foreground/85 leading-relaxed">
                    {p.body}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.1em]">
                      {p.authorName ?? "Anónimo"} · {formatDate(p.createdAt)}
                    </span>
                    {p.isMine ? (
                      <button
                        className="inline-flex items-center gap-1 font-body text-[11px] text-muted-foreground hover:text-destructive"
                        onClick={() => removeOwn({ postId: p._id })}
                        type="button"
                      >
                        <Trash2 className="h-3 w-3" /> Remover
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center gap-1 font-body text-[11px] text-muted-foreground hover:text-foreground"
                        onClick={() => report({ postId: p._id })}
                        type="button"
                      >
                        <Flag className="h-3 w-3" /> Denunciar
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-border/60 border-t px-5 py-4">
          {isAuthenticated ? (
            <>
              <textarea
                className="min-h-[72px] w-full resize-y rounded-lg border border-border bg-card px-3 py-2 font-body text-[14px] outline-none focus:border-accent/60"
                maxLength={5000}
                onChange={(e) => setBody(e.target.value)}
                placeholder="A tua interpretação, comentário ou pergunta…"
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
                    "Anotar"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-border border-dashed bg-card/40 p-4 text-center">
              <p className="font-body text-[13px] text-foreground/70">
                Entra para anotar e votar.
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
      </aside>
    </>
  );
}
