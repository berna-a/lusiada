import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function JoinSection() {
  return (
    <section className="py-14 md:py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(var(--electric)/0.08),transparent)]" />

      <div className="relative z-10 container mx-auto px-4 max-w-2xl text-center space-y-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground font-display">Junta-te a Nós</h2>
        <p className="text-primary-foreground/60 text-sm md:text-base leading-relaxed font-body">
          Faz parte de uma comunidade que valoriza a memória colectiva. Como membro,
          participas em eventos exclusivos, contribuis para projectos de investigação
          e ajudas a preservar o que nos define.
        </p>
        <Button size="lg" variant="accent" asChild>
          <Link to="/associacao">Tornar-me Membro</Link>
        </Button>
      </div>
    </section>
  );
}
