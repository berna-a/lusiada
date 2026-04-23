import { Link } from "react-router-dom";

export function SobreSection() {
  return (
    <section
      id="sobre"
      className="bg-background py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[900px] px-6">
        <p className="font-body text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          A Lusíada
        </p>

        <h2 className="mt-4 font-display text-[32px] sm:text-[44px] lg:text-[56px] leading-[1.1] text-primary">
          Uma Associação consagrada à memória viva de Portugal
        </h2>

        <p className="mt-8 font-body text-base sm:text-lg leading-[1.7] text-foreground">
          A Associação Lusíada existe para guardar, iluminar e transmitir
          aquilo que Portugal tem de mais duradouro: a sua língua, a sua
          literatura, o seu imaginário civilizacional. Fazemo-lo através
          da celebração anual das figuras que nos deram forma — começando
          por Luís Vaz de Camões — e da publicação de edições, ensaios e
          encontros que mantêm viva essa herança.
        </p>

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