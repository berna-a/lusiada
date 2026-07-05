import { useMutation, useQuery } from "convex/react";
import { Eye, EyeOff, Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "../../../convex/_generated/api";

const CATEGORIES = [
  { value: "estatutos", label: "Estatutos" },
  { value: "atas", label: "Actas" },
  { value: "institucional", label: "Institucional" },
  { value: "outros", label: "Outros" },
];

const EMPTY_EVENT = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  link: "",
};

export default function AdminPortalPage() {
  const documents = useQuery(api.memberArea.adminListDocuments);
  const events = useQuery(api.memberArea.adminListEvents);
  const generateUploadUrl = useMutation(api.memberArea.generateUploadUrl);
  const addDocument = useMutation(api.memberArea.adminAddDocument);
  const setDocPublished = useMutation(api.memberArea.adminSetDocumentPublished);
  const removeDocument = useMutation(api.memberArea.adminRemoveDocument);
  const addEvent = useMutation(api.memberArea.adminAddEvent);
  const setEventPublished = useMutation(api.memberArea.adminSetEventPublished);
  const removeEvent = useMutation(api.memberArea.adminRemoveEvent);

  // ── Documentos ──
  const fileRef = useRef<HTMLInputElement>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docDescription, setDocDescription] = useState("");
  const [docCategory, setDocCategory] = useState("institucional");
  const [docError, setDocError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const submitDocument = async () => {
    setDocError(null);
    const file = fileRef.current?.files?.[0];
    if (docTitle.trim().length < 2) {
      setDocError("Indique o título do documento.");
      return;
    }
    if (!file) {
      setDocError("Escolha o ficheiro a carregar.");
      return;
    }
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!res.ok) {
        throw new Error("Falha no upload do ficheiro.");
      }
      const { storageId } = (await res.json()) as { storageId: string };
      await addDocument({
        title: docTitle,
        description: docDescription.trim() || undefined,
        category: docCategory,
        fileId: storageId as Parameters<typeof addDocument>[0]["fileId"],
      });
      setDocTitle("");
      setDocDescription("");
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (e) {
      setDocError(
        e instanceof Error ? e.message : "Não foi possível carregar."
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Encontros ──
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [eventError, setEventError] = useState<string | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  const updateEvent = (field: keyof typeof EMPTY_EVENT, value: string) =>
    setEventForm((f) => ({ ...f, [field]: value }));

  const submitEvent = async () => {
    setEventError(null);
    if (eventForm.title.trim().length < 2) {
      setEventError("Indique o título do encontro.");
      return;
    }
    if (!eventForm.date) {
      setEventError("Indique a data.");
      return;
    }
    setSavingEvent(true);
    try {
      await addEvent({
        title: eventForm.title,
        description: eventForm.description.trim() || undefined,
        date: eventForm.date,
        time: eventForm.time.trim() || undefined,
        location: eventForm.location.trim() || undefined,
        link: eventForm.link.trim() || undefined,
      });
      setEventForm(EMPTY_EVENT);
    } catch (e) {
      setEventError(e instanceof Error ? e.message : "Não foi possível criar.");
    } finally {
      setSavingEvent(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-primary">Portal de Sócios</h1>
        <p className="mt-1 font-body text-muted-foreground text-sm">
          Gira os documentos e os encontros visíveis na área reservada.
        </p>
      </header>

      {/* Novo documento */}
      <section className="premium-shadow rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-display text-lg text-primary">
          <Upload className="h-4 w-4 text-accent" /> Novo documento
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="doc-title">
              Título
            </Label>
            <Input
              id="doc-title"
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Ex.: Estatutos da Associação"
              value={docTitle}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="doc-category">
              Categoria
            </Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
              id="doc-category"
              onChange={(e) => setDocCategory(e.target.value)}
              value={docCategory}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs" htmlFor="doc-description">
              Descrição{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="doc-description"
              onChange={(e) => setDocDescription(e.target.value)}
              placeholder="Ex.: Versão aprovada em Assembleia Geral"
              value={docDescription}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs" htmlFor="doc-file">
              Ficheiro
            </Label>
            <Input id="doc-file" ref={fileRef} type="file" />
          </div>
        </div>
        {docError && (
          <p className="mt-4 font-body text-destructive text-sm" role="alert">
            {docError}
          </p>
        )}
        <Button
          className="mt-5"
          disabled={uploading}
          onClick={submitDocument}
          variant="accent"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A carregar…
            </>
          ) : (
            "Carregar documento"
          )}
        </Button>
      </section>

      {/* Lista de documentos */}
      <section className="mt-8">
        <h2 className="mb-3 font-body text-muted-foreground text-xs uppercase tracking-[0.2em]">
          {documents?.length ?? 0} documento(s)
        </h2>
        {documents === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : (
          <ul className="space-y-2">
            {documents.map((d) => (
              <li
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                key={d._id}
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-foreground">
                    {d.title}
                  </p>
                  <p className="font-body text-muted-foreground text-xs">
                    {CATEGORIES.find((c) => c.value === d.category)?.label ??
                      d.category}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                      d.is_published
                        ? "border-accent/40 text-accent"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() =>
                      setDocPublished({
                        id: d._id,
                        is_published: !d.is_published,
                      })
                    }
                    type="button"
                  >
                    {d.is_published ? (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Publicado
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Oculto
                      </>
                    )}
                  </button>
                  <button
                    aria-label={`Eliminar ${d.title}`}
                    className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Eliminar "${d.title}"? O ficheiro é apagado definitivamente.`
                        )
                      ) {
                        removeDocument({ id: d._id });
                      }
                    }}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Novo encontro */}
      <section className="premium-shadow mt-12 rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 font-display text-lg text-primary">
          <Plus className="h-4 w-4 text-accent" /> Novo encontro
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ev-title">
              Título
            </Label>
            <Input
              id="ev-title"
              onChange={(e) => updateEvent("title", e.target.value)}
              placeholder="Ex.: Tertúlia de Outubro — Lisboa"
              value={eventForm.title}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ev-date">
              Data
            </Label>
            <Input
              id="ev-date"
              onChange={(e) => updateEvent("date", e.target.value)}
              type="date"
              value={eventForm.date}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ev-time">
              Hora <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="ev-time"
              onChange={(e) => updateEvent("time", e.target.value)}
              type="time"
              value={eventForm.time}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs" htmlFor="ev-location">
              Local <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="ev-location"
              onChange={(e) => updateEvent("location", e.target.value)}
              placeholder="Ex.: Largo Camões, Lisboa"
              value={eventForm.location}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs" htmlFor="ev-description">
              Descrição{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="ev-description"
              onChange={(e) => updateEvent("description", e.target.value)}
              placeholder="Breve descrição do encontro"
              value={eventForm.description}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs" htmlFor="ev-link">
              Ligação <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Input
              id="ev-link"
              onChange={(e) => updateEvent("link", e.target.value)}
              placeholder="https://…"
              value={eventForm.link}
            />
          </div>
        </div>
        {eventError && (
          <p className="mt-4 font-body text-destructive text-sm" role="alert">
            {eventError}
          </p>
        )}
        <Button
          className="mt-5"
          disabled={savingEvent}
          onClick={submitEvent}
          variant="accent"
        >
          {savingEvent ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A guardar…
            </>
          ) : (
            "Criar encontro"
          )}
        </Button>
      </section>

      {/* Lista de encontros */}
      <section className="mt-8">
        <h2 className="mb-3 font-body text-muted-foreground text-xs uppercase tracking-[0.2em]">
          {events?.length ?? 0} encontro(s)
        </h2>
        {events === undefined ? (
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        ) : (
          <ul className="space-y-2">
            {events.map((e) => (
              <li
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3"
                key={e._id}
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-foreground">
                    {e.title}
                  </p>
                  <p className="font-body text-muted-foreground text-xs">
                    {[e.date, e.time, e.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                      e.is_published
                        ? "border-accent/40 text-accent"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() =>
                      setEventPublished({
                        id: e._id,
                        is_published: !e.is_published,
                      })
                    }
                    type="button"
                  >
                    {e.is_published ? (
                      <>
                        <Eye className="h-3.5 w-3.5" /> Publicado
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5" /> Oculto
                      </>
                    )}
                  </button>
                  <button
                    aria-label={`Eliminar ${e.title}`}
                    className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                    onClick={() => {
                      if (window.confirm(`Eliminar "${e.title}"?`)) {
                        removeEvent({ id: e._id });
                      }
                    }}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
