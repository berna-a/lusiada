import { ArrowLeft, Map } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { EPISODES } from "@/components/lusiadas/MapaDaViagem";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";

const ROMANS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Figuras maiores da epopeia — verbete na Lusopédia, ou canto onde surgem. */
const FIGURAS: { nome: string; papel: string; href: string }[] = [
  { nome: "Vasco da Gama", papel: "O capitão da armada", href: "/arca/lusopedia/vasco-da-gama" },
  { nome: "Inês de Castro", papel: "«A que depois de morta foi Rainha»", href: "/arca/lusopedia/ines-de-castro" },
  { nome: "O Adamastor", papel: "O gigante do Cabo das Tormentas", href: "CANTO:5" },
  { nome: "Infante D. Henrique", papel: "O impulso dos Descobrimentos", href: "/arca/lusopedia/infante-dom-henrique" },
  { nome: "D. Manuel I", papel: "O Rei que ordenou a viagem", href: "/arca/lusopedia/d-manuel-i" },
  { nome: "Nuno Álvares Pereira", papel: "O herói de Aljubarrota", href: "/arca/lusopedia/nuno-alvares-pereira" },
];

export default function ExplorarPage() {
  const base = lusiadasBase();

  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Explora Os Lusíadas de Camões — a viagem de Lisboa à Índia no mapa, as grandes figuras da epopeia e os episódios mais célebres, ligados aos cantos."
        path="/os-lusiadas/explorar"
        title="Explorar — Os Lusíadas | Camões"
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
          Entrar na epopeia
        </p>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[48px]">
          Explorar
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-[16px] text-foreground/65 leading-relaxed">
          A viagem, as figuras e os grandes episódios — as portas de entrada na
          obra.
        </p>
      </header>

      {/* A Viagem — porta principal */}
      <Link
        className="group mt-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
        to={`${base}/viagem`}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
          <Map className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[18px] text-primary">A Viagem</span>
          <span className="block font-body text-[14px] text-muted-foreground">
            O mapa da epopeia, de Lisboa à Índia
          </span>
        </span>
        <span className="shrink-0 font-body text-[14px] text-accent">Ver →</span>
      </Link>

      {/* Figuras */}
      <h2 className="mt-12 font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
        Figuras da epopeia
      </h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {FIGURAS.map((f) => {
          const to = f.href.startsWith("CANTO:")
            ? cantoHref(base, Number(f.href.slice(6)))
            : f.href;
          return (
            <Link
              className="rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
              key={f.nome}
              to={to}
            >
              <span className="block font-display text-[16px] text-primary">{f.nome}</span>
              <span className="block font-body text-[13px] text-muted-foreground">{f.papel}</span>
            </Link>
          );
        })}
      </div>

      {/* Episódios */}
      <h2 className="mt-12 font-body text-[12px] text-muted-foreground uppercase tracking-[0.2em]">
        Grandes episódios
      </h2>
      <ol className="mt-4 space-y-2">
        {EPISODES.map((e, i) => (
          <li key={e.key}>
            <Link
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent/40"
              to={cantoHref(base, e.canto)}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/10 font-display text-[14px] text-accent">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[16px] text-primary">{e.lugar}</span>
                <span className="block font-body text-[13px] text-muted-foreground">{e.episodio}</span>
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
