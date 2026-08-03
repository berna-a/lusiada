import { useMutation, useQuery } from "convex/react";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

type Status = "pending" | "approved" | "rejected";

const TABS: { value: Status; label: string }[] = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Rejeitados" },
];

const ESTADO_LABEL: Record<string, string> = {
  integro: "Íntegro",
  danificado: "Danificado",
  em_risco: "Em risco",
  desaparecido: "Desaparecido",
};

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAzulejosPage() {
  const [tab, setTab] = useState<Status>("pending");
  const items = useQuery(api.azulejos.adminList, { status: tab });
  const setStatus = useMutation(api.azulejos.adminSetStatus);
  const remove = useMutation(api.azulejos.adminDelete);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">
          Moderação de Azulejos
        </h1>
        <p className="mt-1 font-body text-muted-foreground text-sm">
          Aprove ou rejeite os painéis submetidos para o mapa.
        </p>
      </header>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            className={`rounded-full border px-4 py-1.5 font-body text-sm transition-colors ${
              tab === t.value
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
            key={t.value}
            onClick={() => setTab(t.value)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {items === undefined && (
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      )}

      {items?.length === 0 && (
        <p className="py-8 text-center font-body text-muted-foreground text-sm italic">
          Sem painéis neste estado.
        </p>
      )}

      <ul className="space-y-4">
        {items?.map((a) => (
          <li
            className="rounded-2xl border border-border bg-card p-5"
            key={a._id}
          >
            <div className="flex items-center justify-between">
              <p className="font-body text-muted-foreground text-xs uppercase tracking-[0.15em]">
                {a.morada ?? a.concelho ?? "Sem morada"} ·{" "}
                {a.authorName ?? "Anónimo"} · {formatDate(a.createdAt)}
              </p>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 font-body text-[11px] text-foreground/70 uppercase tracking-[0.1em]">
                {ESTADO_LABEL[a.estado] ?? a.estado}
              </span>
            </div>
            {a.imageUrl && (
              <img
                alt={a.morada ?? "Painel de azulejo"}
                className="mt-3 max-h-72 rounded-lg object-cover"
                src={a.imageUrl}
              />
            )}
            <p className="mt-2 font-body text-[13px] text-muted-foreground">
              {a.lat.toFixed(5)}, {a.lng.toFixed(5)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {a.status !== "approved" && (
                <Button
                  onClick={() => setStatus({ id: a._id, status: "approved" })}
                  size="sm"
                  variant="accent"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Aprovar
                </Button>
              )}
              {a.status !== "rejected" && (
                <Button
                  onClick={() => setStatus({ id: a._id, status: "rejected" })}
                  size="sm"
                  variant="outline"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" /> Rejeitar
                </Button>
              )}
              <Button
                className="text-destructive hover:text-destructive"
                onClick={() => remove({ id: a._id })}
                size="sm"
                variant="ghost"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
