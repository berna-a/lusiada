import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ImagePlus, Loader2, Quote, Send, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type CommunityFeedProps = {
  figureId: Id<"figures">;
  figureName: string;
};

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CommunityFeed({ figureId, figureName }: CommunityFeedProps) {
  const memories = useQuery(api.contributions.listApproved, { figureId });
  const { isAuthenticated } = useConvexAuth();

  return (
    <section className="mt-20 border-border/60 border-t pt-14">
      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Arca viva
        </p>
        <h2 className="mt-3 font-display text-[28px] text-primary sm:text-[34px]">
          Memórias da Comunidade
        </h2>
        <p className="mx-auto mt-3 max-w-md font-body text-[15px] text-foreground/65 leading-relaxed">
          Poemas, recordações e tributos partilhados por quem mantém viva a
          memória de {figureName}.
        </p>
      </header>

      <div className="mt-10">
        {isAuthenticated ? <SubmitForm figureId={figureId} /> : <LoginPrompt />}
      </div>

      <div className="mt-12">
        {memories === undefined && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          </div>
        )}

        {memories?.length === 0 && (
          <p className="py-6 text-center font-body text-[15px] text-muted-foreground italic">
            Ainda não há memórias partilhadas. Seja o primeiro a deixar a sua.
          </p>
        )}

        <ul className="space-y-6">
          {memories?.map((m) => (
            <li
              className="rounded-2xl border border-border/60 bg-card/60 p-6"
              key={m._id}
            >
              <Quote className="h-5 w-5 text-accent/40" />
              <p className="mt-3 whitespace-pre-line font-body text-[16px] text-foreground/85 leading-relaxed">
                {m.body}
              </p>
              {m.imageUrl && (
                <img
                  alt="Memória partilhada"
                  className="mt-4 max-h-[420px] w-full rounded-xl object-cover"
                  src={m.imageUrl}
                />
              )}
              <p className="mt-4 font-body text-[12px] text-muted-foreground uppercase tracking-[0.15em]">
                {m.authorName ?? "Anónimo"} · {formatDate(m.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function LoginPrompt() {
  const { signIn } = useAuthActions();
  return (
    <div className="rounded-2xl border border-border/60 border-dashed bg-card/40 p-8 text-center">
      <p className="font-body text-[15px] text-foreground/70 leading-relaxed">
        Inicie sessão para partilhar a sua memória ou tributo.
      </p>
      <Button
        className="mt-5"
        onClick={() =>
          signIn("google", { redirectTo: window.location.pathname })
        }
        variant="accent"
      >
        Entrar com Google
      </Button>
    </div>
  );
}

async function uploadImage(
  generateUrl: () => Promise<string>,
  file: File
): Promise<Id<"_storage">> {
  const url = await generateUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error("Falha no envio da imagem.");
  }
  const { storageId } = await res.json();
  return storageId;
}

function SubmitForm({ figureId }: { figureId: Id<"figures"> }) {
  const generateUploadUrl = useMutation(api.contributions.generateUploadUrl);
  const submit = useMutation(api.contributions.submit);

  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const send = async () => {
    setError(null);
    if (body.trim().length < 2) {
      setError("Escreva a sua memória.");
      return;
    }
    setSubmitting(true);
    try {
      const imageId = file
        ? await uploadImage(generateUploadUrl, file)
        : undefined;
      await submit({ figureId, body: body.trim(), imageId });
      setBody("");
      setFile(null);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-6 text-center">
        <p className="font-display text-[18px] text-primary">Obrigado! 🌿</p>
        <p className="mt-2 font-body text-[14px] text-foreground/70 leading-relaxed">
          A sua memória foi enviada e será publicada após revisão.
        </p>
        <Button
          className="mt-4"
          onClick={() => setDone(false)}
          variant="outline"
        >
          Partilhar outra
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-6">
      <label
        className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]"
        htmlFor="memory-body"
      >
        Deixe a sua memória
      </label>
      <textarea
        className="mt-3 min-h-[120px] w-full resize-y rounded-xl border border-border bg-background px-4 py-3 font-body text-[15px] text-foreground leading-relaxed outline-none transition-colors focus:border-accent/60"
        id="memory-body"
        maxLength={4000}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Um poema, uma recordação, um tributo…"
        value={body}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 font-body text-[13px] text-foreground/70 transition-colors hover:border-accent/50 hover:text-accent">
          <ImagePlus className="h-4 w-4" />
          {file ? "Trocar imagem" : "Adicionar imagem"}
          <input
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        {file && (
          <span className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground">
            {file.name}
            <button
              aria-label="Remover imagem"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setFile(null)}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 font-body text-[14px] text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <Button disabled={submitting} onClick={send} variant="accent">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar…
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Partilhar memória
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
