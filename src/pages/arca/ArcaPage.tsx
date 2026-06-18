import { useQuery } from "convex/react";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Crown,
  FolderOpen,
  Landmark,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FigureCard } from "@/components/arca/FigureCard";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

const ENTRADAS = [
  {
    title: "Panteão",
    desc: "Os grandes vultos que moldaram a história da lusofonia.",
    icon: Crown,
    to: "/arca/panteao",
    accent: true,
  },
  {
    title: "Lugares",
    desc: "Locais de memória, significado e identidade.",
    icon: MapPin,
    to: "/arca/lugares",
  },
  {
    title: "Memórias",
    desc: "Relatos, documentos e testemunhos vivos.",
    icon: BookOpen,
    to: "/arca/memorias",
  },
  {
    title: "Colecções",
    desc: "Acervos temáticos curados com rigor.",
    icon: FolderOpen,
    to: "/arca/coleccoes",
  },
  {
    title: "Lusopédia",
    desc: "A enciclopédia viva da lusofonia. Em breve.",
    icon: BookMarked,
    to: "#",
    coming: true,
  },
];

export default function ArcaPage() {
  const figuras = useQuery(api.figures.list);

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative -mx-4 overflow-hidden px-4 pt-28 pb-16 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 md:pt-44 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_-10%,hsl(var(--electric)/0.10),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="container relative z-10 mx-auto md:px-4">
          <div className="max-w-2xl space-y-4 md:space-y-5">
            <p className="font-body font-semibold text-[11px] text-accent/80 uppercase tracking-[0.4em]">
              Associação Memória Lusíada
            </p>
            <h1 className="font-bold font-display text-5xl text-primary-foreground leading-[0.95] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Arca
            </h1>
            <p className="max-w-lg font-display text-base text-primary-foreground/70 italic leading-relaxed sm:text-lg md:text-xl">
              O arquivo vivo da memória nacional.
            </p>
            <p className="max-w-md font-body font-light text-primary-foreground/50 text-sm leading-relaxed md:text-base">
              A Arca Lusíada preserva, organiza e partilha o vasto património da
              lusofonia — dos grandes heróis aos lugares que contam a nossa
              história.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                asChild
                className="w-full sm:w-auto"
                size="lg"
                variant="accent"
              >
                <a href="#explorar">Explorar o Arquivo</a>
              </Button>
              <Button
                asChild
                className="w-full border-primary-foreground/20 text-primary-foreground/90 backdrop-blur-sm hover:border-primary-foreground/30 hover:bg-primary-foreground/10 sm:w-auto"
                size="lg"
                variant="outline"
              >
                <Link to="/arca/panteao">Ver o Panteão</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTAS DE ENTRADA ── */}
      <section className="bg-background py-10 md:py-16" id="explorar">
        <div className="container mx-auto px-4">
          <div className="mb-10 space-y-2 text-center">
            <h2 className="font-bold font-display text-2xl text-foreground md:text-3xl">
              Portas de Entrada
            </h2>
            <p className="font-body text-muted-foreground text-sm">
              As grandes áreas do arquivo lusófono.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ENTRADAS.map((entry) => (
              <Link
                className={`group ${entry.coming ? "pointer-events-none" : ""}`}
                key={entry.title}
                to={entry.to}
              >
                <div
                  className={`relative flex h-full flex-col gap-4 rounded-xl border p-6 transition-all duration-300 ${
                    entry.coming
                      ? "border-border/20 bg-card/30 opacity-60"
                      : "border-border/40 bg-card/60 backdrop-blur-sm hover:-translate-y-1 hover:border-accent/25"
                  } ${entry.accent ? "border-accent/20 bg-accent/[0.03]" : ""}`}
                >
                  {entry.coming && (
                    <span className="absolute top-3 right-3 rounded-full bg-accent/10 px-2 py-0.5 font-body font-semibold text-[10px] text-accent/70 uppercase tracking-wider">
                      Em breve
                    </span>
                  )}
                  <div className="w-fit rounded-xl border border-primary/[0.06] bg-primary/[0.04] p-3.5 transition-all duration-300 group-hover:border-accent/20 group-hover:bg-accent/[0.08]">
                    <entry.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="font-display font-semibold text-foreground text-lg">
                      {entry.title}
                    </p>
                    <p className="font-body text-muted-foreground/70 text-sm leading-relaxed">
                      {entry.desc}
                    </p>
                  </div>
                  {!entry.coming && (
                    <div className="mt-auto pt-2">
                      <span className="flex items-center gap-1 font-body font-semibold text-accent text-xs transition-all duration-300 group-hover:gap-2">
                        Explorar <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── EM DESTAQUE (Panteão) ── */}
      {figuras && figuras.length > 0 && (
        <section className="bg-gradient-to-b from-background via-muted/30 to-background py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-accent" />
                  <h2 className="font-bold font-display text-foreground text-xl md:text-2xl">
                    Em destaque no Panteão
                  </h2>
                </div>
                <Link
                  className="flex items-center gap-1 font-body text-accent text-sm hover:text-accent/80"
                  to="/arca/panteao"
                >
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {figuras.slice(0, 3).map((f) => (
                  <FigureCard figure={f} key={f._id} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card mx-auto max-w-3xl space-y-5 rounded-2xl p-6 text-center sm:p-10 md:p-14">
            <h2 className="font-bold font-display text-2xl text-foreground md:text-3xl">
              A memória vive quando é partilhada
            </h2>
            <p className="mx-auto max-w-md font-body text-muted-foreground text-sm leading-relaxed">
              A Arca Lusíada cresce com cada contribuição. Explore o arquivo,
              descubra histórias e ajude-nos a preservar o que importa.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <Button
                asChild
                className="w-full sm:w-auto"
                size="lg"
                variant="accent"
              >
                <Link to="/arca/panteao">Ver o Panteão</Link>
              </Button>
              <Button
                asChild
                className="w-full sm:w-auto"
                size="lg"
                variant="outline"
              >
                <Link to="/apoiar">Apoiar a Arca</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
