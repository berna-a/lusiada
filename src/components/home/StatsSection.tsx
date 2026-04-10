const stats = [
  { value: "24", label: "Eventos Realizados" },
  { value: "312", label: "Memórias Recolhidas" },
  { value: "87", label: "Heróis Publicados" },
  { value: "46", label: "Lugares Adicionados" },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">Prova de Vida</h2>
          <p className="text-primary-foreground/70">Números que mostram o nosso trabalho.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
