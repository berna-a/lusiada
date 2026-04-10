import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function SupportSection() {
  return (
    <section className="py-14 md:py-20 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-accent/40" />

      <div className="container mx-auto px-4 max-w-2xl text-center space-y-5">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground font-display">Apoia-nos</h2>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-body">
          A preservação do património depende de todos. Apoia a Associação Lusíada
          através de mecenato, parcerias institucionais ou donativos. Cada contributo
          ajuda a manter viva a nossa herança.
        </p>
        <Button size="lg" variant="outline" asChild>
          <Link to="/apoiar">Saber como Apoiar</Link>
        </Button>
      </div>
    </section>
  );
}
