import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function SupportSection() {
  return (
    <section className="relative overflow-hidden bg-card py-14 md:py-20">
      <div className="absolute top-0 left-1/2 h-px w-16 -translate-x-1/2 bg-accent/40" />

      <div className="container mx-auto max-w-2xl space-y-5 px-4 text-center">
        <h2 className="font-bold font-display text-2xl text-foreground md:text-3xl">
          Apoia-nos
        </h2>
        <p className="font-body text-muted-foreground text-sm leading-relaxed md:text-base">
          A preservação do património depende de todos. Apoia a Associação
          Lusíada através de mecenato, parcerias institucionais ou donativos.
          Cada contributo ajuda a manter viva a nossa herança.
        </p>
        <Button asChild size="lg" variant="outline">
          <Link to="/apoiar">Saber como Apoiar</Link>
        </Button>
      </div>
    </section>
  );
}
