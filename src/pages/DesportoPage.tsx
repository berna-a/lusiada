import {
  Brain,
  CalendarDays,
  Crown,
  Handshake,
  Mail,
  Sailboat,
  Swords,
  Users,
} from "lucide-react";
import { JoinCTA } from "@/components/JoinCTA";
import { PageHeader } from "@/components/PageHeader";
import { Seo } from "@/components/Seo";

/** O que a Associação precisa de um espaço — a resposta às perguntas de quem cede. */
const REQUISITOS = [
  { rotulo: "Participantes", valor: "Até 30 pessoas sentadas" },
  { rotulo: "Duração", valor: "Cerca de 3 horas, num sábado ou domingo" },
  { rotulo: "Necessário", valor: "Mesas e cadeiras. Mais nada" },
  {
    rotulo: "Ruído",
    valor: "Nenhum — um torneio de xadrez faz-se em silêncio",
  },
  { rotulo: "Montagem", valor: "Chegamos antes, arrumamos tudo no fim" },
  {
    rotulo: "Natureza",
    valor: "Cultural e aberta ao público. Sem cariz político ou ideológico",
  },
];

const DISCIPLINAS = [
  {
    icon: Crown,
    titulo: "Xadrez",
    estado: "A organizar",
    texto:
      "A primeira frente. Estamos a preparar um torneio aberto ao público, para trinta participantes.",
  },
  {
    icon: Brain,
    titulo: "GO",
    estado: "A seguir",
    texto:
      "O jogo de estratégia mais antigo que se joga sem interrupção. Entra depois do xadrez estar de pé.",
  },
  {
    icon: Swords,
    titulo: "Esgrima lusitana",
    estado: "Em estudo",
    texto:
      "A arte da espada portuguesa, hoje quase sem prática organizada em Portugal. Queremos ajudar a devolvê-la.",
  },
  {
    icon: Sailboat,
    titulo: "Vela e equitação",
    estado: "Em estudo",
    texto:
      "Duas disciplinas que nos ligam ao mar e à terra — as duas metades de como Portugal se fez.",
  },
];

export default function DesportoPage() {
  return (
    <article
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <Seo
        description="A Associação Memória Lusíada organiza jogos da mente — xadrez e GO — e procura espaços cedidos para os realizar. Associação juvenil sem fins lucrativos, de cariz cultural."
        path="/desporto"
        title="Desporto — Associação Memória Lusíada"
      />

      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="Somos uma associação juvenil de cariz cultural, com iniciativas em três frentes: as artes, a academia e o desporto. No desporto, começámos pelos jogos da mente."
        title="Desporto"
      />

      {/* Porque o desporto */}
      <section className="mx-auto mt-16 max-w-[640px]">
        <p className="font-body text-[17px] text-foreground/85 leading-[1.85]">
          Não somos um clube desportivo e não perseguimos medalhas. O que nos
          interessa no desporto é o mesmo que nos interessa na língua e na
          memória: aquilo que ele diz sobre quem somos. Por isso escolhemos as
          disciplinas com critério — as que têm raiz cultural, história
          portuguesa ou exigência de pensamento.
        </p>
        <p className="mt-5 font-body text-[17px] text-foreground/85 leading-[1.85]">
          Começámos pelos <strong>jogos da mente</strong>. São os mais fáceis de
          organizar, os mais baratos de manter, e os que melhor traduzem aquilo
          que queremos cultivar: atenção, paciência e a disciplina de pensar
          antes de agir.
        </p>
      </section>

      {/* Disciplinas */}
      <section className="mt-16">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          As disciplinas
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {DISCIPLINAS.map((d) => (
            <div
              className="premium-shadow flex flex-col rounded-2xl border border-border bg-card p-7"
              key={d.titulo}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <d.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-body text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
                  {d.estado}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[20px] text-primary leading-snug">
                {d.titulo}
              </h3>
              <p className="mt-3 font-body text-[15px] text-foreground/75 leading-relaxed">
                {d.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* O pedido de espaço — a razão de ser desta página */}
      <section
        className="mt-16 rounded-2xl border border-accent/30 bg-secondary px-8 py-10 sm:px-10"
        id="espaco"
      >
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Procuramos um espaço
        </h2>
        <h3 className="mt-4 max-w-[600px] font-display text-[26px] text-primary leading-[1.2] sm:text-[30px]">
          Precisamos de uma sala emprestada para o nosso primeiro torneio de
          xadrez.
        </h3>
        <p className="mt-5 max-w-[620px] font-body text-[16px] text-foreground/80 leading-relaxed">
          Somos uma associação juvenil sem fins lucrativos e procuramos apoio
          local: uma sala cedida gratuitamente, por algumas horas. Em troca,
          damos visibilidade a quem nos acolher — em todos os materiais do
          evento e na nossa comunicação — e deixamos o espaço como o
          encontrámos.
        </p>

        <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {REQUISITOS.map((r) => (
            <div className="border-accent/25 border-t pt-3" key={r.rotulo}>
              <dt className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                {r.rotulo}
              </dt>
              <dd className="mt-1 font-body text-[15px] text-foreground/85 leading-relaxed">
                {r.valor}
              </dd>
            </div>
          ))}
        </dl>

        <a
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
          href="mailto:bernardo@alusiada.pt?subject=Cedência%20de%20espaço%20—%20torneio%20de%20xadrez"
        >
          <Handshake size={16} strokeWidth={1.5} />
          Temos um espaço para vos ceder
        </a>
      </section>

      {/* Futebol */}
      <section className="mt-16 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-[22px] text-primary">
            Também jogamos à bola
          </h2>
          <p className="mt-3 max-w-[620px] font-body text-[16px] text-foreground/80 leading-relaxed">
            Organizamos jogos de futebol entre membros e amigos da Associação,
            marcados através da plataforma AGORA. É o lado convívio da casa — e
            a semente de algo maior: queremos, com o tempo, apoiar e promover
            clubes e equipas desportivas portuguesas.
          </p>
        </div>
      </section>

      {/* Como participar */}
      <section className="mt-16 rounded-2xl bg-card px-8 py-10 text-center">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Quer jogar connosco?
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] font-body text-[16px] text-foreground/75 leading-relaxed">
          O torneio de xadrez é aberto ao público. As inscrições abrem assim que
          a data e o local estiverem fechados — escreva-nos para ficar na lista.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            href="mailto:bernardo@alusiada.pt?subject=Torneio%20de%20xadrez%20—%20inscrição"
          >
            <Mail size={16} strokeWidth={1.5} />
            Avisem-me do torneio
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-[13px] text-muted-foreground uppercase tracking-[0.14em]">
            <CalendarDays size={14} strokeWidth={1.5} />
            Data por anunciar
          </span>
        </div>
      </section>

      <div className="mt-16">
        <JoinCTA lead="Faça parte desta casa." />
      </div>
    </article>
  );
}
