import {
  ArrowRight,
  FolderKanban,
  Loader2,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProjectArtwork } from "@/components/projects/ProjectArtwork";
import { Seo } from "@/components/Seo";
import { usePublishedProjects } from "@/hooks/use-projects";
import {
  CAMPAIGN_PORTFOLIO,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_IDEA_COUNT,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_STAGE_LABELS,
} from "@/lib/project-portfolio";
import { euros, type ProjectStatus, STATUS_LABELS } from "@/lib/projects";

type Filter = "all" | ProjectStatus;
const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "preparing", label: "Em preparação" },
  { value: "funding", label: "A recolher apoios" },
  { value: "funded", label: "Meta alcançada" },
  { value: "completed", label: "Concluídos" },
];

export default function ProjectosPage() {
  const { projects, isDemo } = usePublishedProjects();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const search = params.get("pesquisa") ?? "";
  const filtered = useMemo(
    () =>
      (projects ?? []).filter((project) => {
        const matchesStatus = filter === "all" || project.status === filter;
        const term = search.trim().toLocaleLowerCase("pt-PT");
        return (
          matchesStatus &&
          (!term ||
            `${project.title} ${project.summary}`
              .toLocaleLowerCase("pt-PT")
              .includes(term))
        );
      }),
    [filter, projects, search]
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map(({ value }) => [
          value,
          value === "all"
            ? (projects?.length ?? 0)
            : (projects ?? []).filter((project) => project.status === value)
                .length,
        ])
      ),
    [projects]
  );

  return (
    <div className="min-h-screen bg-background pt-16">
      <Seo
        description="Projectos e ideias da LUSÍADA, organizados por categorias e preparados para revisão."
        path="/projectos"
        title="Projectos — LUSÍADA"
      />
      {isDemo && (
        <div className="border-accent/30 border-b bg-accent/10 px-4 py-2.5 text-center text-primary text-xs">
          <strong>Ambiente local.</strong> Os dados desta demonstração existem
          apenas neste navegador.{" "}
          <Link
            className="underline underline-offset-2"
            to="/demonstracao/projectos"
          >
            Gerir projectos
          </Link>
        </div>
      )}
      <section className="border-border border-b bg-card px-4 py-7 sm:px-6 sm:py-8 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-2 font-semibold text-primary text-xs uppercase tracking-[.15em]">
            Projectos LUSÍADA
          </p>
          <div className="grid items-end gap-5 lg:grid-cols-[1fr_400px]">
            <div>
              <h1 className="max-w-2xl font-display text-[32px] text-primary leading-[1.12] tracking-[-.02em] sm:text-4xl">
                Projectos para rever e tornar reais
              </h1>
              <div aria-hidden="true" className="cf-ornament mt-4" />
              <p className="mt-3 max-w-2xl text-foreground/70 text-sm leading-6 sm:text-base">
                Seis propostas têm página própria. O mapa inferior reúne as 80
                ideias de origem em projectos coerentes, sem transformar visão
                em compromisso público.
              </p>
            </div>
            <label className="relative block">
              <span className="sr-only">Pesquisar projectos</span>
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                className="h-13 w-full border border-primary/25 bg-card py-3.5 pr-4 pl-12 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-primary"
                onChange={(event) => {
                  const next = new URLSearchParams(params);
                  if (event.target.value) {
                    next.set("pesquisa", event.target.value);
                  } else {
                    next.delete("pesquisa");
                  }
                  setParams(next, { replace: true });
                }}
                placeholder="Pesquisar por título ou tema"
                type="search"
                value={search}
              />
            </label>
          </div>
        </div>
      </section>
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between border-border border-b pb-4">
          <p className="text-sm" id="campanhas">
            <strong>{filtered.length}</strong>{" "}
            {filtered.length === 1 ? "projecto" : "projectos"}
            {isDemo ? " em revisão local" : " publicados"}
          </p>
          <label className="flex items-center gap-2 text-sm lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filtrar por estado</span>
            <select
              className="bg-transparent font-semibold"
              onChange={(event) => setFilter(event.target.value as Filter)}
              value={filter}
            >
              {FILTERS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} ({counts[item.value]})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-8 lg:grid-cols-[190px_1fr]">
          <aside className="hidden lg:block">
            <p className="mb-4 font-semibold text-xs uppercase tracking-[.14em]">
              Estado
            </p>
            <div className="border-border border-t">
              {FILTERS.map((item) => (
                <button
                  aria-pressed={filter === item.value}
                  className={`flex w-full items-center justify-between border-border border-b py-3 text-left text-sm ${filter === item.value ? "font-semibold text-primary" : "text-foreground/70 hover:text-primary"}`}
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  type="button"
                >
                  <span>{item.label}</span>
                  <span>{counts[item.value]}</span>
                </button>
              ))}
            </div>
          </aside>
          <section aria-label="Páginas de projectos" aria-live="polite">
            {projects === undefined ? (
              <div className="grid min-h-64 place-items-center">
                <Loader2
                  aria-label="A carregar projectos"
                  className="h-6 w-6 animate-spin text-primary"
                />
              </div>
            ) : filtered.length === 0 ? (
              <div className="cf-surface px-6 py-16 text-center">
                <h2 className="font-semibold text-xl">
                  Nenhum projecto encontrado
                </h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Experimente outro termo ou estado.
                </p>
                <button
                  className="mt-5 border border-primary/30 px-5 py-2.5 font-semibold text-sm"
                  onClick={() => {
                    setFilter("all");
                    setParams({}, { replace: true });
                  }}
                  type="button"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-x-7 gap-y-10 ${filtered.length > 1 ? "md:grid-cols-2" : ""}`}
              >
                {filtered.map((project) => {
                  const progress =
                    project.goalCents > 0
                      ? Math.min(
                          100,
                          (project.confirmedCents / project.goalCents) * 100
                        )
                      : 0;
                  return (
                    <article
                      className="cf-surface group overflow-hidden"
                      key={project.slug}
                    >
                      <Link
                        className={`block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${filtered.length === 1 ? "md:grid md:grid-cols-[minmax(0,55fr)_minmax(280px,45fr)] md:items-start md:gap-7" : ""}`}
                        to={`/projectos/${project.slug}`}
                      >
                        <div className="aspect-video w-full min-w-0 overflow-hidden bg-secondary">
                          {project.coverImageUrl ? (
                            <img
                              alt=""
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              src={project.coverImageUrl}
                            />
                          ) : (
                            <ProjectArtwork
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              slug={project.slug}
                            />
                          )}
                        </div>
                        <div
                          className={
                            filtered.length === 1
                              ? "min-w-0 p-5 md:flex md:flex-col md:justify-center md:py-5 md:pr-7 md:pl-0"
                              : "p-5"
                          }
                        >
                          <p className="font-semibold text-primary text-xs uppercase tracking-[.08em]">
                            {STATUS_LABELS[project.status]}
                          </p>
                          <h2
                            className={`mt-2 font-display font-medium text-primary leading-tight tracking-[-.01em] group-hover:underline group-hover:underline-offset-4 ${filtered.length === 1 ? "text-2xl" : "text-xl"}`}
                          >
                            {project.title}
                          </h2>
                          <p className="mt-2 line-clamp-2 text-foreground/70 text-sm leading-6">
                            {project.summary}
                          </p>
                          <p className="mt-3 text-muted-foreground text-xs">
                            {CAMPAIGN_PORTFOLIO.get(project.slug)?.category
                              .title ?? "Associação Memória Lusíada"}
                          </p>
                          <div className="mt-5 h-1 bg-border">
                            <div
                              className="cf-progress h-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            {project.goalCents > 0 ? (
                              <>
                                <strong className="text-primary">
                                  {euros(project.confirmedCents)} confirmados
                                </strong>
                                <span className="text-muted-foreground">
                                  meta {euros(project.goalCents)}
                                </span>
                              </>
                            ) : (
                              <>
                                <strong className="text-primary">
                                  Orçamento em preparação
                                </strong>
                                <span className="text-muted-foreground">
                                  meta a definir
                                </span>
                              </>
                            )}
                          </div>
                          <span className="mt-5 inline-flex items-center gap-1.5 font-display text-primary text-xs uppercase tracking-[.1em]">
                            Ver projecto <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <section className="border-primary/15 border-t bg-card px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-semibold text-primary text-xs uppercase tracking-[.15em]">
            Portefólio LUSÍADA
          </p>
          <div className="mt-3 grid gap-6 border-border border-b pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-3xl font-display text-3xl text-primary leading-tight sm:text-4xl">
                80 ideias, agrupadas em {PORTFOLIO_PROJECTS.length} projectos
              </h2>
              <p className="mt-4 max-w-3xl text-foreground/70 text-sm leading-6 sm:text-base">
                Cada ideia aparece uma única vez. Os projectos estão organizados
                por finalidade; os estados distinguem trabalho em curso,
                candidatos, visão futura e matéria que deve permanecer interna.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-px border border-primary/15 bg-primary/15 text-center">
              {[
                [PORTFOLIO_IDEA_COUNT, "ideias"],
                [PORTFOLIO_PROJECTS.length, "projectos"],
                [PORTFOLIO_CATEGORIES.length, "categorias"],
              ].map(([value, label]) => (
                <div className="bg-background px-4 py-3" key={label}>
                  <strong className="block font-display text-2xl text-primary">
                    {value}
                  </strong>
                  <span className="text-muted-foreground text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {PORTFOLIO_CATEGORIES.map((category, categoryIndex) => {
              const ideaCount = category.projects.reduce(
                (total, project) => total + project.ideas.length,
                0
              );
              return (
                <details
                  className="group border border-primary/15 bg-background"
                  key={category.id}
                  open={categoryIndex === 0}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-5 px-5 py-5 sm:px-7">
                    <span className="flex gap-4">
                      <FolderKanban className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <span>
                        <strong className="block font-display text-primary text-xl">
                          {category.title}
                        </strong>
                        <span className="mt-1 block text-foreground/65 text-sm leading-6">
                          {category.summary}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-muted-foreground text-xs leading-5">
                      {category.projects.length} projectos
                      <br />
                      {ideaCount} ideias
                    </span>
                  </summary>
                  <div className="grid gap-px border-primary/15 border-t bg-primary/15 md:grid-cols-2 xl:grid-cols-3">
                    {category.projects.map((project) => (
                      <article
                        className="bg-card p-5 sm:p-6"
                        key={project.title}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-semibold text-[11px] text-primary uppercase tracking-[.1em]">
                            {PORTFOLIO_STAGE_LABELS[project.stage]}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {project.ideas.length}{" "}
                            {project.ideas.length === 1 ? "ideia" : "ideias"}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-primary text-xl leading-tight">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-foreground/65 text-sm leading-6">
                          {project.summary}
                        </p>
                        <ul className="mt-5 space-y-2 border-border border-t pt-4">
                          {project.ideas.map((idea) => (
                            <li
                              className="flex gap-2 text-sm leading-5"
                              key={idea.id}
                            >
                              <code className="shrink-0 font-semibold text-primary text-xs">
                                {idea.id}
                              </code>
                              <span className="text-foreground/75">
                                {idea.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {project.campaignSlugs?.map((slug, index) => (
                          <Link
                            className="mt-5 mr-5 inline-flex items-center gap-2 font-semibold text-primary text-sm underline-offset-4 hover:underline"
                            key={slug}
                            to={`/projectos/${slug}`}
                          >
                            {project.campaignSlugs?.length === 1
                              ? "Rever página"
                              : `Rever proposta ${index + 1}`}{" "}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        ))}
                      </article>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
