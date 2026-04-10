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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Explorar a Arca</h2>
          <p className="text-muted-foreground">A Arca Lusíada reúne o património vivo da lusofonia.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {arcaEntries.map((entry) => (
            <Link key={entry.to} to={entry.to} className="group">
              <Card className="h-full transition-colors group-hover:border-accent">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="rounded-md bg-muted p-2.5">
                    <entry.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{entry.title}</CardTitle>
                    <CardDescription className="text-sm">{entry.description}</CardDescription>
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
