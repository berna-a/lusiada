import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-primary">
      {/* Layered depth background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--electric)/0.12),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/10 to-transparent" />

      <div className="relative z-10 container mx-auto px-4 text-center py-20 md:py-28">
        <p className="text-xs uppercase tracking-[0.35em] text-accent font-semibold font-body mb-6">
          Associação Lusíada
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight leading-[1.1] max-w-4xl mx-auto font-display">
          Preservar a herança que nos define
        </h1>
        <p className="text-base md:text-lg text-primary-foreground/60 max-w-xl mx-auto mt-6 font-light font-body leading-relaxed">
          Celebrar e transmitir o património lusófono para as gerações futuras.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Button size="lg" variant="accent" asChild>
            <Link to="/associacao">Conhecer a Associação</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/8 hover:border-primary-foreground/25"
            asChild
          >
            <Link to="/arca">Explorar a Arca</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
