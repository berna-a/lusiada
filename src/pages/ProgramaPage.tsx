import {
  Archive,
  CalendarDays,
  Landmark,
  MapPin,
  Palette,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { JoinCTA } from "@/components/JoinCTA";
import { PageHeader } from "@/components/PageHeader";

const LINHAS = [
  {
    icon: Archive,
    titulo: "A Arca",
    texto:
      "Um arquivo vivo onde cada Português deposita e preserva a memória da sua família, guardada e transmitida por gerações.",
    to: "/arca",
  },
  {
    icon: Landmark,
    titulo: "O Panteão",
    texto:
      "Fichas dedicadas aos grandes heróis e figuras maiores da nossa história, devolvendo-os à memória colectiva.",
    to: "/arca/panteao",
  },
  {
    icon: MapPin,
    titulo: "Os Lugares",
    texto:
      "A cartografia dos lugares onde Portugal aconteceu — cidades, monumentos e memórias do território.",
    to: "/arca/lugares",
  },
  {
    icon: CalendarDays,
    titulo: "O Calendário",
    texto:
      "A celebração dos grandes dias, batalhas e vidas que marcam o ano português.",
    to: "/arca/calendario",
  },
  {
    icon: Palette,
    titulo: "Nova Criação",
    texto:
      "Espaços para fazer nova arte portuguesa — azulejo, música, escrita — porque um povo que só guarda morre, e um povo que cria sem raiz erra.",
    to: "/programa/iniciativas",
  },
  {
    icon: Users,
    titulo: "Os Núcleos",
    texto:
      "Académicos, artistas, voluntários, jovens e velhos reunidos em núcleos por todo o país, em torno de uma só ideia.",
    to: "/aderir",
  },
];

export default function ProgramaPage() {
  return (
    <article
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="As linhas de acção pelas quais cumprimos a nossa missão — honrar o passado, cultivar o presente e edificar o futuro de Portugal."
        title="Programa"
      />

      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LINHAS.map((l) => (
          <Link
            className="group premium-shadow flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-accent/40"
            key={l.titulo}
            to={l.to}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <l.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-5 font-display text-[20px] text-primary leading-snug">
              {l.titulo}
            </h2>
            <p className="mt-3 font-body text-[15px] text-foreground/75 leading-relaxed">
              {l.texto}
            </p>
          </Link>
        ))}
      </section>

      {/* Acompanhar */}
      <section className="mt-16 rounded-2xl bg-secondary px-8 py-10 text-center">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Acompanhar
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-[16px] text-foreground/75 leading-relaxed">
          A agenda de encontros e as crónicas da Associação estão a ser
          preparadas. Adira para ser dos primeiros a saber.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 font-body text-[13px] text-muted-foreground uppercase tracking-[0.15em]">
          <span className="rounded-full border border-border px-4 py-1.5">
            Agenda · em breve
          </span>
          <span className="rounded-full border border-border px-4 py-1.5">
            Blogue · em breve
          </span>
        </div>
      </section>

      <div className="mt-16">
        <JoinCTA lead="Faça parte deste programa." />
      </div>
    </article>
  );
}
