import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Explorar a Arca</h2>
          <p className="text-sm text-muted-foreground">A Arca Lusíada reúne o património vivo da lusofonia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {arcaEntries.map((entry) => (
            <Link key={entry.to} to={entry.to} className="group">
              <Card className="h-full border-border/60 transition-all group-hover:border-accent/50 group-hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-3 p-4">
                  <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-accent/15 transition-colors">
                    <entry.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-semibold">{entry.title}</CardTitle>
                    <CardDescription className="text-xs">{entry.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
