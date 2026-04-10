import { Link } from "react-router-dom";
import { Crown, MapPin, Users, BookOpen, FolderOpen } from "lucide-react";

const arcaEntries = [
  { title: "Panteão", description: "Os grandes vultos da lusofonia.", icon: Crown, to: "/arca/panteao" },
  { title: "Lugares", description: "Locais de memória e significado.", icon: MapPin, to: "/arca/lugares" },
  { title: "Heróis", description: "Figuras que moldaram a história.", icon: Users, to: "/arca/herois" },
  { title: "Memórias", description: "Relatos, documentos e testemunhos.", icon: BookOpen, to: "/arca/memorias" },
  { title: "Colecções", description: "Acervos temáticos curados.", icon: FolderOpen, to: "/arca/coleccoes" },
];

export function ExploreArcaSection() {
  return (
    <section className="py-14 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">Explorar a Arca</h2>
          <p className="text-sm text-muted-foreground font-body">A Arca Lusíada reúne o património vivo da lusofonia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {arcaEntries.map((entry) => (
            <Link key={entry.to} to={entry.to} className="group">
              <div className="h-full rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_hsl(var(--primary)/0.12),0_0_0_1px_hsl(var(--accent)/0.12)] hover:border-accent/25">
                <div className="rounded-xl bg-primary/6 border border-primary/8 p-3 group-hover:bg-accent/12 group-hover:border-accent/20 transition-all duration-300 shrink-0">
                  <entry.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground font-display">{entry.title}</p>
                  <p className="text-xs text-muted-foreground/70 font-body">{entry.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
