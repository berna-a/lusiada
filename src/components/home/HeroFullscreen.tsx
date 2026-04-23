import heroBg from "@/assets/hero-azulejos.jpg";

export function HeroFullscreen() {
  return (
    <section
      id="hero"
      className="relative w-full h-screen overflow-hidden"
      aria-label="Hero"
    >
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
      />
      {/* Bottom blend gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-[25vh] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.5) 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}