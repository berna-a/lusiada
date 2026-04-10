const stats = [
  { value: "24", label: "Eventos Realizados" },
  { value: "312", label: "Memórias Recolhidas" },
  { value: "87", label: "Heróis Publicados" },
  { value: "46", label: "Lugares Adicionados" },
];

export function StatsSection() {
  return (
    <section className="py-14 md:py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,hsl(var(--electric)/0.08),transparent)]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/40 font-body font-medium">Prova de Vida</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-4xl md:text-5xl font-bold text-accent font-display">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/50 font-body">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
