import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-primary">
      {/* Cinematic layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/85 to-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_70%_-10%,hsl(var(--electric)/0.14),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_0%_100%,hsl(var(--accent)/0.06),transparent)]" />
      {/* Film grain texture hint */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-background/8 to-transparent" />

      {/* Content — editorial left-aligned */}
      <div className="relative z-10 container mx-auto px-4 pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="max-w-2xl space-y-7">
          <p className="text-[11px] uppercase tracking-[0.4em] text-accent/90 font-semibold font-body">
            Associação Lusíada
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground tracking-[-0.02em] leading-[0.95] font-display">
            Preservar a herança
            <span className="block text-accent/90">que nos define</span>
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/50 max-w-md leading-relaxed font-body font-light">
            Celebrar e transmitir o património lusófono para as gerações futuras.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button size="lg" variant="accent" asChild>
              <Link to="/associacao">Conhecer a Associação</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/12 text-primary-foreground/80 hover:bg-primary-foreground/6 hover:border-primary-foreground/20"
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
