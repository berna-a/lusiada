import heroBg from "@/assets/hero-azulejos.jpg";

export function HeroFullscreen() {
  return (
    <section
      aria-label="Hero"
      className="relative w-full overflow-hidden"
      data-nav-theme="dark"
      id="hero"
      style={{
        backgroundColor: "#061F33",
        aspectRatio: "1824 / 1007",
        paddingTop: "50px",
      }}
    >
      <div className="absolute inset-x-0 top-[50px] bottom-0">
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none h-full w-full select-none object-contain object-center"
          src={heroBg}
        />
      </div>
      {/* Bottom blend gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[25vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(6,31,51,0) 0%, rgba(6,31,51,0.6) 100%)",
        }}
      />
    </section>
  );
}
