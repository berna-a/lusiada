import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

const placeholderItems = [
  { type: "Evento", title: "Colóquio: Heróis Esquecidos", date: "15 Mai 2026", description: "Debate sobre figuras históricas pouco conhecidas da lusofonia." },
  { type: "Publicação", title: "Revista Lusíada Nº 12", date: "01 Abr 2026", description: "Nova edição com artigos sobre património imaterial." },
  { type: "Destaque", title: "Castelo de Guimarães", date: "20 Mar 2026", description: "Novo lugar adicionado ao mapa da Arca Lusíada." },
  { type: "Evento", title: "Encontro Anual de Sócios", date: "10 Jun 2026", description: "Assembleia geral e convívio entre membros." },
  { type: "Publicação", title: "Memórias do Ultramar", date: "05 Fev 2026", description: "Colecção de relatos e documentos históricos." },
];

export function EventsCarousel() {
  return (
    <section className="py-16 md:py-24 bg-background relative">
      {/* Top fade from hero */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background/0 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">Eventos e Publicações</h2>
          <p className="text-sm text-muted-foreground font-body">Acompanhe a actividade da Associação.</p>
        </div>

        <div className="max-w-5xl mx-auto px-12">
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {placeholderItems.map((item, i) => (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full rounded-xl border-border/50 bg-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_hsl(var(--primary)/0.1),0_0_0_1px_hsl(var(--accent)/0.12)] hover:border-accent/20">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-[11px] font-medium font-body rounded-full px-3 py-0.5">{item.type}</Badge>
                        <span className="text-[11px] text-muted-foreground/60 font-body">{item.date}</span>
                      </div>
                      <CardTitle className="text-base leading-snug font-display font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed font-body">{item.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="rounded-full border-border/50 hover:border-accent/30 hover:shadow-[0_0_16px_-4px_hsl(var(--accent)/0.2)]" />
            <CarouselNext className="rounded-full border-border/50 hover:border-accent/30 hover:shadow-[0_0_16px_-4px_hsl(var(--accent)/0.2)]" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
