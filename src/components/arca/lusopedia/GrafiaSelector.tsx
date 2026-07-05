import type { Grafia } from "@/lib/grafia/lexicon";
import { useGrafia } from "@/lib/grafia/store";

const OPTIONS: { g: Grafia; label: string; title: string }[] = [
  { g: "pz", label: "Portuguez", title: "A grafia da Lusíada (com z)" },
  { g: "ao", label: "AO 1990", title: "Acordo Ortográfico de 1990" },
  { g: "pre", label: "Pré-acordo", title: "Ortografia anterior ao Acordo" },
];

/**
 * Seletor da grafia de leitura. O conteúdo é escrito em Portuguez (canónico) e
 * convertido no ecrã para a grafia escolhida — declaração de intenção, não erro.
 */
export function GrafiaSelector() {
  const { grafia, setGrafia } = useGrafia();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="inline-flex w-fit rounded-full border border-border bg-card p-0.5">
        {OPTIONS.map((o) => (
          <button
            className={`rounded-full px-3 py-1 font-body text-[12px] transition-colors ${
              grafia === o.g
                ? "bg-accent/15 text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
            key={o.g}
            onClick={() => setGrafia(o.g)}
            title={o.title}
            type="button"
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="font-body text-[11px] text-muted-foreground/80">
        Esta enciclopédia escreve-se em <strong>Portuguez</strong> — a grafia da
        Lusíada. Escolha a grafia de leitura.
      </p>
    </div>
  );
}
