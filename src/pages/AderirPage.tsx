import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { api } from "../../convex/_generated/api";

const DISTRITOS = [
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Açores",
  "Madeira",
  "Estrangeiro",
] as const;

const ORIGENS = [
  "Recomendação de alguém",
  "Redes sociais",
  "Pesquisa online",
  "Imprensa",
  "Evento",
  "Outra",
] as const;

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, { message: "Indique o seu nome completo (mínimo 3 caracteres)." })
    .max(120, { message: "O nome deve ter menos de 120 caracteres." }),
  district: z.enum(DISTRITOS, {
    errorMap: () => ({ message: "Seleccione o seu distrito." }),
  }),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  how_did_you_find_us: z.enum(ORIGENS).optional(),
  motivation: z
    .string()
    .trim()
    .max(1000, { message: "A motivação deve ter menos de 1000 caracteres." })
    .optional()
    .or(z.literal("")),
  newsletter_consent: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="min-h-screen bg-background pt-32 pb-24"
      data-nav-theme="light"
    >
      <article className="container mx-auto max-w-2xl px-6">
        <header className="mb-12 text-center">
          <p className="mb-4 font-body text-muted-foreground text-xs uppercase tracking-[0.3em]">
            Adesão
          </p>
          <h1 className="font-display font-semibold text-4xl text-foreground tracking-tight md:text-5xl">
            Tornar-se Sócio
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-body text-base text-muted-foreground leading-relaxed">
            Ser sócio da Associação Memória Lusíada é um compromisso com a
            preservação da nossa herança. A adesão implica o pagamento de uma
            quota e a aprovação da Direcção.
          </p>
        </header>
        {children}
      </article>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="premium-shadow rounded-2xl border border-border bg-card p-8 text-center md:p-12">
      {children}
    </section>
  );
}

export default function AderirPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const membership = useQuery(api.memberships.myMembership);

  if (isLoading || (isAuthenticated && membership === undefined)) {
    return (
      <Shell>
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated) {
    return (
      <Shell>
        <Card>
          <p className="font-body text-base text-foreground/80 leading-relaxed">
            Para aderir, inicie sessão com a sua conta Google. Assim a sua
            adesão fica ligada ao seu perfil.
          </p>
          <Button
            className="mt-8"
            onClick={() => signIn("google", { redirectTo: "/aderir" })}
            variant="accent"
          >
            Entrar com Google
          </Button>
          <p className="mt-6 font-body text-muted-foreground text-sm">
            Só quer explorar e contribuir para a Arca?{" "}
            <Link className="text-accent hover:underline" to="/arca">
              Não precisa de ser sócio.
            </Link>
          </p>
        </Card>
      </Shell>
    );
  }

  if (membership?.level === "member") {
    return (
      <Shell>
        <Card>
          <CheckCircle2 className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-4 font-display font-semibold text-3xl text-foreground">
            Já é sócio. Obrigado.
          </h2>
          <p className="mt-4 font-body text-base text-foreground/80 leading-relaxed">
            A sua adesão está ativa. Bem-vindo à Associação Memória Lusíada.
          </p>
          <Button asChild className="mt-8" variant="accent">
            <Link to="/conta">A minha conta</Link>
          </Button>
        </Card>
      </Shell>
    );
  }

  if (membership?.level === "pending") {
    return (
      <Shell>
        <Card>
          <Clock className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-4 font-display font-semibold text-3xl text-foreground">
            Adesão em análise
          </h2>
          <p className="mt-4 font-body text-base text-foreground/80 leading-relaxed">
            Recebemos o seu pedido de adesão. A Direcção irá analisá-lo e
            entraremos em contacto com as indicações para o pagamento da quota.
          </p>
          <Button asChild className="mt-8" variant="outline">
            <Link to="/conta">A minha conta</Link>
          </Button>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell>
      <AdesaoForm defaultName={membership?.user?.name ?? ""} />
    </Shell>
  );
}

function AdesaoForm({ defaultName }: { defaultName: string }) {
  const request = useMutation(api.memberships.requestMembership);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: defaultName, newsletter_consent: true },
  });
  const newsletter = watch("newsletter_consent");

  const onSubmit = async (values: FormValues) => {
    try {
      await request({
        full_name: values.full_name.trim(),
        district: values.district,
        city: values.city?.trim() || undefined,
        how_did_you_find_us: values.how_did_you_find_us ?? undefined,
        motivation: values.motivation?.trim() || undefined,
        newsletter_consent: values.newsletter_consent,
      });
    } catch (e) {
      setError("root", {
        message:
          e instanceof Error
            ? e.message
            : "Não foi possível enviar o pedido. Tente novamente.",
      });
    }
  };

  return (
    <form
      className="premium-shadow space-y-6 rounded-2xl border border-border bg-card p-8 md:p-10"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label className="font-body text-sm" htmlFor="full_name">
          Nome completo
        </Label>
        <Input
          aria-invalid={!!errors.full_name}
          autoComplete="name"
          id="full_name"
          type="text"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="font-body text-destructive text-xs">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm" htmlFor="district">
          Distrito
        </Label>
        <Select
          onValueChange={(v) =>
            setValue("district", v as FormValues["district"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger aria-invalid={!!errors.district} id="district">
            <SelectValue placeholder="Seleccione o distrito" />
          </SelectTrigger>
          <SelectContent>
            {DISTRITOS.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.district && (
          <p className="font-body text-destructive text-xs">
            {errors.district.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm" htmlFor="city">
          Cidade{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          autoComplete="address-level2"
          id="city"
          type="text"
          {...register("city")}
        />
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm" htmlFor="how_did_you_find_us">
          Como nos descobriu?{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Select
          onValueChange={(v) =>
            setValue(
              "how_did_you_find_us",
              v as FormValues["how_did_you_find_us"],
              { shouldValidate: true }
            )
          }
        >
          <SelectTrigger id="how_did_you_find_us">
            <SelectValue placeholder="Seleccione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {ORIGENS.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="font-body text-sm" htmlFor="motivation">
          Motivação para aderir{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="motivation"
          maxLength={1000}
          placeholder="O que o leva a aderir à Associação Memória Lusíada?"
          rows={4}
          {...register("motivation")}
        />
        {errors.motivation && (
          <p className="font-body text-destructive text-xs">
            {errors.motivation.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 pt-2">
        <Checkbox
          checked={newsletter}
          className="mt-0.5"
          id="newsletter_consent"
          onCheckedChange={(c) => setValue("newsletter_consent", c === true)}
        />
        <Label
          className="cursor-pointer font-body text-foreground/80 text-sm leading-relaxed"
          htmlFor="newsletter_consent"
        >
          Aceito receber comunicações da Associação por correio electrónico
        </Label>
      </div>

      {errors.root && (
        <div
          className="rounded-md border border-destructive/40 bg-destructive/5 p-4 font-body text-destructive text-sm"
          role="alert"
        >
          {errors.root.message}
        </div>
      )}

      <div className="pt-2">
        <Button
          className="h-12 w-full"
          disabled={isSubmitting}
          type="submit"
          variant="accent"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> A enviar…
            </>
          ) : (
            "Enviar pedido de adesão"
          )}
        </Button>
        <p className="mt-3 text-center font-body text-muted-foreground text-xs">
          O pedido fica sujeito a aprovação e ao pagamento da quota.
        </p>
      </div>
    </form>
  );
}
