import { useQuery } from "convex/react";
import { Landmark, Loader2 } from "lucide-react";
import { PanteaoHall } from "@/components/arca/PanteaoHall";
import { PageHeader } from "@/components/PageHeader";
import { api } from "../../../convex/_generated/api";

export default function PanteaoPage() {
  const figuras = useQuery(api.figures.list);

  // Carregamento — fundo escuro, coerente com a sala.
  if (figuras === undefined) {
    return (
      <div
        className="-mx-4 -mt-4 flex min-h-screen items-center justify-center sm:-mx-6 sm:-mt-6 md:-mx-10 md:-mt-10"
        data-nav-theme="dark"
        style={{
          background: "radial-gradient(120% 80% at 50% 0%, #14365c, #050d1a)",
        }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  // Vazio — estado informativo.
  if (figuras.length === 0) {
    return (
      <main
        className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
        data-nav-theme="light"
      >
        <PageHeader
          eyebrow="Arca · Memória Lusíada"
          intro="As grandes figuras que moldaram a história de Portugal e da lusofonia."
          title="Panteão"
        />
        <div className="mt-16 rounded-2xl border border-border bg-card p-12 text-center">
          <Landmark className="mx-auto h-8 w-8 text-accent/60" />
          <p className="mt-4 font-display text-primary text-xl">Em breve</p>
          <p className="mt-2 font-body text-muted-foreground text-sm">
            As primeiras figuras do Panteão estão a ser preparadas.
          </p>
        </div>
      </main>
    );
  }

  return <PanteaoHall figures={figuras} />;
}
