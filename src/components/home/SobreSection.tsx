import { Link } from "react-router-dom";

export function SobreSection() {
  return (
    <section
      id="sobre"
      className="bg-background py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[900px] px-6">
        <p className="font-body text-[12px] uppercase tracking-[0.2em] text-muted-foreground text-center">
          A Lusíada
        </p>

        <h2 className="mt-6 font-display text-[36px] sm:text-[56px] lg:text-[72px] leading-[1.1] text-primary text-center">
          Uma Associação consagrada à memória viva de Portugal
        </h2>

        <div className="mt-12 flex justify-center">
          <span
            aria-hidden="true"
            className="block h-px w-[60px] bg-accent"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/a-associacao"
            aria-label="Saber mais sobre a Associação Lusíada"
            className="liquid-glass inline-flex items-center justify-center rounded-full border border-accent/40 px-8 py-3.5 font-display text-sm uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-accent/10 hover:border-accent"
          >
            Saber mais
          </Link>
        </div>
      </div>
    </section>
  );
}