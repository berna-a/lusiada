import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function JoinSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-14 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,hsl(var(--electric)/0.08),transparent)]" />

      <div className="container relative z-10 mx-auto max-w-2xl space-y-5 px-4 text-center">
        <h2 className="font-bold font-display text-2xl text-primary-foreground md:text-3xl">
          Junta-te a Nós
        </h2>
        <p className="font-body text-primary-foreground/60 text-sm leading-relaxed md:text-base">
          Faz parte de uma comunidade que valoriza a memória colectiva. Como
          membro, participas em eventos exclusivos, contribuis para projectos de
          investigação e ajudas a preservar o que nos define.
        </p>
        <Button asChild size="lg" variant="accent">
          <Link to="/associacao">Tornar-me Membro</Link>
        </Button>
      </div>
    </section>
  );
}
