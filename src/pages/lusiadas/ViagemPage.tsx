import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EPISODES, MapaDaViagem } from "@/components/lusiadas/MapaDaViagem";
import { Seo } from "@/components/Seo";
import { cantoHref as cantoLink, lusiadasBase } from "@/lib/lusiadas/nav";

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

export default function ViagemPage() {
  const base = lusiadasBase();
  const cantoHref = (c: number) => cantoLink(base, c);

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="A viagem de Os Lusíadas — de Lisboa à Índia, episódio a episódio: a partida, o Adamastor no Cabo, Melinde, Calecute e a Ilha dos Amores, ligados aos cantos da epopeia."
        path="/os-lusiadas/viagem"
        title="A Viagem — Os Lusíadas, de Lisboa à Índia | Camões"
        type="article"
      />

      <Link
        className="inline-flex items-center gap-2 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em] transition-colors hover:text-accent"
        to={base || "/"}
      >
        <ArrowLeft className="h-4 w-4" /> Os Lusíadas
      </Link>

      <header className="mt-6 text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          O mapa da epopeia
        </p>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
          A Viagem
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-[16px] text-foreground/65 leading-relaxed">
          De Lisboa à Índia, pela primeira vez por mar. Segue a rota das naus e
          os grandes episódios — clica para os ler.
        </p>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        <MapaDaViagem base={base} />
      </div>

      <ol className="mt-8 space-y-2">
        {EPISODES.map((e, i) => (
          <li key={e.key}>
            <Link
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
              to={cantoHref(e.canto)}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/10 font-display text-[14px] text-accent">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[16px] text-primary">
                  {e.lugar}
                </span>
                <span className="block font-body text-[13px] text-muted-foreground">
                  {e.episodio}
                </span>
              </span>
              <span className="shrink-0 font-body text-[13px] text-accent">
                Canto {ROMANS[e.canto]} →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
