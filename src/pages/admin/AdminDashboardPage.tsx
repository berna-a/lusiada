import { useMutation, useQuery } from "convex/react";
import { Eye, EyeOff, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../convex/_generated/api";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY = {
  name: "",
  slug: "",
  epithet: "",
  category: "",
  era: "",
  birth_year: "",
  death_year: "",
};

export default function AdminDashboardPage() {
  const figures = useQuery(api.figures.adminList);
  const create = useMutation(api.figures.adminCreate);
  const setPublished = useMutation(api.figures.adminSetPublished);

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (field: keyof typeof EMPTY, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    setError(null);
    const name = form.name.trim();
    if (name.length < 2) {
      setError("Indique o nome do herói.");
      return;
    }
    const slug = form.slug.trim() ? slugify(form.slug) : slugify(name);
    setSaving(true);
    try {
      await create({
        name,
        slug,
        epithet: form.epithet.trim() || undefined,
        category: form.category.trim() || undefined,
        era: form.era.trim() || undefined,
        birth_year: form.birth_year.trim() || undefined,
        death_year: form.death_year.trim() || undefined,
      });
      setForm(EMPTY);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível criar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-primary">
          Heróis do Panteão
        </h1>
        <p className="mt-1 font-body text-muted-foreground text-sm">
          Adicione figuras e controle o que está publicado no Panteão.
        </p>
      </header>

      {/* Criar novo herói */}
      <section className="premium-shadow rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-display text-lg text-primary">
          <Plus className="h-4 w-4 text-accent" /> Novo herói
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="name">
              Nome
            </Label>
            <Input
              id="name"
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ex.: Infante D. Henrique"
              value={form.name}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="epithet">
              Epíteto <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="epithet"
              onChange={(e) => update("epithet", e.target.value)}
              placeholder="Ex.: O Navegador"
              value={form.epithet}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="category">
              Categoria
            </Label>
            <Input
              id="category"
              onChange={(e) => update("category", e.target.value)}
              placeholder="Ex.: Navegador"
              value={form.category}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="era">
              Época
            </Label>
            <Input
              id="era"
              onChange={(e) => update("era", e.target.value)}
              placeholder="Ex.: Século XV"
              value={form.era}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="birth">
              Nascimento
            </Label>
            <Input
              id="birth"
              onChange={(e) => update("birth_year", e.target.value)}
              placeholder="Ex.: 1394"
              value={form.birth_year}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="death">
              Morte
            </Label>
            <Input
              id="death"
              onChange={(e) => update("death_year", e.target.value)}
              placeholder="Ex.: 1460"
              value={form.death_year}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 font-body text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        <Button
          className="mt-5"
          disabled={saving}
          onClick={submit}
          variant="accent"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A guardar…
            </>
          ) : (
            "Criar herói"
          )}
        </Button>
      </section>

      {/* Lista */}
      <section className="mt-8">
        <h2 className="mb-3 font-body text-muted-foreground text-xs uppercase tracking-[0.2em]">
          {figures?.length ?? 0} herói(s)
        </h2>
        {figures === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : (
          <ul className="space-y-2">
            {figures.map((f) => (
              <li
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                key={f._id}
              >
                <div>
                  <p className="font-display text-foreground">{f.name}</p>
                  <p className="font-body text-muted-foreground text-xs">
                    {[f.category, f.slug].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                    f.is_published
                      ? "border-accent/40 text-accent"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() =>
                    setPublished({ id: f._id, is_published: !f.is_published })
                  }
                  type="button"
                >
                  {f.is_published ? (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Publicado
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Oculto
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
