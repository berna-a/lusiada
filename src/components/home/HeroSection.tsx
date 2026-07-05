import heroBg from "@/assets/hero-azulejos.jpg";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-primary">
      {/* Mobile: full-bleed cropped background */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Desktop: native image so section adapts to its full size, no cropping */}
      <img
        alt="Mural de azulejos da Associação Lusíada"
        className="pointer-events-none hidden h-auto w-full select-none md:block"
        src={heroBg}
      />

      {/* Mobile spacer (image is background) */}
      <div aria-hidden className="min-h-[88vh] md:hidden" />
    </section>
  );
}
