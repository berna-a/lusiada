import { BookOpen, Crown, FolderOpen, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const arcaEntries = [
  {
    title: "Panteão",
    description: "Os grandes vultos da lusofonia.",
    icon: Crown,
    to: "/arca/panteao",
  },
  {
    title: "Mapa",
    description: "O território, lugar a lugar.",
    icon: MapPin,
    to: "/mapa",
  },
  {
    title: "Heróis",
    description: "Figuras que moldaram a história.",
    icon: Users,
    to: "/arca/herois",
  },
  {
    title: "Memórias",
    description: "Relatos, documentos e testemunhos.",
    icon: BookOpen,
    to: "/arca/memorias",
  },
  {
    title: "Colecções",
    description: "Acervos temáticos curados.",
    icon: FolderOpen,
    to: "/arca/coleccoes",
  },
];

export function ExploreArcaSection() {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 space-y-2 text-center">
          <h2 className="font-bold font-display text-2xl text-foreground md:text-3xl">
            Explorar a Arca
          </h2>
          <p className="font-body text-muted-foreground text-sm">
            A Arca Lusíada reúne o património vivo da lusofonia.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {arcaEntries.map((entry) => (
            <Link className="group" key={entry.to} to={entry.to}>
              <div className="flex h-full items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.12),0_0_0_1px_hsl(var(--accent)/0.12)]">
                <div className="shrink-0 rounded-xl border border-primary/8 bg-primary/6 p-3 transition-all duration-300 group-hover:border-accent/20 group-hover:bg-accent/12">
                  <entry.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-display font-semibold text-foreground text-sm">
                    {entry.title}
                  </p>
                  <p className="font-body text-muted-foreground/70 text-xs">
                    {entry.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
