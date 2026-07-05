import { Link } from "react-router-dom";

export function SobreSection() {
  return (
    <section className="bg-background py-16 sm:py-20" id="sobre">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            aria-label="Saber mais sobre a Associação Lusíada"
            className="liquid-glass inline-flex items-center justify-center rounded-full border border-accent/40 px-8 py-3.5 font-display text-foreground text-sm uppercase tracking-[0.18em] transition-colors hover:border-accent hover:bg-accent/10"
            to="/a-associacao"
          >
            Saber mais
          </Link>
        </div>
      </div>
    </section>
  );
}
