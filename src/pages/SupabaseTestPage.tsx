import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Figure = Pick<Database["public"]["Tables"]["figures"]["Row"], "id" | "name" | "slug">;

export default function SupabaseTestPage() {
  const [figures, setFigures] = useState<Figure[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("figures")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (error) {
        setError(`${error.code ?? "ERR"}: ${error.message}${error.hint ? ` — ${error.hint}` : ""}`);
      } else {
        setFigures(data);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <main className="container mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
      <p className="text-muted-foreground mb-6">
        Reading <code className="px-1 py-0.5 rounded bg-muted">figures</code> table via the typed client.
      </p>

      {loading && <p>Loading…</p>}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-semibold mb-1">Query failed</p>
          <pre className="text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {figures && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            ✅ Connection OK — {figures.length} row{figures.length === 1 ? "" : "s"} returned.
          </p>
          <ul className="divide-y divide-border rounded-md border">
            {figures.map((f) => (
              <li key={f.id} className="px-4 py-3 flex justify-between gap-4">
                <span className="font-medium">{f.name}</span>
                <code className="text-sm text-muted-foreground">{f.slug}</code>
              </li>
            ))}
            {figures.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground">
                Query succeeded but returned 0 rows (RLS may be filtering, or table is empty).
              </li>
            )}
          </ul>
        </>
      )}
    </main>
  );
}