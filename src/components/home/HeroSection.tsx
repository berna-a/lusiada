import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-azulejos.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Cinematic overlays — lighter bottom for more image visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_-10%,hsl(var(--electric)/0.06),transparent)]" />

      {/* Soft bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />

      {/* Content — shifted up for elegance */}
      <div className="relative z-10 container mx-auto px-4 pb-24 pt-36 md:pb-32 md:pt-48">
        <div className="max-w-2xl space-y-6">
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent/90 font-semibold font-body">
            Associação Lusíada
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-[-0.02em] leading-[0.95] font-display">
            Preservar a herança
            <span className="block text-accent/90">que nos define</span>
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/65 max-w-md leading-relaxed font-body font-light">
            Celebrar e transmitir o património lusófono para as gerações futuras.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button size="lg" variant="accent" asChild>
              <Link to="/associacao">Conhecer a Associação</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground/90 hover:bg-primary-foreground/10 hover:border-primary-foreground/30 backdrop-blur-sm"
              asChild
            >
              <Link to="/arca">Explorar a Arca</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
