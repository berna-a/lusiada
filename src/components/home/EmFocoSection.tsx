import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Slide = {
  image: string;
  label: string;
  title: string;
  body: string;
  cta: { label: string; to: string };
};

const slides: Slide[] = [
  {
    image: "/images/carousel/slide-1-evento.svg",
    label: "Brevemente",
    title: "Primeiro Encontro Lusíada",
    body: "No próximo ano, a Associação Lusíada reúne pela primeira vez os seus membros fundadores para celebrar o 500.º aniversário do nascimento de Luís Vaz de Camões.",
    cta: { label: "Saber mais", to: "/programa/encontros" },
  },
  {
    image: "/images/carousel/slide-2-lusiadas.svg",
    label: "Programa Fundador",
    title: "Os Lusíadas Manuscritos",
    body: "Cinco cópias manuscritas de Os Lusíadas confiadas a cinco guardas simbólicos — da Biblioteca Nacional aos Jerónimos, da Biblioteca de Alexandria à cápsula do tempo.",
    cta: { label: "Conhecer o programa", to: "/programa" },
  },
  {
    image: "/images/carousel/slide-3-panteao.svg",
    label: "Figuras",
    title: "O Panteão",
    body: "Cada ano, a Associação Lusíada eleva uma figura tutelar da memória portuguesa. Em 2026, começamos por Luís Vaz de Camões, no quinto centenário do seu nascimento.",
    cta: { label: "Entrar no Panteão", to: "/panteao" },
  },
];

export function EmFocoSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-advance every 8s, pause on hover
  useEffect(() => {
    if (!emblaApi || paused) {
      return;
    }
    const id = window.setInterval(() => emblaApi.scrollNext(), 8000);
    return () => window.clearInterval(id);
  }, [emblaApi, paused]);

  const scrollTo = (i: number) => emblaApi?.scrollTo(i);
  const prev = () => emblaApi?.scrollPrev();
  const next = () => emblaApi?.scrollNext();

  return (
    <section
      className="relative py-20 sm:py-24 lg:py-32"
      id="foco"
      style={{
        background:
          "linear-gradient(to bottom, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center">
          <p className="font-body text-[12px] text-accent uppercase tracking-[0.2em]">
            Em Foco
          </p>
          <h2 className="mt-3 font-display text-[28px] text-accent sm:text-[36px]">
            Programa da Lusíada
          </h2>
        </div>

        <div
          className="relative mx-auto mt-12 max-w-[1100px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {slides.map((s, i) => (
                <div className="min-w-0 shrink-0 grow-0 basis-full" key={i}>
                  <article className="grid min-h-[440px] gap-0 overflow-hidden rounded-2xl border border-primary-foreground/10 bg-transparent md:grid-cols-2">
                    <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[440px]">
                      <img
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                        src={s.image}
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-12">
                      <p className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
                        {s.label}
                      </p>
                      <h3 className="font-display text-2xl text-primary-foreground leading-tight sm:text-[28px]">
                        {s.title}
                      </h3>
                      <p className="font-body text-base text-primary-foreground/80 leading-[1.6]">
                        {s.body}
                      </p>
                      <div>
                        {s.cta.to.startsWith("#") ? (
                          <a
                            aria-label={s.cta.label}
                            className="liquid-glass inline-flex items-center justify-center rounded-full border border-accent/60 px-7 py-3 font-display text-primary-foreground text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:bg-accent/15"
                            href={s.cta.to}
                          >
                            {s.cta.label}
                          </a>
                        ) : (
                          <Link
                            aria-label={s.cta.label}
                            className="liquid-glass inline-flex items-center justify-center rounded-full border border-accent/60 px-7 py-3 font-display text-primary-foreground text-xs uppercase tracking-[0.18em] transition-colors hover:border-accent hover:bg-accent/15"
                            to={s.cta.to}
                          >
                            {s.cta.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            aria-label="Slide anterior"
            className="absolute top-1/2 left-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md transition-colors hover:bg-primary-foreground/20 sm:left-4 md:opacity-0 md:group-hover:opacity-100 lg:opacity-0 lg:hover:opacity-100"
            onClick={prev}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Slide seguinte"
            className="absolute top-1/2 right-2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md transition-colors hover:bg-primary-foreground/20 sm:right-4"
            onClick={next}
            type="button"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {slides.map((_, i) => (
              <button
                aria-label={`Ir para slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  selected === i
                    ? "w-8 bg-accent"
                    : "w-1.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
                key={i}
                onClick={() => scrollTo(i)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
