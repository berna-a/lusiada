import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function AboutSection() {
  return (
    <section className="py-14 md:py-20 bg-card relative overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-accent/40" />

      <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
        <blockquote className="text-2xl md:text-3xl font-semibold text-foreground italic leading-snug font-display border-l-2 border-accent pl-8 text-left">
          "Uma nação que não conhece a sua história está condenada a perdê-la."
        </blockquote>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed text-left pl-8 font-body">
          A Associação Lusíada dedica-se a preservar, investigar e divulgar o vasto património
          histórico e cultural da lusofonia. Através de projectos educativos, publicações e
          eventos, construímos pontes entre o passado e o futuro.
        </p>
        <div className="text-left pl-8">
          <Button variant="outline" size="default" asChild>
            <Link to="/associacao">Saber mais</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
