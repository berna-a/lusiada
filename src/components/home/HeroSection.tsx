import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-azulejos.jpg";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-primary">
      {/* Mobile: full-bleed cropped background */}
      <div
        className="md:hidden absolute inset-0 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Desktop: native image so section adapts to its full size, no cropping */}
      <img
        src={heroBg}
        alt="Mural de azulejos da Associação Lusíada"
        className="hidden md:block w-full h-auto select-none pointer-events-none"
      />

      {/* Mobile spacer (image is background) */}
      <div className="md:hidden min-h-[88vh]" aria-hidden />

      {/* Cinematic overlays — readability without hiding image */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent md:from-primary/70 md:via-primary/15 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/55 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pb-12 pt-24 md:pb-16 md:pt-24">
        <div className="max-w-2xl space-y-5 md:space-y-6">
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] md:tracking-[0.4em] text-accent/90 font-semibold font-body">
            Associação Lusíada
          </p>
          <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-[-0.02em] leading-[0.95] font-display">
            Preservar a herança
            <span className="block text-accent/90">que nos define</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground/65 max-w-md leading-relaxed font-body font-light">
            Celebrar e transmitir o património lusófono para as gerações futuras.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button size="lg" variant="accent" className="w-full sm:w-auto" asChild>
              <Link to="/associacao">Conhecer a Associação</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground/90 hover:bg-primary-foreground/10 hover:border-primary-foreground/30 backdrop-blur-sm"
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
