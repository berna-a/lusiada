import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function JoinSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Junta-te a Nós</h2>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          Faz parte de uma comunidade que valoriza a memória colectiva. Como membro,
          participas em eventos exclusivos, contribuis para projectos de investigação
          e ajudas a preservar o que nos define.
        </p>
        <Button size="default" asChild>
          <Link to="/associacao">Tornar-me Membro</Link>
        </Button>
      </div>
    </section>
  );
}
