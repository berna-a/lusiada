import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-card py-14 md:py-20">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-1/2 h-px w-16 -translate-x-1/2 bg-accent/40" />

      <div className="container mx-auto max-w-3xl space-y-6 px-4 text-center">
        <blockquote className="border-accent border-l-2 pl-4 text-left font-display font-semibold text-foreground text-xl italic leading-snug sm:pl-8 sm:text-2xl md:text-3xl">
          "Uma nação que não conhece a sua história está condenada a perdê-la."
        </blockquote>
        <p className="pl-4 text-left font-body text-muted-foreground text-sm leading-relaxed sm:pl-8 md:text-base">
          A Associação Lusíada dedica-se a preservar, investigar e divulgar o
          vasto património histórico e cultural da lusofonia. Através de
          projectos educativos, publicações e eventos, construímos pontes entre
          o passado e o futuro.
        </p>
        <div className="pl-4 text-left sm:pl-8">
          <Button asChild size="default" variant="outline">
            <Link to="/associacao">Saber mais</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
