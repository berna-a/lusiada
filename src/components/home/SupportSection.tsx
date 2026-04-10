import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function SupportSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Apoia-nos</h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
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
