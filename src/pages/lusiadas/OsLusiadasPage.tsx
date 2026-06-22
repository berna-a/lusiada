import { BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import canto1 from "@/data/lusiadas/canto1.json";
import anotacoesData from "@/data/lusiadas/anotacoes.json";

const anotacoes: Record<string, string> = anotacoesData;

export default function OsLusiadasPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedNote = selected ? anotacoes[String(selected)] : null;

  return (
    <main
      className="mx-auto max-w-5xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Os Lusíadas de Luiz Vaz de Camões, anotados verso a verso. A epopeia da nação portugueza na grafia tradicional, com explicações de mitologia, história e vocabulário."
        path="/os-lusiadas"
        title="Os Lusíadas — Canto I, anotado | Camões"
        type="article"
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Luiz Vaz de Camões
        </p>
        <h1 className="mt-3 font-display text-[48px] text-primary leading-[1] sm:text-[64px]">
          Os Lusíadas
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-[16px] text-foreground/65 leading-relaxed">
          A epopeia da nação portugueza, anotada verso a verso. Texto na grafia
          tradicional (pré-acordo); as três grafias chegam em breve.
        </p>
        <Link
          className="mt-4 inline-flex items-center gap-1.5 font-body text-[14px] text-accent transition-all hover:gap-2.5"
          to="/arca/lusopedia/os-lusiadas"
        >
          <BookOpen className="h-4 w-4" /> Sobre a obra, na Lusopédia →
        </Link>
      </header>

      <div className="mt-12 border-border/60 border-t pt-8">
        <h2 className="text-center font-display text-[28px] text-primary">
          {canto1.titulo}
        </h2>
        <p className="mt-3 flex items-center justify-center gap-1.5 font-body text-[12px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" /> As estrofes
          assinaladas têm anotação — clique para a ler.
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        {/* Estrofes */}
        <div className="space-y-2">
          {canto1.stanzas.map((s) => {
            const note = anotacoes[String(s.n)];
            const isSel = selected === s.n;
            return (
              <div key={s.n}>
                <button
                  className={`flex w-full gap-4 rounded-xl border px-4 py-3 text-left transition-colors ${
                    note
                      ? "cursor-pointer border-transparent hover:border-accent/30 hover:bg-accent/5"
                      : "cursor-default border-transparent"
                  } ${isSel ? "border-accent/40 bg-accent/10" : ""}`}
                  onClick={note ? () => setSelected(isSel ? null : s.n) : undefined}
                  type="button"
                >
                  <span
                    className={`shrink-0 pt-0.5 font-display text-[14px] ${
                      note ? "text-accent" : "text-muted-foreground/50"
                    }`}
                  >
                    {s.n}
                    {note && <Sparkles className="mt-1 h-3 w-3" />}
                  </span>
                  <div className="font-body text-[17px] text-foreground/90 leading-[1.85]">
                    {s.lines.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </button>
                {note && isSel && (
                  <div className="mt-1 rounded-xl border border-border bg-card p-4 lg:hidden">
                    {/* biome-ignore lint/security/noDangerouslySetInnerHtml: anotação editorial nossa */}
                    <div
                      className="font-body text-[14px] text-foreground/80 leading-relaxed [&_a]:text-accent [&_a]:underline [&_strong]:text-foreground"
                      dangerouslySetInnerHTML={{ __html: note }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Painel de anotação (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-border bg-card p-5">
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
              Anotação
            </p>
            {selectedNote ? (
              <>
                <p className="mt-2 font-display text-[18px] text-primary">
                  Estrofe {selected}
                </p>
                {/* biome-ignore lint/security/noDangerouslySetInnerHtml: anotação editorial nossa */}
                <div
                  className="mt-2 font-body text-[14px] text-foreground/80 leading-relaxed [&_a]:text-accent [&_a]:underline [&_em]:italic [&_strong]:text-foreground"
                  dangerouslySetInnerHTML={{ __html: selectedNote }}
                />
              </>
            ) : (
              <p className="mt-3 font-body text-[14px] text-muted-foreground italic leading-relaxed">
                Clique numa estrofe assinalada (✦) para ler a anotação —
                mitologia, história e vocabulário, verso a verso.
              </p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
