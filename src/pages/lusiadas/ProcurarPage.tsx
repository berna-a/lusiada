import { ArrowLeft, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { useGrafia } from "@/lib/grafia/store";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";

const cantoLoaders = import.meta.glob("../../data/lusiadas/canto*.json");
const ROMANS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

type Verso = { canto: number; stanza: number; verse: number; line: string };
type Canto = { canto: number; stanzas: { n: number; lines: string[] }[] };

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase();
}

/** Realça (sem distinção de acentos) a primeira ocorrência da query na linha. */
function highlight(line: string, q: string) {
  if (!q) {
    return line;
  }
  const nl = norm(line);
  const nq = norm(q);
  const i = nl.indexOf(nq);
  if (i < 0) {
    return line;
  }
  return (
    <>
      {line.slice(0, i)}
      <mark className="rounded bg-accent/20 text-foreground">
        {line.slice(i, i + q.length)}
      </mark>
      {line.slice(i + q.length)}
    </>
  );
}

export default function ProcurarPage() {
  const base = useMemo(lusiadasBase, []);
  const { convert } = useGrafia();
  const [versos, setVersos] = useState<Verso[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all(Object.values(cantoLoaders).map((l) => l())).then((mods) => {
      if (!alive) {
        return;
      }
      const all: Verso[] = [];
      for (const m of mods) {
        const c = (m as { default: Canto }).default;
        for (const s of c.stanzas) {
          s.lines.forEach((line, i) => {
            all.push({ canto: c.canto, stanza: s.n, verse: i + 1, line });
          });
        }
      }
      all.sort((a, b) => a.canto - b.canto || a.stanza - b.stanza || a.verse - b.verse);
      setVersos(all);
    });
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!versos || q.length < 2) {
      return [];
    }
    const nq = norm(q);
    const out: Verso[] = [];
    for (const v of versos) {
      if (norm(v.line).includes(nq)) {
        out.push(v);
      }
      if (out.length >= 80) {
        break;
      }
    }
    return out;
  }, [versos, query]);

  return (
    <main
      className="mx-auto max-w-2xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Procura qualquer verso, palavra ou expressão em Os Lusíadas de Camões — os 1102 versos da epopeia, pesquisáveis."
        path="/os-lusiadas/procurar"
        title="Procurar — Os Lusíadas | Camões"
      />

      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to={base || "/"}
      >
        <ArrowLeft className="h-4 w-4" /> Os Lusíadas
      </Link>

      <h1 className="mt-6 text-center font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
        Procurar
      </h1>
      <p className="mt-2 text-center font-body text-[14px] text-muted-foreground">
        Pesquisa em toda a obra — verso, palavra ou expressão.
      </p>

      <div className="relative mt-7">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        {/* biome-ignore lint/a11y/noAutofocus: a pesquisa é o propósito da página */}
        <input
          autoFocus
          className="h-12 w-full rounded-xl border border-border bg-card pr-4 pl-12 font-body text-[16px] text-foreground outline-none transition-colors focus:border-accent/50"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex.: «mar», «Adamastor», «as armas»…"
          value={query}
        />
      </div>

      <div className="mt-6">
        {versos === null && query.trim().length >= 2 && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          </div>
        )}
        {query.trim().length >= 2 && versos !== null && (
          <p className="mb-3 font-body text-[12px] text-muted-foreground uppercase tracking-[0.15em]">
            {results.length === 80 ? "80+ resultados" : `${results.length} resultado(s)`}
          </p>
        )}
        <ul className="space-y-1">
          {results.map((v) => (
            <li key={`${v.canto}-${v.stanza}-${v.verse}`}>
              <Link
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/[0.05]"
                to={`${cantoHref(base, v.canto)}#estrofe-${v.stanza}`}
              >
                <span className="font-body text-[16px] text-foreground/90 leading-relaxed">
                  {highlight(convert(v.line), query.trim())}
                </span>
                <span className="mt-0.5 block font-body text-[12px] text-muted-foreground">
                  Canto {ROMANS[v.canto]} · estrofe {v.stanza} · verso {v.verse}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {query.trim().length >= 2 && versos !== null && results.length === 0 && (
          <p className="py-8 text-center font-body text-[14px] text-muted-foreground italic">
            Nada encontrado para «{query.trim()}».
          </p>
        )}
      </div>
    </main>
  );
}
