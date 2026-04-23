import { Link } from "react-router-dom";

export function AdesaoSection() {
  return (
    <section
      id="adesao"
      className="bg-background py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[700px] px-6 text-center">
        <p className="font-body text-[12px] uppercase tracking-[0.2em] text-accent">
          Adesão
        </p>

        <h2 className="mt-4 font-display text-[30px] sm:text-[40px] lg:text-[48px] leading-[1.15] text-primary">
          Junte-se a quem guarda a memória
        </h2>

        <p className="mt-8 font-body text-base sm:text-lg leading-[1.7] text-foreground">
          A adesão à Associação Lusíada é livre e gratuita. Cada novo
          membro soma-se a uma comunidade crescente de portugueses — e
          lusófonos — determinados a preservar e transmitir aquilo que
          fomos e somos. A Associação sustenta-se exclusivamente de
          doações dos seus membros e amigos.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            to="/aderir"
            aria-label="Aderir à Associação Lusíada"
            className="liquid-glass premium-shadow inline-flex items-center justify-center rounded-full bg-primary px-10 py-[18px] font-display text-base text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Aderir à Lusíada
          </Link>
        </div>

        <p className="mt-4 font-body text-xs text-muted-foreground">
          Demora menos de um minuto.
        </p>
      </div>
    </section>
  );
}