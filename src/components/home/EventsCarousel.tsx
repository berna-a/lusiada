import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const placeholderItems = [
  {
    type: "Evento",
    title: "Colóquio: Heróis Esquecidos",
    date: "15 Mai 2026",
    description:
      "Debate sobre figuras históricas pouco conhecidas da lusofonia.",
  },
  {
    type: "Publicação",
    title: "Revista Lusíada Nº 12",
    date: "01 Abr 2026",
    description: "Nova edição com artigos sobre património imaterial.",
  },
  {
    type: "Destaque",
    title: "Castelo de Guimarães",
    date: "20 Mar 2026",
    description: "Novo lugar adicionado ao mapa da Arca Lusíada.",
  },
  {
    type: "Evento",
    title: "Encontro Anual de Sócios",
    date: "10 Jun 2026",
    description: "Assembleia geral e convívio entre membros.",
  },
  {
    type: "Publicação",
    title: "Memórias do Ultramar",
    date: "05 Fev 2026",
    description: "Colecção de relatos e documentos históricos.",
  },
];

export function EventsCarousel() {
  return (
    <section className="relative bg-background py-16 md:py-24">
      {/* Top fade from hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/0 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mb-12 space-y-3 text-center">
          <h2 className="font-bold font-display text-2xl text-foreground md:text-3xl">
            Eventos e Publicações
          </h2>
          <p className="font-body text-muted-foreground text-sm">
            Acompanhe a actividade da Associação.
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-8 md:px-12">
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {placeholderItems.map((item, i) => (
                <CarouselItem className="md:basis-1/2 lg:basis-1/3" key={i}>
                  <Card className="h-full rounded-xl border-border/50 bg-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-[0_16px_48px_-12px_hsl(var(--primary)/0.1),0_0_0_1px_hsl(var(--accent)/0.12)]">
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge
                          className="rounded-full px-3 py-0.5 font-body font-medium text-[11px]"
                          variant="secondary"
                        >
                          {item.type}
                        </Badge>
                        <span className="font-body text-[11px] text-muted-foreground/60">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="font-display font-semibold text-base leading-snug">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
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
