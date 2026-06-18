import { Link } from "react-router-dom";
import { Archive, Landmark, MapPin, CalendarDays } from "lucide-react";

const TEMPOS = [
  {
    titulo: "Honrar o passado",
    texto:
      "Guardar a memória dos que vieram antes — os seus nomes, as suas obras, as suas vidas. Recolher o que ainda se pode salvar antes que o tempo o leve.",
  },
  {
    titulo: "Cultivar o presente",
    texto:
      "Reunir uma comunidade viva de Portugueses e lusófonos em torno da sua herança. Criar nova arte, novo pensamento, novos laços — com raiz.",
  },
  {
    titulo: "Edificar o futuro",
    texto:
      "Transmitir às gerações vindouras aquilo que recebemos. Garantir que a memória de Portugal tem posteridade — e não fim.",
  },
];

const PROGRAMA = [
  {
    icon: Archive,
    titulo: "A Arca",
    texto:
      "Um arquivo vivo onde cada Português pode depositar e preservar a memória da sua família, guardada e transmitida por gerações.",
    to: "/arca",
  },
  {
    icon: Landmark,
    titulo: "O Panteão",
    texto:
      "As grandes figuras da nossa história — a sua vida e obra — devolvidas à consciência de quem as esqueceu, a começar pelo nosso patrono, Luís de Camões.",
    to: "/arca/panteao",
  },
  {
    icon: MapPin,
    titulo: "Os Lugares",
    texto:
      "Um mapa dos lugares onde Portugal aconteceu — cidades, monumentos e memórias — para ensinar a cada Português a geografia da sua própria alma.",
    to: "/arca/lugares",
  },
  {
    icon: CalendarDays,
    titulo: "O Calendário",
    texto:
      "Os grandes dias, as grandes batalhas e as grandes vidas, celebrados com a gravidade de quem sabe o que deve a quem veio antes.",
    to: "/arca/calendario",
  },
];

export default function AssociacaoPage() {
  return (
    <article
      data-nav-theme="light"
      className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Header */}
      <header className="text-center">
        <p className="font-body text-[12px] uppercase tracking-[0.25em] text-muted-foreground">
          Associação Memória Lusíada
        </p>
        <h1 className="mt-4 font-display text-[40px] sm:text-[56px] leading-[1.1] text-primary">
          A Associação
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </header>

      {/* Intro */}
      <div className="mx-auto mt-16 max-w-[720px] space-y-7">
        <p className="font-display text-[22px] sm:text-[26px] leading-[1.4] text-primary italic text-center">
          Existimos para guardar a memória de Portugal e garantir a sua posteridade.
        </p>
        <p className="font-body text-[17px] leading-[1.85] text-foreground/90">
          A Associação Memória Lusíada é um corpo vivo de pessoas reunidas em torno
          de um propósito comum: cuidar, estudar e celebrar Portugal — a sua língua,
          os seus heróis, os seus lugares e as suas gentes. Mais do que uma
          organização, somos uma comunidade que se reconhece numa herança partilhada.
        </p>
        <p className="font-body text-[17px] leading-[1.85] text-foreground/90">
          Não é nostalgia. É serviço. Não é exaltação. É trabalho. Honramos o passado
          que recebemos, cultivamos o presente que somos e edificamos o futuro que
          deixaremos — para que aquilo que nos foi entregue não se perca no esquecimento.
        </p>
      </div>

      {/* Três tempos */}
      <section className="mt-20">
        <h2 className="text-center font-display text-[13px] uppercase tracking-[0.3em] text-accent">
          A nossa missão
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TEMPOS.map((t) => (
            <div
              key={t.titulo}
              className="rounded-2xl border border-border bg-card p-7 premium-shadow"
            >
              <h3 className="font-display text-[20px] leading-snug text-primary">
                {t.titulo}
              </h3>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-foreground/75">
                {t.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* O que fazemos */}
      <section className="mt-20">
        <h2 className="text-center font-display text-[13px] uppercase tracking-[0.3em] text-accent">
          O que fazemos
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROGRAMA.map((p) => (
            <Link
              key={p.titulo}
              to={p.to}
              className="group flex gap-5 rounded-2xl border border-border bg-card p-7 transition-all hover:border-accent/40 premium-shadow"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-[20px] leading-snug text-primary">
                  {p.titulo}
                </h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-foreground/75">
                  {p.texto}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Identidade legal */}
      <section className="mt-20 rounded-2xl bg-secondary px-8 py-10 text-center">
        <p className="font-body text-[12px] uppercase tracking-[0.25em] text-muted-foreground">
          Identidade
        </p>
        <p className="mt-4 font-display text-[20px] text-primary">
          Associação Memória Lusíada
        </p>
        <address className="mt-3 not-italic font-body text-[15px] leading-relaxed text-foreground/70">
          Largo da Freiria 6, 3000-196 Coimbra
          <br />
          NIF 518 533 301
          <br />
          <a href="mailto:admin@alusiada.pt" className="text-accent hover:underline">
            admin@alusiada.pt
          </a>
        </address>
      </section>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-center gap-5 text-center">
        <p className="font-display text-[22px] sm:text-[26px] leading-[1.3] text-primary">
          Portugal não acabou.
        </p>
        <Link
          to="/aderir"
          className="inline-flex items-center justify-center rounded-full px-10 py-4 font-display text-[15px] uppercase tracking-[0.2em] text-white transition-all hover:brightness-110"
          style={{
            backgroundColor: "hsl(351 62% 34%)",
            boxShadow:
              "0 6px 20px hsl(351 62% 20% / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.18)",
          }}
        >
          Junta-te
        </Link>
      </div>
    </article>
  );
}
