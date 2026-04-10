import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function JoinSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Junta-te a Nós</h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          Faz parte de uma comunidade que valoriza a memória colectiva. Como membro,
          participas em eventos exclusivos, contribuis para projectos de investigação
          e ajudas a preservar o que nos define.
        </p>
        <Button size="lg" asChild>
          <Link to="/associacao">Tornar-me Membro</Link>
        </Button>
      </div>
    </section>
  );
}
