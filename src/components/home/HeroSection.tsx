import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-primary">
      {/* Placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/40" />

      <div className="relative z-10 container mx-auto px-4 text-center space-y-6 py-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight">
          Associação Lusíada
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
          Preservar, celebrar e transmitir a herança lusófona para as gerações futuras.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/associacao">Conhecer a Associação</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/arca">Explorar a Arca</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
