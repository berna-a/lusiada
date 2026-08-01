import {
  CalendarDays,
  CircleDot,
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

const JOGOS = [
  {
    icon: CircleDot,
    titulo: "Go",
    estado: "A jogar",
    texto:
      "Há mesas todos os sábados. É o jogo mais antigo do mundo que chegou até nós sem mudar de regras — e o mais difícil de ganhar por força bruta. Jogamos com a Associação Portuguesa de Go.",
  },
  {
    icon: Crown,
    titulo: "Xadrez",
    estado: "A crescer",
    texto:
      "A abrir agora ao público, com um torneio para trinta pessoas. Procuramos jogadores de todos os níveis — e quem nunca jogou a sério também tem lugar.",
  },
  {
    icon: Swords,
    titulo: "Shogi e Xiangqi",
    estado: "A caminho",
    texto:
      "O xadrez japonês e o chinês. Entram quando o Go e o xadrez estiverem firmes, para que ninguém tenha de escolher entre um tabuleiro e outro.",
  },
];

/** O que a Associação precisa — a resposta antecipada às perguntas de quem cede. */
const CONDICOES = [
  { rotulo: "Quantos", valor: "Até 30 pessoas, sentadas a jogar" },
  { rotulo: "Quanto tempo", valor: "Cerca de 3 horas, ao fim-de-semana" },
  { rotulo: "O que precisamos", valor: "Mesas e cadeiras. Levamos o resto" },
  { rotulo: "Ruído", valor: "Nenhum. Um torneio joga-se em silêncio" },
  { rotulo: "No fim", valor: "Devolvemos a sala como a encontrámos" },
  {
    rotulo: "Natureza do evento",
    valor: "Cultural, aberto ao público, sem cariz político ou ideológico",
  },
];

export default function DesportoPage() {
  return (
    <article
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <Seo
        description="Desportos da mente na Associação Memória Lusíada: Go todas as semanas, xadrez a abrir ao público, com a Associação Portuguesa de Go. Procuramos uma sala em Lisboa."
        path="/desporto"
        title="Desportos da mente — Associação Memória Lusíada"
      />

      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="Somos uma associação juvenil de cariz cultural, com trabalho em três frentes: as artes, a academia e o desporto. No desporto começámos pelo mais antigo de todos — o que se joga sentado."
        title="Desportos da mente"
      />

      {/* A tese */}
      <section className="mx-auto mt-16 max-w-[640px]">
        <p className="font-body text-[17px] text-foreground/85 leading-[1.85]">
          Há uma família de jogos que se chama desportos da mente. Não têm bola
          nem pista, não se ganham por força nem por velocidade, e um jogador de
          setenta anos pode vencer um de vinte. Ganham-se por atenção, paciência
          e a disciplina de pensar antes de mexer.
        </p>
        <p className="mt-5 font-body text-[17px] text-foreground/85 leading-[1.85]">
          É por aí que começámos. Não porque o resto não importe, mas porque
          estes são os jogos que melhor traduzem o que uma casa como a nossa
          quer cultivar — e os únicos que se organizam com uma mesa, umas
          cadeiras e vontade de estar.
        </p>
        <p className="mt-5 font-body text-[17px] text-foreground/85 leading-[1.85]">
          Não somos um clube desportivo e não andamos atrás de medalhas.
          Escolhemos as disciplinas pelo que dizem sobre nós.
        </p>
      </section>

      {/* Os jogos */}
      <section className="mt-16">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          O que se joga
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {JOGOS.map((j) => (
            <div
              className="premium-shadow flex flex-col rounded-2xl border border-border bg-card p-7"
              key={j.titulo}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <j.icon className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-body text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
                  {j.estado}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[20px] text-primary leading-snug">
                {j.titulo}
              </h3>
              <p className="mt-3 font-body text-[15px] text-foreground/75 leading-relaxed">
                {j.texto}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[640px] font-body text-[15px] text-foreground/65 leading-relaxed">
          As mesas são abertas a todos os níveis — de quem aprendeu ontem a quem
          joga há trinta anos. Quem nunca jogou aprende no primeiro dia.
        </p>
      </section>

      {/* Procuramos casa — a razão de ser desta página */}
      <section
        className="mt-16 rounded-2xl border border-accent/30 bg-secondary px-8 py-10 sm:px-10"
        id="espaco"
      >
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Uma proposta a quem tem uma sala
        </h2>
        <h3 className="mt-4 max-w-[640px] font-display text-[26px] text-primary leading-[1.2] sm:text-[30px]">
          Procuramos casa em Lisboa para o nosso primeiro torneio aberto.
        </h3>
        <p className="mt-5 max-w-[620px] font-body text-[16px] text-foreground/80 leading-relaxed">
          Somos uma associação juvenil sem fins lucrativos. Não temos sede
          própria e não temos orçamento para alugar — o que temos é uma
          actividade que enche uma sala de gente nova a fazer uma coisa
          silenciosa e antiga. Se tem um espaço parado ao fim-de-semana,
          gostávamos de falar consigo.
        </p>

        <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {CONDICOES.map((c) => (
            <div className="border-accent/25 border-t pt-3" key={c.rotulo}>
              <dt className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                {c.rotulo}
              </dt>
              <dd className="mt-1 font-body text-[15px] text-foreground/85 leading-relaxed">
                {c.valor}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-9 border-accent/25 border-t pt-6">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
            O que damos em troca
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "O vosso nome em todos os materiais e na comunicação do torneio",
              "Fotografia e registo do evento, à vossa disposição",
              "Um público novo a conhecer a vossa casa",
              "Trinta pessoas que voltam, se a casa as receber bem",
            ].map((t) => (
              <li
                className="flex gap-2.5 font-body text-[15px] text-foreground/80 leading-relaxed"
                key={t}
              >
                <span aria-hidden="true" className="mt-0.5 text-accent">
                  —
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <a
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
          href="mailto:bernardo@alusiada.pt?subject=Espaço%20para%20o%20torneio%20—%20Associação%20Memória%20Lusíada"
        >
          <Handshake size={16} strokeWidth={1.5} />
          Falar sobre um espaço
        </a>
      </section>

      {/* Para além do tabuleiro */}
      <section className="mt-16">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Para além do tabuleiro
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Swords className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-[19px] text-primary">
              Esgrima lusitana
            </h3>
            <p className="mt-2 font-body text-[15px] text-foreground/75 leading-relaxed">
              O jogo do pau não é um desporto: é uma arte marcial portuguesa,
              das poucas que sobreviveram. Queremos ajudar a que não se perca.
            </p>
          </div>
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Sailboat className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-[19px] text-primary">
              Vela e equitação
            </h3>
            <p className="mt-2 font-body text-[15px] text-foreground/75 leading-relaxed">
              O mar e a terra — as duas metades de como este país se fez. Em
              estudo, para quando houver braços que cheguem.
            </p>
          </div>
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-[19px] text-primary">
              Futebol
            </h3>
            <p className="mt-2 font-body text-[15px] text-foreground/75 leading-relaxed">
              Jogos entre membros e amigos, marcados pela plataforma AGORA. É o
              lado convívio da casa — e a semente de apoiarmos, um dia, clubes e
              equipas portuguesas.
            </p>
          </div>
        </div>
      </section>

      {/* Participar */}
      <section className="mt-16 rounded-2xl bg-card px-8 py-10 text-center">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Quer jogar connosco?
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] font-body text-[16px] text-foreground/75 leading-relaxed">
          O torneio é aberto ao público e não é preciso saber jogar bem — é
          preciso querer. As inscrições abrem assim que a sala estiver
          encontrada.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            href="mailto:bernardo@alusiada.pt?subject=Torneio%20—%20quero%20ser%20avisado"
          >
            <Mail size={16} strokeWidth={1.5} />
            Avisem-me quando abrir
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-[13px] text-muted-foreground uppercase tracking-[0.14em]">
            <CalendarDays size={14} strokeWidth={1.5} />
            Data por marcar
          </span>
        </div>
      </section>

      <div className="mt-16">
        <JoinCTA lead="Faça parte desta casa." />
      </div>
    </article>
  );
}
