import { useMutation, useQuery } from "convex/react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  LayoutList,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MindGamesArtwork } from "@/components/MindGamesArtwork";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  confirmDemoContribution,
  type DemoProject,
  euros,
  PIONEER_PROJECT,
  type ProjectStatus,
  readDemoState,
  resetDemoState,
  revokeDemoContribution,
  STATUS_LABELS,
  SUPPORT_LABELS,
  saveDemoProject,
  validateDemoProject,
} from "@/lib/projects";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type EditorTab = "essential" | "story" | "needs" | "updates" | "support";
type Screen = "overview" | "editor";
type Form = {
  originalSlug?: string;
  id?: Id<"funded_projects">;
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  cover: string;
  goal: string;
  status: ProjectStatus;
  budget: string;
  materials: string;
  technical: string;
  volunteers: string;
  updateTitle: string;
  updateBody: string;
  updates: DemoProject["updates"];
  published: boolean;
};
type ProjectAdminRow = DemoProject & {
  _id?: Id<"funded_projects">;
  cover_image_url?: string | null;
  goal_cents?: number;
  budget_note?: string | null;
  material_needs?: string[];
  technical_needs?: string[];
  volunteer_needs?: string[];
  is_published?: boolean;
};
type ContributionAdminRow = {
  id?: string;
  _id?: Id<"project_contributions">;
  projectSlug?: string;
  project_id?: Id<"funded_projects">;
  amountCents?: number;
  amount_cents?: number;
  provider: string;
  reference?: string;
  provider_reference?: string;
  revokedAt?: number | null;
  revoked_at?: number | null;
};
const blankForm = (): Form => ({
  slug: "",
  eyebrow: "",
  title: "",
  summary: "",
  description: "",
  cover: "",
  goal: "0",
  status: "preparing",
  budget: "",
  materials: "",
  technical: "",
  volunteers: "",
  updateTitle: "",
  updateBody: "",
  updates: [],
  published: false,
});
const lines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
const fromProject = (project: ProjectAdminRow): Form => ({
  originalSlug: project.slug,
  id: project._id,
  slug: project.slug,
  eyebrow: project.eyebrow ?? "",
  title: project.title,
  summary: project.summary,
  description: project.description,
  cover: project.coverImageUrl ?? project.cover_image_url ?? "",
  goal: String((project.goalCents ?? project.goal_cents) / 100),
  status: project.status,
  budget: project.budgetNote ?? project.budget_note ?? "",
  materials: (project.materialNeeds ?? project.material_needs).join("\n"),
  technical: (project.technicalNeeds ?? project.technical_needs).join("\n"),
  volunteers: (project.volunteerNeeds ?? project.volunteer_needs).join("\n"),
  updateTitle: "",
  updateBody: "",
  updates: project.updates ?? [],
  published: project.isPublished ?? project.is_published,
});
const editorTabs: { value: EditorTab; label: string }[] = [
  { value: "essential", label: "Essencial" },
  { value: "story", label: "História" },
  { value: "needs", label: "Necessidades" },
  { value: "updates", label: "Actualizações" },
  { value: "support", label: "Apoios" },
];
const fieldClass =
  "mt-2 rounded-none border-primary/20 bg-card focus-visible:ring-primary";

