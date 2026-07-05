const stats = [
  { value: "24", label: "Eventos Realizados" },
  { value: "312", label: "Memórias Recolhidas" },
  { value: "87", label: "Heróis Publicados" },
  { value: "46", label: "Lugares Adicionados" },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-14 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,hsl(var(--electric)/0.08),transparent)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="font-body font-medium text-primary-foreground/40 text-xs uppercase tracking-[0.3em]">
            Prova de Vida
          </p>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div className="space-y-1 text-center" key={stat.label}>
              <p className="font-bold font-display text-4xl text-accent md:text-5xl">
                {stat.value}
              </p>
              <p className="font-body text-primary-foreground/50 text-xs uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
