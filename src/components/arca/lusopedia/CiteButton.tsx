import { Check, Copy, Quote } from "lucide-react";
import { useState } from "react";

function today() {
  return new Date().toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Permite citar o artigo (formato académico) e copiar para a área de transferência. */
export function CiteButton({
  title,
  url,
  year,
}: {
  title: string;
  url: string;
  year: number;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const citation = `Associação Memória Lusíada (${year}). «${title}». Lusopédia. Consultado a ${today()}, em ${url}`;

  const copy = async () => {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        className="inline-flex items-center gap-1 font-body text-[13px] text-accent transition-colors hover:underline"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <Quote className="h-3.5 w-3.5" /> Citar
      </button>
      {open && (
        <div className="w-full rounded-xl border border-border bg-muted/40 p-3">
          <p className="font-body text-[13px] text-foreground/80 leading-relaxed">
            {citation}
          </p>
          <button
            className="mt-2 inline-flex items-center gap-1 font-body text-[12px] text-accent transition-colors hover:underline"
            onClick={copy}
            type="button"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copiado
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copiar citação
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
