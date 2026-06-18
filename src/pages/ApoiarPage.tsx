import { HandHeart, Mail, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/PageHeader";

const FORMAS = [
  {
    icon: UserPlus,
    titulo: "Aderir",
    texto:
      "A adesão é livre e gratuita. Cada novo membro fortalece a comunidade que guarda a memória de Portugal.",
    cta: "Tornar-me membro",
    to: "/aderir",
    primary: true,
  },
  {
    icon: HandHeart,
    titulo: "Doar",
    texto:
      "A Associação sustenta-se exclusivamente de doações dos seus membros e amigos. O seu contributo torna o nosso trabalho possível.",
    cta: "Falar sobre doações",
    to: "/contactos",
  },
  {
    icon: Mail,
    titulo: "Colaborar",
    texto:
      "Académicos, artistas, programadores e voluntários: há sempre lugar para quem queira pôr as mãos à obra.",
    cta: "Quero colaborar",
    to: "/contactos",
  },
];

export default function ApoiarPage() {
  return (
    <article
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="A memória de Portugal vive do esforço de quem a guarda. Há várias formas de fazer parte."
        title="Apoiar"
      />

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {FORMAS.map((f) => (
          <div
            className={`premium-shadow flex flex-col rounded-2xl border bg-card p-8 ${
              f.primary ? "border-accent/40" : "border-border"
            }`}
            key={f.titulo}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <f.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-display text-[22px] text-primary leading-snug">
              {f.titulo}
            </h2>
            <p className="mt-3 flex-1 font-body text-[15px] text-foreground/75 leading-relaxed">
              {f.texto}
            </p>
            <Link
              className={`mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 font-display text-[13px] uppercase tracking-[0.15em] transition-all hover:brightness-110 ${
                f.primary
                  ? "text-white"
                  : "border border-primary/30 text-primary hover:bg-primary/5"
              }`}
              style={
                f.primary
                  ? {
                      backgroundColor: "hsl(351 62% 34%)",
                      boxShadow:
                        "0 6px 20px hsl(351 62% 20% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
                    }
                  : undefined
              }
              to={f.to}
            >
              {f.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* Transparência */}
      <section className="mt-16 rounded-2xl bg-secondary px-8 py-10 text-center">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Transparência
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-[16px] text-foreground/75 leading-relaxed">
          A Associação Memória Lusíada (NIF 518 533 301) é uma associação sem
          fins lucrativos. Os donativos destinam-se inteiramente à preservação e
          transmissão da memória de Portugal. Para doações ou esclarecimentos,
          escreva-nos para{" "}
          <a
            className="text-accent hover:underline"
            href="mailto:admin@alusiada.pt"
          >
            admin@alusiada.pt
          </a>
          .
        </p>
      </section>
    </article>
  );
}
