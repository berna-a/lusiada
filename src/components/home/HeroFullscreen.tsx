import heroBg from "@/assets/hero-azulejos.jpg";

export function HeroFullscreen() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      aria-label="Hero"
      style={{
        backgroundColor: "#061F33",
        paddingTop: "24px",
        height: "100vh",
      }}
    >
      <div className="absolute inset-0" style={{ paddingTop: "24px" }}>
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-contain object-center select-none pointer-events-none"
        />
      </div>
      {/* Bottom blend gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-[25vh] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,31,51,0) 0%, rgba(6,31,51,0.6) 100%)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}