export default function AdminProjectosPage({
  demoMode = false,
}: {
  demoMode?: boolean;
}) {
  const remote = useQuery(api.projects.adminList, demoMode ? "skip" : {});
  const saveRemote = useMutation(api.projects.adminSave);
  const confirmRemote = useMutation(api.projects.adminConfirmContribution);
  const revokeRemote = useMutation(api.projects.adminRevokeContribution);
  const setIntentStatus = useMutation(api.projects.adminSetIntentStatus);
  const [demoRevision, setDemoRevision] = useState(0);
  const demo = useMemo(() => readDemoState(), [demoRevision]);
  const projects = (demoMode ? demo.projects : remote?.projects) as
    | ProjectAdminRow[]
    | undefined;
  const contributions = (
    demoMode ? demo.contributions : remote?.contributions
  ) as ContributionAdminRow[] | undefined;
  const intents = demoMode ? [] : remote?.intents;
  const [screen, setScreen] = useState<Screen>("overview");
  const [tab, setTab] = useState<EditorTab>("essential");
  const [form, setForm] = useState<Form>(blankForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>(
    "all"
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [receipt, setReceipt] = useState({
    amount: "",
    provider: "",
    reference: "",
  });
  const initialized = useRef(false);
  const previewButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!initialized.current && projects?.length) {
      initialized.current = true;
      setForm(fromProject(projects[0]));
    }
  }, [projects]);
  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) {
        return;
      }
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [dirty]);
  const visibleProjects = useMemo(
    () =>
      (projects ?? []).filter(
        (project) =>
          (statusFilter === "all" || project.status === statusFilter) &&
          `${project.title} ${project.slug}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
      ),
    [projects, query, statusFilter]
  );
  const activeContributions = (contributions ?? []).filter(
    (item) => !(item.revokedAt ?? item.revoked_at)
  );
  const totals = {
    projects: projects?.length ?? 0,
    published: (projects ?? []).filter(
      (item) => item.isPublished ?? item.is_published
    ).length,
    confirmed: activeContributions.reduce(
      (sum, item) => sum + (item.amountCents ?? item.amount_cents ?? 0),
      0
    ),
    intents: intents?.filter((item) => item.status === "new").length ?? 0,
  };
  const update = (key: keyof Form, value: Form[keyof Form]) => {
    setSaved(false);
    setDirty(true);
    setForm((old) => ({ ...old, [key]: value }));
  };
  const mayDiscard = () =>
    !dirty ||
    window.confirm("Há alterações por guardar. Quer descartá-las e continuar?");
  useEffect(() => {
    const protectInternalLinks = (event: MouseEvent) => {
      if (!dirty || event.defaultPrevented || event.button !== 0) {
        return;
      }
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") {
        return;
      }
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) {
        return;
      }
      if (mayDiscard()) {
        setDirty(false);
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", protectInternalLinks, true);
    return () =>
      document.removeEventListener("click", protectInternalLinks, true);
  }, [dirty]);
  const selectProject = (project: ProjectAdminRow) => {
    if (!mayDiscard()) {
      return;
    }
    setError(null);
    setSaved(false);
    setDirty(false);
    setForm(fromProject(project));
    setTab("essential");
    setScreen("editor");
  };
  const newProject = () => {
    if (!mayDiscard()) {
      return;
    }
    initialized.current = true;
    setError(null);
    setSaved(false);
    setDirty(false);
    setForm(blankForm());
    setTab("essential");
    setScreen("editor");
  };
  const projectValue = (): DemoProject => ({
    slug: form.slug.trim().toLowerCase(),
    eyebrow: form.eyebrow.trim() || null,
    title: form.title.trim(),
    summary: form.summary.trim(),
    description: form.description.trim(),
    coverImageUrl: form.cover.trim() || null,
    status: form.status,
    goalCents: Math.round(Number(form.goal.replace(",", ".")) * 100),
    confirmedCents: 0,
    currency: "EUR",
    budgetNote: form.budget.trim() || null,
    materialNeeds: lines(form.materials),
    technicalNeeds: lines(form.technical),
    volunteerNeeds: lines(form.volunteers),
    updates: form.updates,
    isPublished: form.published,
    updatedAt: Date.now(),
  });
  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const value = projectValue();
      validateDemoProject(value);
      if (demoMode) {
        saveDemoProject(value, form.originalSlug);
        setDemoRevision((revision) => revision + 1);
        setForm(fromProject(value));
      } else {
        const id = await saveRemote({
          id: form.id,
          slug: value.slug,
          eyebrow: value.eyebrow ?? undefined,
          title: value.title,
          summary: value.summary,
          description: value.description,
          coverImageUrl: value.coverImageUrl ?? undefined,
          goalCents: value.goalCents,
          status: value.status,
          budgetNote: value.budgetNote ?? undefined,
          materialNeeds: value.materialNeeds,
          technicalNeeds: value.technicalNeeds,
          volunteerNeeds: value.volunteerNeeds,
          updates: value.updates,
          isPublished: value.isPublished,
        });
        setForm((old) => ({ ...old, id, originalSlug: value.slug }));
      }
      setDirty(false);
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Não foi possível guardar."
      );
    } finally {
      setSaving(false);
    }
  };
  const addUpdate = () => {
    if (
      form.updateTitle.trim().length < 2 ||
      form.updateBody.trim().length < 10
    ) {
      setError("A actualização precisa de título e texto.");
      return;
    }
    update("updates", [
      ...form.updates,
      {
        title: form.updateTitle.trim(),
        body: form.updateBody.trim(),
        publishedAt: Date.now(),
      },
    ]);
    setForm((old) => ({ ...old, updateTitle: "", updateBody: "" }));
  };
  const addReceipt = async () => {
    setError(null);
    const amountCents = Math.round(
      Number(receipt.amount.replace(",", ".")) * 100
    );
    if (
      !(form.originalSlug && Number.isSafeInteger(amountCents)) ||
      amountCents < 1 ||
      receipt.provider.trim().length < 2 ||
      receipt.reference.trim().length < 2
    ) {
      setError(
        "Seleccione e guarde o projecto; depois preencha valor, origem e referência."
      );
      return;
    }
    try {
      if (demoMode) {
        confirmDemoContribution({
          projectSlug: form.originalSlug,
          amountCents,
          provider: receipt.provider.trim(),
          reference: receipt.reference.trim(),
        });
        setDemoRevision((revision) => revision + 1);
      } else {
        await confirmRemote({
          projectId: form.id as Id<"funded_projects">,
          amountCents,
          provider: receipt.provider.trim(),
          reference: receipt.reference.trim(),
        });
      }
      setReceipt({ amount: "", provider: "", reference: "" });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Não foi possível conciliar."
      );
    }
  };
  const revoke = async (id: string) => {
    if (demoMode) {
      revokeDemoContribution(id);
      setDemoRevision((revision) => revision + 1);
    } else {
      await revokeRemote({ id: id as Id<"project_contributions"> });
    }
  };
  if (!demoMode && remote === undefined) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2
          aria-label="A carregar projectos"
          className="h-6 w-6 animate-spin text-primary"
        />
      </div>
    );
  }

  const currentContributions = (contributions ?? []).filter(
    (item) =>
      (item.projectSlug ??
        projects?.find((project) => project._id === item.project_id)?.slug) ===
      form.originalSlug
  );
  const currentConfirmedCents = currentContributions
    .filter((item) => !(item.revokedAt ?? item.revoked_at))
    .reduce(
      (sum, item) => sum + (item.amountCents ?? item.amount_cents ?? 0),
      0
    );
  return (
    <div
      className={`${demoMode ? "min-h-screen bg-background pt-16" : ""} crowdfunding-scope font-sans text-foreground`}
    >
      {demoMode && (
        <div className="border-accent/30 border-b bg-accent/10 px-4 py-3 text-center text-primary text-xs">
          <strong>Ambiente de teste</strong> — alterações guardadas apenas neste
          navegador. Não altera o website público.{" "}
          <Link
            className="underline"
            onClick={(event) => {
              if (!mayDiscard()) {
                event.preventDefault();
              }
            }}
            to="/projectos"
          >
            Ver catálogo
          </Link>
        </div>
      )}
      <div
        className={`mx-auto max-w-[1320px] ${demoMode ? "px-4 py-8 sm:px-6 lg:px-10" : ""}`}
      >
        <header className="flex items-center justify-between gap-3 border-border border-b pb-4 sm:pb-6">
          <div>
            <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
              Gestão de campanhas
            </p>
            <h1 className="mt-1 font-display text-2xl text-primary tracking-[-.015em] sm:mt-2 sm:text-3xl">
              Projectos
            </h1>
          </div>
          <div
            className={`flex flex-wrap gap-2 ${screen === "editor" ? "hidden sm:flex" : ""}`}
          >
            {demoMode && screen === "overview" && (
              <button
                className="border border-primary/20 bg-card px-4 py-2.5 font-semibold text-sm"
                onClick={() => {
                  if (!mayDiscard()) {
                    return;
                  }
                  resetDemoState();
                  setDemoRevision((revision) => revision + 1);
                  setForm(fromProject(PIONEER_PROJECT));
                  setScreen("overview");
                }}
                type="button"
              >
                <RotateCcw className="mr-2 inline h-4 w-4" />
                Repor teste
              </button>
            )}
            {screen === "overview" && (
              <button
                aria-label="Novo"
                className="cf-primary-action px-5 py-2.5 font-display text-xs uppercase tracking-[.08em]"
                onClick={newProject}
                type="button"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Novo projecto
              </button>
            )}
          </div>
        </header>
        {screen === "overview" ? (
          <>
            <section
              aria-label="Resumo"
              className="grid border-border border-b sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                [LayoutList, "Projectos", totals.projects],
                [Eye, "Publicados", totals.published],
                [CircleDollarSign, "Confirmado", euros(totals.confirmed)],
                [BarChart3, "Intenções novas", totals.intents],
              ].map(([Icon, label, value]) => {
                const MetricIcon = Icon as typeof LayoutList;
                return (
                  <div
                    className="border-border border-b px-1 py-6 sm:border-r sm:px-5 lg:border-b-0"
                    key={label as string}
                  >
                    <MetricIcon className="h-5 w-5 text-primary" />
                    <p className="mt-5 text-muted-foreground text-xs uppercase tracking-[.1em]">
                      {label as string}
                    </p>
                    <p className="mt-1 font-semibold text-2xl">
                      {value as string | number}
                    </p>
                  </div>
                );
              })}
            </section>
            <section className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="font-semibold text-xl">Todas as campanhas</h2>
                <div className="flex gap-2">
                  <label className="relative flex-1">
                    <span className="sr-only">Procurar projectos</span>
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="h-10 w-full min-w-0 border border-primary/20 bg-card pr-3 pl-9 text-sm sm:w-64"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Procurar"
                      type="search"
                      value={query}
                    />
                  </label>
                  <select
                    aria-label="Filtrar estado"
                    className="h-10 border border-primary/20 bg-card px-3 text-sm"
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as "all" | ProjectStatus
                      )
                    }
                    value={statusFilter}
                  >
                    <option value="all">Todos os estados</option>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="premium-shadow mt-4 overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead className="bg-secondary/60 text-muted-foreground text-xs uppercase tracking-[.08em]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Campanha</th>
                      <th className="px-4 py-3 font-semibold">Estado</th>
                      <th className="px-4 py-3 font-semibold">Publicação</th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Meta
                      </th>
                      <th className="px-4 py-3">
                        <span className="sr-only">Acção</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleProjects.map((project) => (
                      <tr className="hover:bg-background" key={project.slug}>
                        <td className="px-4 py-4">
                          <button
                            className="text-left"
                            onClick={() => selectProject(project)}
                            type="button"
                          >
                            <strong className="block text-sm">
                              {project.title}
                            </strong>
                            <span className="mt-1 block text-muted-foreground text-xs">
                              /{project.slug}
                            </span>
                          </button>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {STATUS_LABELS[project.status]}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {(project.isPublished ?? project.is_published) ? (
                            <span className="font-semibold text-primary">
                              Publicado
                            </span>
                          ) : (
                            "Rascunho"
                          )}
                        </td>
                        <td className="px-4 py-4 text-right text-sm">
                          {euros(project.goalCents ?? project.goal_cents)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            aria-label={`Editar ${project.title}`}
                            className="border border-primary/20 px-3 py-2 font-semibold text-xs hover:border-primary/30"
                            onClick={() => selectProject(project)}
                            type="button"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visibleProjects.length === 0 && (
                  <div className="px-6 py-14 text-center text-muted-foreground text-sm">
                    Nenhum projecto corresponde à pesquisa.
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="mt-3 sm:mt-6">
            <div className="sticky top-16 z-20 -mx-4 flex items-center justify-between gap-2 border-border border-b bg-background/95 px-4 py-2 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
              <button
                className="inline-flex shrink-0 items-center gap-1 font-semibold text-sm hover:text-primary"
                onClick={() => {
                  if (mayDiscard()) {
                    setScreen("overview");
                  }
                }}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Todas as campanhas</span>
                <span className="sm:hidden">Lista</span>
              </button>
              <div className="flex min-w-0 items-center gap-1 sm:gap-3">
                <span
                  className={`hidden text-xs sm:inline ${dirty ? "text-accent" : "text-muted-foreground"}`}
                >
                  {dirty
                    ? "Alterações por guardar"
                    : saved
                      ? "Guardado"
                      : "Sem alterações"}
                </span>
                <button
                  className="border border-primary/20 bg-card px-3 py-2 font-semibold text-xs sm:px-4 sm:py-2.5 sm:text-sm"
                  onClick={() => setPreviewOpen(true)}
                  ref={previewButtonRef}
                  type="button"
                >
                  <Eye className="mr-1 inline h-4 w-4 sm:mr-2" />
                  Preview
                </button>
                {form.originalSlug && form.published && !dirty && (
                  <Link
                    className="hidden border border-primary/20 bg-card px-4 py-2.5 font-semibold text-sm sm:inline-flex"
                    target="_blank"
                    to={`/projectos/${form.slug}`}
                  >
                    Público
                  </Link>
                )}
                <button
                  aria-label="Guardar projecto"
                  className="cf-primary-action px-3 py-2 font-display text-[11px] uppercase tracking-[.06em] disabled:opacity-60 sm:px-5 sm:py-2.5 sm:text-xs"
                  disabled={saving || !dirty}
                  onClick={submit}
                  type="button"
                >
                  {saving ? (
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1 inline h-4 w-4 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">Guardar</span>
                  <span className="sm:hidden">Guardar</span>
                </button>
              </div>
            </div>
            <nav
              aria-label="Secções do editor no telemóvel"
              className="mt-3 flex overflow-x-auto rounded-xl border border-border bg-card lg:hidden"
            >
              {editorTabs.map((item) => (
                <button
                  aria-current={tab === item.value ? "page" : undefined}
                  className={`shrink-0 border-border border-r px-4 py-3 text-sm ${tab === item.value ? "border-b-2 border-b-accent font-semibold text-primary" : ""}`}
                  key={item.value}
                  onClick={() => setTab(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-3 grid gap-6 sm:mt-6 lg:grid-cols-[220px_1fr]">
              <aside className="hidden lg:block">
                <div className="premium-shadow overflow-hidden rounded-xl border border-border bg-card">
                  <div className="border-border border-b p-4">
                    <p className="text-muted-foreground text-xs">A editar</p>
                    <p className="mt-1 truncate font-semibold text-sm">
                      {form.title || "Novo projecto"}
                    </p>
                  </div>
                  <nav aria-label="Secções do editor">
                    {editorTabs.map((item) => (
                      <button
                        aria-current={tab === item.value ? "page" : undefined}
                        className={`flex w-full items-center justify-between border-border border-b px-4 py-3 text-left text-sm ${tab === item.value ? "border-l-4 border-l-accent bg-accent/10 font-semibold text-primary" : "border-l-4 border-l-transparent hover:bg-background"}`}
                        key={item.value}
                        onClick={() => setTab(item.value)}
                        type="button"
                      >
                        {item.label}
                        <span aria-hidden="true">›</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
              <div className="premium-shadow min-w-0 overflow-hidden rounded-xl border border-border bg-card">
                <div className="border-border border-b px-5 py-4 sm:px-7 sm:py-5">
                  <h2 className="font-semibold text-xl">
                    {editorTabs.find((item) => item.value === tab)?.label}
                  </h2>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {tab === "essential"
                      ? "Identidade, meta, estado e publicação."
                      : tab === "story"
                        ? "Apresente a proposta e o orçamento com clareza."
                        : tab === "needs"
                          ? "Explique de que recursos e pessoas precisa."
                          : tab === "updates"
                            ? "Mantenha a comunidade informada."
                            : "Intenções privadas e recebimentos confirmados."}
                  </p>
                </div>
                <div className="p-5 sm:p-7">
                  {tab === "essential" && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="project-title" label="Título">
                        <Input
                          className={fieldClass}
                          id="project-title"
                          maxLength={120}
                          onChange={(event) =>
                            update("title", event.target.value)
                          }
                          value={form.title}
                        />
                      </Field>
                      <Field id="project-slug" label="Endereço (slug)">
                        <Input
                          className={fieldClass}
                          id="project-slug"
                          maxLength={80}
                          onChange={(event) =>
                            update("slug", event.target.value)
                          }
                          value={form.slug}
                        />
                      </Field>
                      <Field id="project-eyebrow" label="Chapéu editorial">
                        <Input
                          className={fieldClass}
                          id="project-eyebrow"
                          maxLength={80}
                          onChange={(event) =>
                            update("eyebrow", event.target.value)
                          }
                          value={form.eyebrow}
                        />
                      </Field>
                      <Field id="project-goal" label="Meta (€)">
                        <Input
                          className={fieldClass}
                          id="project-goal"
                          inputMode="decimal"
                          onChange={(event) =>
                            update("goal", event.target.value)
                          }
                          value={form.goal}
                        />
                      </Field>
                      <Field
                        className="sm:col-span-2"
                        id="project-summary"
                        label="Resumo"
                      >
                        <Textarea
                          className={fieldClass}
                          id="project-summary"
                          maxLength={320}
                          onChange={(event) =>
                            update("summary", event.target.value)
                          }
                          rows={3}
                          value={form.summary}
                        />
                      </Field>
                      <Field
                        className="sm:col-span-2"
                        hint="HTTPS ou caminho local iniciado por /. Deixe vazio para usar a ilustração da campanha."
                        id="project-cover"
                        label="Capa 16:9"
                      >
                        <Input
                          className={fieldClass}
                          id="project-cover"
                          maxLength={500}
                          onChange={(event) =>
                            update("cover", event.target.value)
                          }
                          value={form.cover}
                        />
                      </Field>
                      <Field id="project-status" label="Estado">
                        <select
                          className={`${fieldClass} h-10 w-full px-3 text-sm`}
                          id="project-status"
                          onChange={(event) =>
                            update(
                              "status",
                              event.target.value as ProjectStatus
                            )
                          }
                          value={form.status}
                        >
                          {Object.entries(STATUS_LABELS).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </Field>
                      <label className="flex items-center gap-3 self-end border border-border bg-background p-4 text-sm">
                        <input
                          aria-label="Publicado"
                          checked={form.published}
                          onChange={(event) =>
                            update("published", event.target.checked)
                          }
                          type="checkbox"
                        />
                        <span>
                          <strong className="block">Publicado</strong>
                          <span className="text-muted-foreground text-xs">
                            Visível no catálogo público
                          </span>
                        </span>
                      </label>
                    </div>
                  )}
                  {tab === "story" && (
                    <div className="space-y-6">
                      <Field
                        hint="Texto principal da página da campanha."
                        id="project-description"
                        label="História"
                      >
                        <Textarea
                          className={fieldClass}
                          id="project-description"
                          maxLength={10_000}
                          onChange={(event) =>
                            update("description", event.target.value)
                          }
                          rows={12}
                          value={form.description}
                        />
                      </Field>
                      <Field
                        hint="Explique o que a meta cobre e o que ainda será confirmado."
                        id="project-budget"
                        label="Nota de orçamento"
                      >
                        <Textarea
                          className={fieldClass}
                          id="project-budget"
                          maxLength={1000}
                          onChange={(event) =>
                            update("budget", event.target.value)
                          }
                          rows={5}
                          value={form.budget}
                        />
                      </Field>
                    </div>
                  )}
                  {tab === "needs" && (
                    <div className="grid gap-6 xl:grid-cols-3">
                      {[
                        [
                          "materials",
                          "Recursos materiais",
                          "Um item por linha",
                        ],
                        [
                          "technical",
                          "Conhecimento técnico",
                          "Competências, regras e logística",
                        ],
                        [
                          "volunteers",
                          "Voluntariado",
                          "Papéis e formas de participação",
                        ],
                      ].map(([key, label, hint]) => (
                        <Field
                          hint={hint}
                          id={`project-${key}`}
                          key={key}
                          label={label}
                        >
                          <Textarea
                            className={fieldClass}
                            id={`project-${key}`}
                            onChange={(event) =>
                              update(key as keyof Form, event.target.value)
                            }
                            rows={12}
                            value={form[key as keyof Form] as string}
                          />
                        </Field>
                      ))}
                    </div>
                  )}
                  {tab === "updates" && (
                    <div>
                      <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                        <Input
                          aria-label="Título da actualização"
                          className="rounded-none"
                          maxLength={120}
                          onChange={(event) =>
                            update("updateTitle", event.target.value)
                          }
                          placeholder="Título"
                          value={form.updateTitle}
                        />
                        <Input
                          aria-label="Texto da actualização"
                          className="rounded-none"
                          maxLength={4000}
                          onChange={(event) =>
                            update("updateBody", event.target.value)
                          }
                          placeholder="O que mudou?"
                          value={form.updateBody}
                        />
                        <button
                          className="border border-primary/30 bg-card px-4 py-2 font-semibold text-sm"
                          onClick={addUpdate}
                          type="button"
                        >
                          Adicionar
                        </button>
                      </div>
                      <div className="mt-7 divide-y divide-border border-border border-y">
                        {form.updates.length === 0 ? (
                          <p className="py-8 text-center text-muted-foreground text-sm">
                            Sem actualizações.
                          </p>
                        ) : (
                          form.updates
                            .slice()
                            .reverse()
                            .map((update) => (
                              <article
                                className="py-5"
                                key={`${update.publishedAt}-${update.title}`}
                              >
                                <time className="text-muted-foreground text-xs">
                                  {new Intl.DateTimeFormat("pt-PT", {
                                    dateStyle: "medium",
                                  }).format(update.publishedAt)}
                                </time>
                                <h3 className="mt-1 font-semibold">
                                  {update.title}
                                </h3>
                                <p className="mt-2 text-foreground/75 text-sm">
                                  {update.body}
                                </p>
                              </article>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                  {tab === "support" && (
                    <div className="space-y-10">
                      <section>
                        <h3 className="font-semibold text-lg">
                          Recebimentos confirmados
                        </h3>
                        <p className="mt-1 text-muted-foreground text-sm">
                          Conciliação manual. Intenções nunca entram no total;
                          referências são imutáveis.
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-4">
                          <Input
                            aria-label="Valor em euros"
                            className="rounded-none"
                            onChange={(event) =>
                              setReceipt({
                                ...receipt,
                                amount: event.target.value,
                              })
                            }
                            placeholder="Valor (€)"
                            value={receipt.amount}
                          />
                          <Input
                            aria-label="Origem do recebimento"
                            className="rounded-none"
                            onChange={(event) =>
                              setReceipt({
                                ...receipt,
                                provider: event.target.value,
                              })
                            }
                            placeholder="Origem"
                            value={receipt.provider}
                          />
                          <Input
                            aria-label="Referência única"
                            className="rounded-none"
                            onChange={(event) =>
                              setReceipt({
                                ...receipt,
                                reference: event.target.value,
                              })
                            }
                            placeholder="Referência"
                            value={receipt.reference}
                          />
                          <button
                            className="cf-primary-action px-4 py-2 font-semibold text-sm"
                            onClick={addReceipt}
                            type="button"
                          >
                            Confirmar
                          </button>
                        </div>
                        <ul className="mt-5 divide-y divide-border border-border border-y">
                          {currentContributions.length === 0 ? (
                            <li className="py-8 text-center text-muted-foreground text-sm">
                              Sem recebimentos registados.
                            </li>
                          ) : (
                            currentContributions.map((item) => (
                              <li
                                className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm"
                                key={item.id ?? item._id}
                              >
                                <span>
                                  <strong>
                                    {euros(
                                      item.amountCents ?? item.amount_cents
                                    )}
                                  </strong>{" "}
                                  · {item.provider} ·{" "}
                                  {item.reference ?? item.provider_reference}
                                </span>
                                {(item.revokedAt ?? item.revoked_at) ? (
                                  <span className="text-muted-foreground">
                                    Revogado
                                  </span>
                                ) : (
                                  <button
                                    className="inline-flex items-center gap-1 text-destructive underline"
                                    onClick={() => revoke(item.id ?? item._id)}
                                    type="button"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Revogar
                                  </button>
                                )}
                              </li>
                            ))
                          )}
                        </ul>
                      </section>
                      {!demoMode && (
                        <section className="border-border border-t pt-8">
                          <h3 className="font-semibold text-lg">
                            Intenções privadas
                          </h3>
                          <ul className="mt-4 divide-y divide-border border-border border-y">
                            {intents?.length === 0 ? (
                              <li className="py-8 text-center text-muted-foreground text-sm">
                                Sem intenções.
                              </li>
                            ) : (
                              intents?.map((intent) => (
                                <li className="py-4" key={intent._id}>
                                  <div className="flex flex-wrap justify-between gap-3 text-sm">
                                    <span>
                                      <strong>{intent.name}</strong> ·{" "}
                                      <a
                                        className="text-primary underline"
                                        href={`mailto:${intent.email}`}
                                      >
                                        {intent.email}
                                      </a>
                                    </span>
                                    <span>
                                      {SUPPORT_LABELS[intent.support_type]}
                                      {intent.amount_cents
                                        ? ` · ${euros(intent.amount_cents)}`
                                        : ""}
                                    </span>
                                  </div>
                                  <p className="mt-2 text-foreground/75 text-sm">
                                    {intent.message}
                                  </p>
                                  {intent.status !== "closed" && (
                                    <button
                                      className="mt-3 inline-flex items-center gap-1 border border-primary/20 px-3 py-2 font-semibold text-xs"
                                      onClick={() =>
                                        setIntentStatus({
                                          id: intent._id,
                                          status:
                                            intent.status === "new"
                                              ? "contacted"
                                              : "closed",
                                        })
                                      }
                                      type="button"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                      {intent.status === "new"
                                        ? "Marcar contactado"
                                        : "Fechar"}
                                    </button>
                                  )}
                                </li>
                              ))
                            )}
                          </ul>
                        </section>
                      )}
                    </div>
                  )}
                  {error && (
                    <p
                      className="mt-6 border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                  {saved && (
                    <p
                      className="mt-6 border border-accent/30 bg-accent/10 p-4 text-primary text-sm"
                      role="status"
                    >
                      Projecto guardado.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
      <Dialog
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) {
            window.setTimeout(() => previewButtonRef.current?.focus(), 0);
          }
        }}
        open={previewOpen}
      >
        <DialogContent className="crowdfunding-scope premium-shadow-lg max-h-[calc(100vh-1.5rem)] max-w-5xl gap-0 overflow-y-auto rounded-2xl border border-accent/20 bg-card p-0">
          <DialogHeader className="sticky top-0 z-10 border-border border-b bg-card px-4 py-3 pr-14 text-left sm:px-6">
            <DialogTitle className="font-semibold text-primary text-xs uppercase tracking-[.1em]">
              Pré-visualização local
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Inclui alterações ainda não guardadas. Não publica o projecto.
            </DialogDescription>
            <DialogClose className="absolute top-3 right-12 border border-primary/20 px-3 py-1.5 font-semibold text-xs sm:right-14">
              Fechar
            </DialogClose>
          </DialogHeader>
          <div className="p-4 sm:p-8">
            <header className="mx-auto max-w-3xl text-center">
              <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
                {form.eyebrow || "Projecto LUSÍADA"}
              </p>
              <h2 className="mt-2 font-semibold text-3xl tracking-[-.03em]">
                {form.title || "Título do projecto"}
              </h2>
              <p className="mt-3 text-foreground/70 leading-6">
                {form.summary || "O resumo da campanha aparece aqui."}
              </p>
            </header>
            <div className="mt-7 grid gap-6 lg:grid-cols-[1.6fr_.7fr]">
              <div className="aspect-video overflow-hidden border border-border bg-secondary">
                {form.cover ? (
                  <img
                    alt=""
                    className="h-full w-full object-cover"
                    src={form.cover}
                  />
                ) : (
                  <MindGamesArtwork className="h-full w-full object-cover" />
                )}
              </div>
              <aside className="border-border border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                <p className="font-semibold text-3xl text-primary">
                  {euros(currentConfirmedCents)}
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                  confirmados de uma meta de{" "}
                  {euros(
                    Math.max(
                      0,
                      Math.round(Number(form.goal.replace(",", ".")) * 100)
                    ) || 0
                  )}
                </p>
                <p className="mt-5 border-border border-t pt-5 font-semibold text-sm">
                  {STATUS_LABELS[form.status]}
                </p>
                <div className="cf-primary-action mt-6 px-5 py-4 text-center font-semibold">
                  Apoiar este projecto
                </div>
              </aside>
            </div>
            <section className="mx-auto mt-8 max-w-3xl border-border border-t pt-7">
              <h3 className="font-semibold text-2xl">História</h3>
              <p className="mt-4 whitespace-pre-wrap text-foreground/85 leading-7">
                {form.description || "A história do projecto aparece aqui."}
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  children,
  className = "",
  hint,
  id,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  hint?: string;
  id: string;
  label: string;
}) {
  return (
    <div className={className}>
      <Label className="font-semibold text-sm" htmlFor={id}>
        {label}
      </Label>
      {hint && <p className="mt-1 text-muted-foreground text-xs">{hint}</p>}
      {children}
    </div>
  );
}
