import { Archive, CalendarDays, Landmark, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { JoinCTA } from "@/components/JoinCTA";
import { PageHeader } from "@/components/PageHeader";

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
      className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader eyebrow="Associação Memória Lusíada" title="A Associação" />

      {/* Intro */}
      <div className="mx-auto mt-16 max-w-[720px] space-y-7">
        <p className="text-center font-display text-[22px] text-primary italic leading-[1.4] sm:text-[26px]">
          Existimos para guardar a memória de Portugal e garantir a sua
          posteridade.
        </p>
        <p className="font-body text-[17px] text-foreground/90 leading-[1.85]">
          A Associação Memória Lusíada é um corpo vivo de pessoas reunidas em
          torno de um propósito comum: cuidar, estudar e celebrar Portugal — a
          sua língua, os seus heróis, os seus lugares e as suas gentes. Mais do
          que uma organização, somos uma comunidade que se reconhece numa
          herança partilhada.
        </p>
        <p className="font-body text-[17px] text-foreground/90 leading-[1.85]">
          Não é nostalgia. É serviço. Não é exaltação. É trabalho. Honramos o
          passado que recebemos, cultivamos o presente que somos e edificamos o
          futuro que deixaremos — para que aquilo que nos foi entregue não se
          perca no esquecimento.
        </p>
      </div>

      {/* Três tempos */}
      <section className="mt-20">
        <h2 className="text-center font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          A nossa missão
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TEMPOS.map((t) => (
            <div
              className="premium-shadow rounded-2xl border border-border bg-card p-7"
              key={t.titulo}
            >
              <h3 className="font-display text-[20px] text-primary leading-snug">
                {t.titulo}
              </h3>
              <p className="mt-3 font-body text-[15px] text-foreground/75 leading-relaxed">
                {t.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* O que fazemos */}
      <section className="mt-20">
        <h2 className="text-center font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          O que fazemos
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROGRAMA.map((p) => (
            <Link
              className="group premium-shadow flex gap-5 rounded-2xl border border-border bg-card p-7 transition-all hover:border-accent/40"
              key={p.titulo}
              to={p.to}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-[20px] text-primary leading-snug">
                  {p.titulo}
                </h3>
                <p className="mt-2 font-body text-[15px] text-foreground/75 leading-relaxed">
                  {p.texto}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Identidade legal */}
      <section className="mt-20 rounded-2xl bg-secondary px-8 py-10 text-center">
        <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.25em]">
          Identidade
        </p>
        <p className="mt-4 font-display text-[20px] text-primary">
          Associação Memória Lusíada
        </p>
        <address className="mt-3 font-body text-[15px] text-foreground/70 not-italic leading-relaxed">
          Largo da Freiria 6, 3000-196 Coimbra
          <br />
          NIF 518 533 301
          <br />
          <a
            className="text-accent hover:underline"
            href="mailto:admin@alusiada.pt"
          >
            admin@alusiada.pt
          </a>
        </address>
      </section>

      {/* CTA */}
      <div className="mt-16">
        <JoinCTA lead="Portugal não acabou." />
      </div>
    </article>
  );
}
