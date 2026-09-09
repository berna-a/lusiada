import { CalendarDays, History } from "lucide-react";

const emptySections = [
  {
    icon: CalendarDays,
    title: "Eventos futuros",
    text: "Ainda não há eventos públicos confirmados para anunciar.",
  },
  {
    icon: History,
    title: "Histórico de eventos",
    text: "Ainda não há eventos públicos registados nesta agenda.",
  },
];

export default function AgendaPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="font-body text-[11px] text-accent uppercase tracking-[0.24em]">
          Associação Memória Lusíada
        </p>
        <h1 className="mt-3 font-display text-4xl text-foreground sm:text-5xl">
          Agenda pública
        </h1>
        <p className="mt-5 font-body text-base text-muted-foreground leading-relaxed">
          Esta página reúne apenas anúncios públicos da Associação. Quando um
          torneio ou encontro for anunciado, os detalhes de acesso privado não
          serão aqui publicados.
        </p>
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {emptySections.map(({ icon: Icon, title, text }) => (
          <section
            className="rounded-2xl border border-border bg-card p-7"
            key={title}
          >
            <Icon aria-hidden="true" className="h-5 w-5 text-accent" />
            <h2 className="mt-5 font-display text-2xl text-foreground">
              {title}
            </h2>
            <p className="mt-3 font-body text-muted-foreground leading-relaxed">
              {text}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
