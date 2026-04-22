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
    </section>
  );
}
