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

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminModeracaoPage() {
  const [tab, setTab] = useState<Status>("pending");
  const items = useQuery(api.contributions.adminList, { status: tab });
  const setStatus = useMutation(api.contributions.adminSetStatus);
  const remove = useMutation(api.contributions.adminDelete);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">
          Moderação de Memórias
        </h1>
        <p className="mt-1 font-body text-muted-foreground text-sm">
          Aprove ou rejeite as memórias submetidas pela comunidade.
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
          Sem memórias neste estado.
        </p>
      )}

      <ul className="space-y-4">
        {items?.map((m) => (
          <li
            className="rounded-2xl border border-border bg-card p-5"
            key={m._id}
          >
            <div className="flex items-center justify-between">
              <p className="font-body text-muted-foreground text-xs uppercase tracking-[0.15em]">
                {m.figureName} · {m.authorName ?? "Anónimo"} ·{" "}
                {formatDate(m.createdAt)}
              </p>
            </div>
            <p className="mt-3 whitespace-pre-line font-body text-[15px] text-foreground/85 leading-relaxed">
              {m.body}
            </p>
            {m.imageUrl && (
              <img
                alt="Memória submetida"
                className="mt-3 max-h-72 rounded-lg object-cover"
                src={m.imageUrl}
              />
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {m.status !== "approved" && (
                <Button
                  onClick={() => setStatus({ id: m._id, status: "approved" })}
                  size="sm"
                  variant="accent"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" /> Aprovar
                </Button>
              )}
              {m.status !== "rejected" && (
                <Button
                  onClick={() => setStatus({ id: m._id, status: "rejected" })}
                  size="sm"
                  variant="outline"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" /> Rejeitar
                </Button>
              )}
              <Button
                className="text-destructive hover:text-destructive"
                onClick={() => remove({ id: m._id })}
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
