import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4 max-w-3xl text-center space-y-5">
        <blockquote className="text-xl md:text-2xl font-semibold text-foreground italic leading-relaxed border-l-2 border-accent pl-6 text-left">
          "Uma nação que não conhece a sua história está condenada a perdê-la."
        </blockquote>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-left pl-6">
          A Associação Lusíada dedica-se a preservar, investigar e divulgar o vasto património
          histórico e cultural da lusofonia. Através de projectos educativos, publicações e
          eventos, construímos pontes entre o passado e o futuro.
        </p>
        <div className="text-left pl-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/associacao">Saber mais</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
