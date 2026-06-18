import { JoinCTA } from "@/components/JoinCTA";
import { PageHeader } from "@/components/PageHeader";

const OBJECTIVOS = [
  {
    titulo: "Guardar a memória",
    texto:
      "Recolher, preservar e organizar a memória de Portugal — das grandes figuras às histórias de família — antes que o tempo a apague.",
  },
  {
    titulo: "Garantir a posteridade",
    texto:
      "Transmitir essa herança às gerações vindouras, de forma viva e acessível, para que aquilo que fomos continue a fazer parte do que seremos.",
  },
  {
    titulo: "Reacender o orgulho",
    texto:
      "Devolver a cada Português o conhecimento e o orgulho da sua herança, e o desejo de a transmitir aos seus.",
  },
  {
    titulo: "Reunir uma comunidade",
    texto:
      "Romper com o isolamento, juntando pessoas — jovens e velhos, em Portugal e na diáspora — em torno de um propósito comum.",
  },
  {
    titulo: "Criar com raiz",
    texto:
      "Estimular nova arte e novo pensamento portugueses, que honrem a tradição sem se fecharem nela.",
  },
  {
    titulo: "Servir, não exaltar",
    texto:
      "Trabalhar com rigor e seriedade ao serviço da memória nacional — sem nostalgia estéril, sem exaltação vã.",
  },
];

export default function ObjectivosPage() {
  return (
    <article
      className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="Aquilo a que nos propomos — os fins que orientam tudo o que a Associação faz."
        title="Objectivos"
      />

      <ol className="mt-16 space-y-6">
        {OBJECTIVOS.map((o, i) => (
          <li
            className="premium-shadow flex gap-5 rounded-2xl border border-border bg-card p-7"
            key={o.titulo}
          >
            <span className="font-display text-[24px] text-accent/50 leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-[20px] text-primary leading-snug">
                {o.titulo}
              </h2>
              <p className="mt-2 font-body text-[15px] text-foreground/75 leading-relaxed">
                {o.texto}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <JoinCTA lead="Partilha destes objectivos?" />
      </div>
    </article>
  );
}
