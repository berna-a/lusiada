import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
        <blockquote className="text-2xl md:text-3xl font-semibold text-foreground italic leading-relaxed">
          "Uma nação que não conhece a sua história está condenada a perdê-la."
        </blockquote>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          A Associação Lusíada dedica-se a preservar, investigar e divulgar o vasto património
          histórico e cultural da lusofonia. Através de projectos educativos, publicações e
          eventos, construímos pontes entre o passado e o futuro.
        </p>
        <Button variant="outline" asChild>
          <Link to="/associacao">Saber mais</Link>
        </Button>
      </div>
    </section>
  );
}
