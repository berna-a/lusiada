import { Link } from "react-router-dom";

export function AdesaoSection() {
  return (
    <section className="bg-background py-20 sm:py-24 lg:py-32" id="adesao">
      <div className="mx-auto max-w-[700px] px-6 text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.2em]">
          Adesão
        </p>

        <h2 className="mt-4 font-display text-[30px] text-primary leading-[1.15] sm:text-[40px] lg:text-[48px]">
          Junte-se a quem guarda a memória
        </h2>

        <p className="mt-8 font-body text-base text-foreground leading-[1.7] sm:text-lg">
          A adesão à Associação Lusíada é livre e gratuita. Cada novo membro
          soma-se a uma comunidade crescente de portugueses — e lusófonos —
          determinados a preservar e transmitir aquilo que fomos e somos. A
          Associação sustenta-se exclusivamente de doações dos seus membros e
          amigos.
        </p>

        <div className="mt-10 flex justify-center">
          <Link
            aria-label="Aderir à Associação Lusíada"
            className="liquid-glass premium-shadow inline-flex items-center justify-center rounded-full bg-primary px-12 py-[22px] font-display text-[18px] text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_36px_-4px_hsl(var(--accent)/0.6),inset_0_0_24px_-4px_hsl(var(--accent)/0.25)]"
            to="/aderir"
          >
            Aderir à Lusíada
          </Link>
        </div>

        <p className="mt-4 font-body text-muted-foreground text-xs">
          Demora menos de um minuto.
        </p>
      </div>
    </section>
  );
}
