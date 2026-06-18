import { useQuery } from "convex/react";
import { Landmark } from "lucide-react";
import { FigureCard } from "@/components/arca/FigureCard";
import { PageHeader } from "@/components/PageHeader";
import { api } from "../../../convex/_generated/api";

export default function PanteaoPage() {
  const figuras = useQuery(api.figures.list);
  const loading = figuras === undefined;

  return (
    <main
      className="mx-auto max-w-[1000px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Arca · Memória Lusíada"
        intro="As grandes figuras que moldaram a história de Portugal e da lusofonia — a sua vida, a sua obra, a sua memória."
        title="Panteão"
      />

      <section className="mt-16">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["s1", "s2", "s3"].map((k) => (
              <div
                className="h-56 animate-pulse rounded-2xl border border-border bg-card/50"
                key={k}
              />
            ))}
          </div>
        )}

        {!loading && figuras.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Landmark className="mx-auto h-8 w-8 text-accent/60" />
            <p className="mt-4 font-display text-primary text-xl">Em breve</p>
            <p className="mt-2 font-body text-muted-foreground text-sm">
              As primeiras figuras do Panteão estão a ser preparadas.
            </p>
          </div>
        )}

        {!loading && figuras.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {figuras.map((f) => (
              <FigureCard figure={f} key={f._id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
