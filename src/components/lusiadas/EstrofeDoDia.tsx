import { CalendarDays, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGrafia } from "@/lib/grafia/store";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";
import { refDoDia } from "@/lib/lusiadas/plano";

const cantoLoaders = import.meta.glob("../../data/lusiadas/canto*.json");
const ROMANS = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

type Canto = { stanzas: { n: number; lines: string[] }[] };

/** Cartão "Estrofe do dia" — roda por toda a obra, uma estrofe por dia. */
export function EstrofeDoDia() {
  const { convert } = useGrafia();
  const ref = useMemo(() => refDoDia(), []);
  const [lines, setLines] = useState<string[] | null>(null);

  useEffect(() => {
    let alive = true;
    const loader = cantoLoaders[`../../data/lusiadas/canto${ref.canto}.json`];
    (loader ? loader() : Promise.resolve(null)).then((mod) => {
      if (!alive) {
        return;
      }
      const canto = (mod as { default: Canto } | null)?.default;
      const st = canto?.stanzas.find((s) => s.n === ref.stanza);
      setLines(st?.lines ?? []);
    });
    return () => {
      alive = false;
    };
  }, [ref.canto, ref.stanza]);

  const base = lusiadasBase();
  const href = `${cantoHref(base, ref.canto)}#estrofe-${ref.stanza}`;

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-body text-[11px] text-accent uppercase tracking-[0.2em]">
          <CalendarDays className="h-3.5 w-3.5" /> Estrofe do dia
        </p>
        <span className="font-body text-[11px] text-muted-foreground">
          Canto {ROMANS[ref.canto]} · estrofe {ref.stanza}
        </span>
      </div>
      {lines === null ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
        </div>
      ) : (
        <div className="mt-3 font-body text-[16px] text-foreground/85 leading-[1.8]">
          {lines.map((line, i) => (
            <p key={i}>{convert(line)}</p>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <Link
          className="font-body text-[13px] text-accent transition-all hover:gap-2.5"
          to={href}
        >
          Ler na obra →
        </Link>
        <Link
          className="font-body text-[13px] text-muted-foreground hover:text-accent"
          to={`${base || ""}/plano`}
        >
          Plano de 30 dias →
        </Link>
      </div>
    </div>
  );
}
