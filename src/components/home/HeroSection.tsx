import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-primary">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary to-primary/85" />

      <div className="relative z-10 container mx-auto px-4 text-center py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.25em] text-accent font-medium mb-4">
          Associação Lusíada
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground tracking-tight leading-tight max-w-3xl mx-auto">
          Preservar a herança que nos define
        </h1>
        <p className="text-base md:text-lg text-primary-foreground/70 max-w-xl mx-auto mt-4">
          Celebrar e transmitir o património lusófono para as gerações futuras.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/associacao">Conhecer a Associação</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link to="/arca">Explorar a Arca</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
