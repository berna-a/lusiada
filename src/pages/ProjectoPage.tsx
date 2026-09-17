import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import {
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  ExternalLink,
  HandHeart,
  Loader2,
  Package,
  Share2,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { ProjectArtwork } from "@/components/projects/ProjectArtwork";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePublishedProject } from "@/hooks/use-projects";
import { CAMPAIGN_PORTFOLIO } from "@/lib/project-portfolio";
import {
  euros,
  parseEuroInput,
  STATUS_LABELS,
  SUPPORT_LABELS,
  type SupportType,
} from "@/lib/projects";
import { api } from "../../convex/_generated/api";

const schema = z.object({
  name: z.string().trim().min(2, "Indique o seu nome.").max(120),
  email: z.string().trim().email("Indique um email válido.").max(255),
  supportType: z.enum(["financial", "material", "technical", "volunteer"]),
  amount: z
    .string()
    .trim()
    .max(12, "O valor não pode exceder 12 caracteres.")
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Explique em pelo menos 10 caracteres como gostaria de ajudar.")
    .max(2000),
});
type FormValues = z.infer<typeof schema>;
const supportIcons = {
  financial: HandHeart,
  material: Package,
  technical: Code2,
  volunteer: UsersRound,
};

export default function ProjectoPage() {
  const { slug } = useParams();
  const { project, isDemo } = usePublishedProject(slug);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState(false);
  const [sent, setSent] = useState<"remote" | "preview" | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const expressSupport = useMutation(api.projects.expressSupport);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { supportType: "material", amount: "" },
  });
  if (project === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-card">
        <Loader2
          aria-label="A carregar projecto"
          className="h-7 w-7 animate-spin text-primary"
        />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="mx-auto min-h-screen max-w-3xl bg-card px-6 pt-36">
        <h1 className="font-sans font-semibold text-3xl">
          Projecto não encontrado
        </h1>
        <Link
          className="mt-6 inline-block font-semibold text-primary underline"
          to="/projectos"
        >
          Ver todos os projectos
        </Link>
      </div>
    );
  }
  const p = project;
  const isPioneer = p.slug === "clube-jogos-da-mente";
  const isClosed = p.status === "completed";
  const hasGoal = p.goalCents > 0;
  const portfolio = CAMPAIGN_PORTFOLIO.get(p.slug);
  const availableSupportTypes = (
    Object.entries(SUPPORT_LABELS) as [SupportType, string][]
  ).filter(([type]) => hasGoal || type !== "financial");
  const progress =
    p.goalCents > 0 ? Math.min(100, (p.confirmedCents / p.goalCents) * 100) : 0;
  const supportType = watch("supportType");
  const copyLink = async () => {
    const url = window.location.href;
    setShareError(false);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setShareError(true);
    }
  };
  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    const amountCents =
      values.supportType === "financial"
        ? parseEuroInput(values.amount ?? "")
        : undefined;
    if (amountCents === null) {
      setSubmitError("Indique um montante válido, a partir de 1 €.");
      return;
    }
    if (isDemo) {
      setSent("preview");
      return;
    }
    try {
      await expressSupport({
        projectSlug: p.slug,
        name: values.name,
        email: values.email,
        supportType: values.supportType,
        message: values.message,
        amountCents,
      });
      setSent("remote");
    } catch {
      setSubmitError(
        "Não foi possível registar a intenção. Pode contactar-nos directamente por email."
      );
    }
  };
  const chooseSupport = (type: SupportType) => {
    setValue("supportType", type, { shouldValidate: true });
    document.getElementById("apoiar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 text-foreground sm:pb-0">
      <Seo
        description={p.summary}
        image={p.coverImageUrl}
        path={`/projectos/${p.slug}`}
        title={`${p.title} — LUSÍADA`}
      />
      {isDemo && (
        <div className="border-accent/30 border-b bg-accent/10 px-4 py-2.5 text-center text-primary text-xs">
          <strong>Ambiente local.</strong> Nenhuma intenção enviada aqui é
          guardada ou cobrada.
        </div>
      )}
      <header className="mx-auto max-w-[1240px] px-4 pt-7 pb-6 text-center sm:px-6 sm:pt-8 lg:px-10">
        <p className="font-semibold text-primary text-xs uppercase tracking-[.14em]">
          {p.eyebrow ?? "Projecto LUSÍADA"}
        </p>
        <h1 className="mx-auto mt-2 max-w-4xl font-display text-[32px] text-primary leading-[1.12] tracking-[-.02em] sm:text-4xl">
          {p.title}
        </h1>
        <div className="mt-4 flex justify-center">
          <span aria-hidden="true" className="cf-ornament" />
        </div>
        <p className="mx-auto mt-3 max-w-3xl text-base text-foreground/70 leading-6 sm:text-lg">
          {p.summary}
        </p>
        <p className="mt-3 text-muted-foreground text-sm">
          por Associação Memória Lusíada
        </p>
      </header>
      <section className="mx-auto grid max-w-[1240px] gap-7 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,.72fr)] lg:px-10">
        <div className="premium-shadow aspect-video overflow-hidden rounded-2xl border border-accent/20 bg-secondary">
          {p.coverImageUrl ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={p.coverImageUrl}
            />
          ) : (
            <ProjectArtwork
              className="h-full w-full object-cover"
              slug={p.slug}
            />
          )}
        </div>
        <aside className="cf-surface flex flex-col p-6">
          <div className="h-1.5 bg-border">
            <div
              className="cf-progress h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          {hasGoal ? (
            <>
              <p className="mt-5 font-semibold text-3xl text-primary tracking-[-.02em]">
                {euros(p.confirmedCents)}
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                confirmados de uma meta de {euros(p.goalCents)}
              </p>
            </>
          ) : (
            <>
              <p className="mt-5 font-display text-2xl text-primary">
                Meta em definição
              </p>
              <p className="mt-1 text-muted-foreground text-sm">
                Esta proposta ainda não aceita contribuições financeiras.
              </p>
            </>
          )}
          <p className="mt-5 border-border border-t pt-5 font-semibold text-sm">
            {STATUS_LABELS[p.status]}
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            {isClosed
              ? "Este projecto já não aceita novos apoios."
              : "Sem prazo artificial: avançamos com transparência à medida que reunimos condições."}
          </p>
          {isClosed ? (
            <div className="mt-7 bg-secondary px-5 py-4 text-center font-semibold text-sm">
              Apoios encerrados
            </div>
          ) : (
            <a
              className="cf-primary-action mt-7 px-6 py-4 text-center font-display text-sm uppercase tracking-[.08em] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="#apoiar"
            >
              {hasGoal ? "Apoiar este projecto" : "Manifestar interesse"}
            </a>
          )}
          <button
            className="cf-secondary-action mt-3 flex items-center justify-center gap-2 px-5 py-3.5 font-semibold text-sm"
            onClick={copyLink}
            type="button"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            {copied ? "Ligação copiada" : "Copiar ligação"}
          </button>
          {shareError && (
            <p className="mt-2 text-destructive text-xs" role="alert">
              Não foi possível copiar. Use a ligação da barra do navegador.
            </p>
          )}
        </aside>
      </section>
      <nav
        aria-label="Nesta página"
        className="sticky top-16 z-30 min-w-0 overflow-hidden border-border border-y bg-background/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full min-w-0 max-w-[1240px] gap-7 overflow-x-auto px-4 sm:px-6 lg:px-10">
          {[
            ["historia", "História"],
            ...(portfolio ? [["inventario", "Ideias de origem"]] : []),
            ["necessidades", "Necessidades"],
            ["orcamento", "Orçamento"],
            ["actualizacoes", "Actualizações"],
          ].map(([id, label]) => (
            <a
              className="shrink-0 border-transparent border-b-2 py-4 font-semibold text-sm hover:border-accent hover:text-primary"
              href={`#${id}`}
              key={id}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      <main className="mx-auto grid max-w-[1120px] gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10 lg:py-16">
        <div className="min-w-0">
          <section className="scroll-mt-[132px]" id="historia">
            <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
              A proposta
            </p>
            <h2 className="mt-3 font-sans font-semibold text-3xl tracking-[-.025em]">
              {isPioneer ? "Pensar, jogar, reunir" : "O que queremos fazer"}
            </h2>
            <p className="mt-6 whitespace-pre-wrap text-[17px] text-foreground/90 leading-8">
              {p.description}
            </p>
            {isPioneer && (
              <p className="mt-6 border-accent border-l-4 bg-accent/10 px-5 py-4 text-sm leading-6">
                O clube reúne Xadrez e Go. A organização de eventos e uma futura
                federação são intenções — ainda não são factos concluídos.
              </p>
            )}
          </section>
          {portfolio && (
            <section
              className="mt-16 scroll-mt-[132px] border-border border-t pt-12"
              id="inventario"
            >
              <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
                Lugar no portefólio
              </p>
              <h2 className="mt-3 font-sans font-semibold text-3xl tracking-[-.025em]">
                {portfolio.project.title}
              </h2>
              <p className="mt-3 max-w-2xl text-foreground/70 text-sm leading-6">
                Categoria: {portfolio.category.title}. Esta página transforma
                apenas uma etapa delimitada do projecto numa proposta para
                revisão.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {portfolio.project.ideas.map((idea) => (
                  <span
                    className="border border-primary/20 bg-secondary/40 px-3 py-2 text-sm"
                    key={idea.id}
                  >
                    <strong className="mr-2 text-primary">{idea.id}</strong>
                    {idea.title}
                  </span>
                ))}
              </div>
            </section>
          )}
          <section
            className="mt-16 scroll-mt-[132px] border-border border-t pt-12"
            id="necessidades"
          >
            <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
              Formas de participar
            </p>
            <h2 className="mt-3 font-sans font-semibold text-3xl tracking-[-.025em]">
              Necessidades do projecto
            </h2>
            <div className="mt-8 divide-y divide-border border-border border-y">
              {[
                [Package, "Recursos materiais", p.materialNeeds],
                [Code2, "Conhecimento técnico", p.technicalNeeds],
                [UsersRound, "Voluntariado", p.volunteerNeeds],
              ].map(([Icon, title, items]) => {
                const NeedIcon = Icon as typeof Package;
                return (
                  <div
                    className="grid gap-4 py-6 sm:grid-cols-[48px_1fr]"
                    key={title as string}
                  >
                    <NeedIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {title as string}
                      </h3>
                      <ul className="mt-3 space-y-2 text-foreground/75 text-sm leading-6">
                        {(items as string[]).map((item) => (
                          <li className="flex gap-2" key={item}>
                            <span aria-hidden="true" className="text-primary">
                              —
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section
            className="mt-16 scroll-mt-[132px] border-border border-t pt-12"
            id="orcamento"
          >
            <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
              Transparência
            </p>
            <h2 className="mt-3 font-sans font-semibold text-3xl tracking-[-.025em]">
              Orçamento
            </h2>
            <div className="mt-7 border border-border">
              <div className="grid grid-cols-[1fr_auto] gap-6 px-5 py-5">
                <span className="text-sm">
                  {p.budgetNote ?? "Detalhe de aquisição a confirmar"}
                </span>
                <strong>{hasGoal ? euros(p.goalCents) : "A definir"}</strong>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground text-sm leading-6">
              {isPioneer
                ? "A meta de 345 € destina-se apenas à compra de tabuleiros de Xadrez e Go. Não representa todos os custos de fundação ou de uma futura federação do clube. "
                : hasGoal
                  ? ""
                  : "Esta proposta não tem ainda orçamento aprovado nem campanha aberta. "}
              {hasGoal
                ? "O progresso soma apenas recebimentos confirmados e não revogados; intenções nunca contam como dinheiro recebido."
                : "A meta só será apresentada depois de existirem escopo, responsáveis e custos verificáveis."}
            </p>
          </section>
          <section
            className="mt-16 scroll-mt-[132px] border-border border-t pt-12"
            id="actualizacoes"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
                  Diário
                </p>
                <h2 className="mt-3 font-sans font-semibold text-3xl tracking-[-.025em]">
                  Actualizações
                </h2>
              </div>
              <span className="text-muted-foreground text-sm">
                {p.updates.length}
              </span>
            </div>
            {p.updates.length === 0 ? (
              <p className="mt-7 border border-border bg-background px-5 py-8 text-muted-foreground text-sm">
                Ainda não há actualizações publicadas.
              </p>
            ) : (
              <div className="mt-7 divide-y divide-border border-border border-y">
                {p.updates
                  .slice()
                  .sort((a, b) => b.publishedAt - a.publishedAt)
                  .map((update) => (
                    <article
                      className="py-6"
                      key={`${update.publishedAt}-${update.title}`}
                    >
                      <time
                        className="text-muted-foreground text-xs"
                        dateTime={new Date(update.publishedAt).toISOString()}
                      >
                        {new Intl.DateTimeFormat("pt-PT", {
                          dateStyle: "long",
                        }).format(update.publishedAt)}
                      </time>
                      <h3 className="mt-2 font-semibold text-lg">
                        {update.title}
                      </h3>
                      <p className="mt-3 whitespace-pre-wrap text-foreground/75 text-sm leading-6">
                        {update.body}
                      </p>
                    </article>
                  ))}
              </div>
            )}
          </section>
        </div>
        <aside className="hidden lg:block">
          <div className="cf-surface sticky top-36 p-5">
            <h2 className="font-semibold text-lg">Como pode ajudar</h2>
            <p className="mt-2 text-muted-foreground text-sm leading-6">
              Escolha uma forma. Isto inicia um contacto, não um pagamento.
            </p>
            <div className="mt-5 divide-y divide-border border-border border-y">
              {availableSupportTypes.map(([type, label]) => {
                const Icon = supportIcons[type];
                return (
                  <button
                    className="flex w-full items-center gap-3 py-4 text-left font-semibold text-sm hover:text-primary"
                    disabled={isClosed}
                    key={type}
                    onClick={() => chooseSupport(type)}
                    type="button"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
      {!isClosed && (
        <section
          className="scroll-mt-[132px] border-border border-t bg-secondary/45 px-4 py-14 pb-28 sm:px-6 sm:pb-14"
          id="apoiar"
        >
          <div className="mx-auto grid max-w-[960px] gap-10 lg:grid-cols-[.7fr_1fr]">
            <div>
              <p className="font-semibold text-primary text-xs uppercase tracking-[.12em]">
                Intenção de apoio
              </p>
              <h2 className="mt-3 font-sans font-semibold text-3xl tracking-[-.025em]">
                {hasGoal
                  ? "Ajude a tornar este projecto possível."
                  : "Ajude-nos a preparar este projecto."}
              </h2>
              <p className="mt-4 text-foreground/70 text-sm leading-6">
                Nenhum valor é cobrado aqui. A LUSÍADA recebe o seu contacto e
                combina consigo os próximos passos. Esta página permanece em
                preparação até aprovação editorial.
              </p>
              {isDemo && (
                <p className="mt-5 border border-accent/30 bg-accent/10 p-4 text-primary text-sm">
                  <strong>Ambiente de teste:</strong> a submissão é validada,
                  mas não é enviada nem guardada.
                </p>
              )}
            </div>
            <div className="premium-shadow rounded-2xl border border-accent/20 bg-card p-5 sm:p-7">
              {sent ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                  <h3 className="mt-5 font-semibold text-2xl">
                    {sent === "remote"
                      ? "Intenção registada"
                      : "Teste concluído"}
                  </h3>
                  <p className="mt-3 max-w-md text-muted-foreground text-sm leading-6">
                    {sent === "remote"
                      ? "Recebemos o seu contacto. Isto não confirma qualquer pagamento."
                      : "Nenhum dado foi enviado ou guardado."}
                  </p>
                  {sent === "preview" && (
                    <a
                      className="mt-5 inline-flex items-center gap-2 font-semibold text-primary text-sm underline"
                      href={`mailto:bernardo@alusiada.pt?subject=${encodeURIComponent(p.title)}`}
                    >
                      Contactar por email <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button
                    className="mt-6 border border-primary/30 px-5 py-3 font-semibold text-sm"
                    onClick={() => {
                      setSent(null);
                      reset({ supportType: "material", amount: "" });
                    }}
                    type="button"
                  >
                    Fazer nova manifestação
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <fieldset>
                    <legend className="font-semibold text-sm">
                      Como quer ajudar?
                    </legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {availableSupportTypes.map(([value, label]) => (
                        <label
                          className="flex cursor-pointer items-center gap-2 border border-primary/20 px-3 py-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                          key={value}
                        >
                          <input
                            type="radio"
                            value={value}
                            {...register("supportType")}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {supportType === "financial" && (
                    <div>
                      <Label htmlFor="support-amount">
                        Valor indicativo (€) — não será cobrado
                      </Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          id="support-amount"
                          inputMode="decimal"
                          placeholder="Outro valor"
                          {...register("amount")}
                        />
                        {[10, 25, 50].map((amount) => (
                          <button
                            className="border border-primary/20 px-3 text-sm hover:border-accent"
                            key={amount}
                            onClick={() =>
                              setValue("amount", String(amount), {
                                shouldValidate: true,
                              })
                            }
                            type="button"
                          >
                            {amount} €
                          </button>
                        ))}
                      </div>
                      {errors.amount && (
                        <p
                          className="mt-1 text-destructive text-xs"
                          role="alert"
                        >
                          {errors.amount.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="support-name">Nome</Label>
                      <Input
                        autoComplete="name"
                        className="mt-2"
                        id="support-name"
                        {...register("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-destructive text-xs">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="support-email">Email</Label>
                      <Input
                        autoComplete="email"
                        className="mt-2"
                        id="support-email"
                        type="email"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-destructive text-xs">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="support-message">
                      Como gostaria de participar?
                    </Label>
                    <Textarea
                      className="mt-2"
                      id="support-message"
                      rows={5}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-destructive text-xs">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  {submitError && (
                    <p className="text-destructive text-sm" role="alert">
                      {submitError}
                    </p>
                  )}
                  <Button
                    className="cf-primary-action h-12 w-full font-display text-sm uppercase tracking-[.08em]"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Enviar intenção de apoio"
                    )}
                  </Button>
                  <p className="text-center text-muted-foreground text-xs">
                    Não é um pagamento nem uma reserva de contribuição.
                  </p>
                  <p className="text-center text-muted-foreground text-xs leading-5">
                    Os dados de contacto são usados apenas para responder a esta
                    intenção e não são apresentados publicamente.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      )}
      <div className="mx-auto flex max-w-[1120px] items-center justify-between border-border border-t px-4 py-8 text-sm sm:px-6 lg:px-10">
        <Link className="font-semibold hover:text-primary" to="/projectos">
          ← Todos os projectos
        </Link>
        <button
          className="inline-flex items-center gap-2 font-semibold hover:text-primary"
          onClick={copyLink}
          type="button"
        >
          <Clipboard className="h-4 w-4" />
          Copiar ligação
        </button>
      </div>
      {!isClosed && (
        <a
          className="cf-primary-action fixed inset-x-4 bottom-3 z-40 px-5 py-4 text-center font-display text-sm uppercase tracking-[.08em] sm:hidden"
          href="#apoiar"
        >
          {hasGoal ? "Apoiar este projecto" : "Manifestar interesse"}
        </a>
      )}
    </div>
  );
}
