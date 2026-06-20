import { useConvex, useMutation } from "convex/react";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { CATEGORIES, INFOBOX_SUGGESTIONS } from "./constants";
import { RichTextEditor } from "./RichTextEditor";

export type ArticleFormData = {
  title: string;
  category: string;
  tags: string[];
  summary?: string;
  body: string;
  coverImageId?: Id<"_storage">;
  infobox: { label: string; value: string }[];
  sources: { label: string; url?: string }[];
};

type Initial = {
  title?: string;
  category?: string;
  tags?: string[];
  summary?: string | null;
  body?: string;
  coverUrl?: string | null;
  infobox?: { label: string; value: string }[];
  sources?: { label: string; url?: string | null }[];
};

type ArticleFormProps = {
  initial?: Initial;
  submitLabel: string;
  onSubmit: (data: ArticleFormData) => Promise<void>;
};

export function ArticleForm({
  initial,
  submitLabel,
  onSubmit,
}: ArticleFormProps) {
  const generateUploadUrl = useMutation(api.articles.generateUploadUrl);
  const convex = useConvex();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [coverImageId, setCoverImageId] = useState<
    Id<"_storage"> | undefined
  >();
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initial?.coverUrl ?? null
  );
  const [infobox, setInfobox] = useState<{ label: string; value: string }[]>(
    initial?.infobox ?? []
  );
  const [sources, setSources] = useState<{ label: string; url?: string }[]>(
    (initial?.sources ?? []).map((s) => ({ label: s.label, url: s.url ?? "" }))
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onCategory = (c: string) => {
    setCategory(c);
    if (infobox.length === 0) {
      setInfobox(
        (INFOBOX_SUGGESTIONS[c] ?? []).map((label) => ({ label, value: "" }))
      );
    }
  };

  const uploadCover = async (file: File) => {
    const url = await generateUploadUrl();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) {
      return;
    }
    const { storageId } = await res.json();
    setCoverImageId(storageId);
    const publicUrl = await convex.query(api.articles.imageUrl, { storageId });
    setCoverPreview(publicUrl ?? null);
  };

  const submit = async () => {
    setError(null);
    if (title.trim().length < 2) {
      setError("Indique o título.");
      return;
    }
    if (!category) {
      setError("Escolha uma categoria.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        tags: tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        summary: summary.trim() || undefined,
        body,
        coverImageId,
        infobox: infobox.filter((r) => r.label.trim() && r.value.trim()),
        sources: sources
          .filter((s) => s.label.trim())
          .map((s) => ({
            label: s.label.trim(),
            url: s.url?.trim() || undefined,
          })),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível guardar.");
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Saudade"
            value={title}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Categoria</Label>
          <Select onValueChange={onCategory} value={category}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Escolha uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tags">
            Etiquetas <span className="text-muted-foreground">(vírgulas)</span>
          </Label>
          <Input
            id="tags"
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="poesia, sentimento"
            value={tagsText}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="summary">
          Resumo <span className="text-muted-foreground">(1-2 frases)</span>
        </Label>
        <Textarea
          id="summary"
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          value={summary}
        />
      </div>

      {/* Imagem de capa */}
      <div className="space-y-2">
        <Label>Imagem de capa</Label>
        <div className="flex items-center gap-4">
          {coverPreview && (
            <img
              alt="Capa"
              className="h-20 w-32 rounded-lg object-cover"
              src={coverPreview}
            />
          )}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 font-body text-[13px] text-foreground/70 transition-colors hover:border-accent/50 hover:text-accent">
            <ImagePlus className="h-4 w-4" />
            {coverPreview ? "Trocar" : "Adicionar"}
            <input
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  uploadCover(file);
                }
              }}
              type="file"
            />
          </label>
        </div>
      </div>

      {/* Ficha lateral */}
      <RowEditor
        addLabel="Adicionar campo"
        cols={["Campo", "Valor"]}
        label="Ficha lateral"
        onChange={(rows) =>
          setInfobox(rows.map((r) => ({ label: r[0], value: r[1] })))
        }
        rows={infobox.map((r) => [r.label, r.value])}
      />

      {/* Corpo */}
      <div className="space-y-1.5">
        <Label>Conteúdo</Label>
        <RichTextEditor onChange={setBody} value={body} />
      </div>

      {/* Fontes */}
      <RowEditor
        addLabel="Adicionar fonte"
        cols={["Fonte", "Link (opcional)"]}
        label="Fontes"
        onChange={(rows) =>
          setSources(rows.map((r) => ({ label: r[0], url: r[1] })))
        }
        rows={sources.map((s) => [s.label, s.url ?? ""])}
      />

      {error && (
        <p className="font-body text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <Button disabled={saving} onClick={submit} variant="accent">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A guardar…
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}

function RowEditor({
  label,
  cols,
  rows,
  addLabel,
  onChange,
}: {
  label: string;
  cols: [string, string];
  rows: [string, string][];
  addLabel: string;
  onChange: (rows: [string, string][]) => void;
}) {
  const update = (i: number, j: 0 | 1, value: string) => {
    const next = rows.map((r, idx) =>
      idx === i
        ? ((j === 0 ? [value, r[1]] : [r[0], value]) as [string, string])
        : r
    );
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div className="flex items-center gap-2" key={i}>
            <Input
              onChange={(e) => update(i, 0, e.target.value)}
              placeholder={cols[0]}
              value={r[0]}
            />
            <Input
              onChange={(e) => update(i, 1, e.target.value)}
              placeholder={cols[1]}
              value={r[1]}
            />
            <button
              aria-label="Remover"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        className="inline-flex items-center gap-1.5 font-body text-[13px] text-accent hover:underline"
        onClick={() => onChange([...rows, ["", ""]])}
        type="button"
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}
