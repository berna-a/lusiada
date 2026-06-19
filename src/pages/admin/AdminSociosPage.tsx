import { useMutation, useQuery } from "convex/react";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

type Status = "pending" | "active" | "rejected";

const TABS: { value: Status; label: string }[] = [
  { value: "pending", label: "Pendentes" },
  { value: "active", label: "Sócios" },
  { value: "rejected", label: "Rejeitados" },
];

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminSociosPage() {
  const [tab, setTab] = useState<Status>("pending");
  const members = useQuery(api.memberships.adminListMembers, { status: tab });
  const setStatus = useMutation(api.memberships.adminSetMemberStatus);
  const setQuota = useMutation(api.memberships.adminSetQuotaPaid);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl text-primary">Sócios</h1>
        <p className="mt-1 font-body text-muted-foreground text-sm">
          Aprove pedidos de adesão e faça a gestão dos sócios.
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

      {members === undefined && (
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      )}

      {members?.length === 0 && (
        <p className="py-8 text-center font-body text-muted-foreground text-sm italic">
          Sem registos neste estado.
        </p>
      )}

      <ul className="space-y-4">
        {members?.map((m) => (
          <li
            className="rounded-2xl border border-border bg-card p-5"
            key={m._id}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-display text-foreground text-lg">
                {m.full_name}
              </p>
              <span className="font-body text-muted-foreground text-xs uppercase tracking-[0.15em]">
                {formatDate(m.createdAt)}
              </span>
            </div>
            <p className="mt-1 font-body text-muted-foreground text-sm">
              {[m.email, m.district].filter(Boolean).join(" · ")}
            </p>
            {m.motivation && (
              <p className="mt-3 whitespace-pre-line font-body text-[14px] text-foreground/80 leading-relaxed">
                “{m.motivation}”
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {m.status !== "active" && (
                <Button
                  onClick={() => setStatus({ id: m._id, status: "active" })}
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
              <button
                className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                  m.quota_paid
                    ? "border-accent/40 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                onClick={() =>
                  setQuota({ id: m._id, quota_paid: !m.quota_paid })
                }
                type="button"
              >
                {m.quota_paid ? "Quota paga ✓" : "Marcar quota paga"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
