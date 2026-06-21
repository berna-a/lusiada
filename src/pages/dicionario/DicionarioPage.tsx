import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Input } from "@/components/ui/input";
import type { DicEntry } from "@/lib/grafia/dicionario";

export default function DicionarioPage() {
  const [entries, setEntries] = useState<DicEntry[] | undefined>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    import("@/lib/grafia/dicionario").then((m) => {
      if (!alive) {
        return;
      }
      const featured = m.COMMON_WORDS.map((w) => m.getEntry(w)).filter(
        (e): e is DicEntry => e !== null
      );
      setEntries(featured);
    });
    return () => {
      alive = false;
    };
  }, []);

  const shown = useMemo(() => {
    if (!entries) {
      return [];
    }
    const q = query.trim().toLowerCase();
    if (!q) {
      return entries;
    }
    return entries.filter(
      (e) => e.ao.toLowerCase().includes(q) || e.pre.toLowerCase().includes(q)
    );
  }, [entries, query]);

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Ação ou acção? O dicionário da Lusopédia mostra como cada palavra se escreve no Acordo Ortográfico de 1990, na ortografia anterior, e em Portuguez — a grafia da Lusíada."
        path="/dicionario"
        title="Dicionário de grafias — ação ou acção? | Lusopédia"
      />
      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Lusopédia
        </p>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1] sm:text-[52px]">
          Dicionário de grafias
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-[16px] text-foreground/65 leading-relaxed">
          Ação ou acção? Objetivo ou objectivo? Veja como cada palavra se escreve
          nas três grafias — incluindo o <strong>Portuguez</strong>, a grafia da
          Lusíada.
        </p>
      </header>

      <div className="relative mt-8">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Procurar palavra (ex.: ação)…"
          value={query}
        />
      </div>

      <div className="mt-8">
        {entries === undefined && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        )}
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {shown.map((e) => (
            <li key={e.slug}>
              <Link
                className="block rounded-xl border border-border bg-card px-4 py-3 font-body text-[15px] text-foreground/85 transition-colors hover:border-accent/40 hover:text-accent"
                to={`/dicionario/${e.slug}`}
              >
                «{e.ao}» ou «{e.pre}»?
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
