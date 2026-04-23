import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DISTRITOS = [
  "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra",
  "Évora", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto",
  "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu",
  "Açores", "Madeira", "Estrangeiro",
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
  email: z
    .string()
    .trim()
    .email({ message: "Indique um endereço de correio electrónico válido." })
    .max(255),
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

export default function AderirPage() {
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newsletter_consent: true },
  });

  const newsletter = watch("newsletter_consent");

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const { error } = await supabase.from("members").insert({
      full_name: values.full_name,
      email: values.email.toLowerCase(),
      district: values.district,
      city: values.city?.trim() ? values.city.trim() : null,
      how_did_you_find_us: values.how_did_you_find_us ?? null,
      motivation: values.motivation?.trim() ? values.motivation.trim() : null,
      newsletter_consent: values.newsletter_consent,
      country: "PT",
      status: "active",
    });

    if (error) {
      // Postgres unique violation = 23505
      if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
        setSubmitError(
          "Este correio electrónico já consta dos nossos registos. Já é membro da Associação Lusíada."
        );
      } else {
        setSubmitError(
          "Não foi possível concluir a adesão. Por favor, tente novamente em instantes."
        );
      }
      return;
    }

    setSubmittedName(values.full_name.trim().split(/\s+/)[0]);
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <article className="container mx-auto max-w-2xl px-6">
        <header className="mb-12 text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Adesão
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
            Aderir à Associação Lusíada
          </h1>
          <p className="mt-6 font-body text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            A adesão é livre e gratuita. A Associação sustenta-se de doações.
          </p>
        </header>

        {submittedName ? (
          <section className="rounded-2xl border border-border bg-card p-10 md:p-14 text-center premium-shadow">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              Bem-vindo(a), {submittedName}.
            </h2>
            <p className="mt-6 font-body text-base text-foreground/80 leading-relaxed">
              A sua adesão à Associação Lusíada foi confirmada.
            </p>
            <p className="mt-3 font-body text-sm text-muted-foreground leading-relaxed">
              Em breve receberá uma mensagem de boas-vindas no seu correio electrónico.
            </p>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="rounded-2xl border border-border bg-card p-8 md:p-10 premium-shadow space-y-6"
          >
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-body text-sm">
                Nome completo
              </Label>
              <Input
                id="full_name"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.full_name}
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive font-body">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm">
                Correio electrónico
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-body">{errors.email.message}</p>
              )}
            </div>

            {/* Distrito */}
            <div className="space-y-2">
              <Label htmlFor="district" className="font-body text-sm">
                Distrito
              </Label>
              <Select
                onValueChange={(v) => setValue("district", v as FormValues["district"], { shouldValidate: true })}
              >
                <SelectTrigger id="district" aria-invalid={!!errors.district}>
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
                <p className="text-xs text-destructive font-body">{errors.district.message}</p>
              )}
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Label htmlFor="city" className="font-body text-sm">
                Cidade <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="city"
                type="text"
                autoComplete="address-level2"
                {...register("city")}
              />
            </div>

            {/* Como descobriu */}
            <div className="space-y-2">
              <Label htmlFor="how_did_you_find_us" className="font-body text-sm">
                Como nos descobriu? <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Select
                onValueChange={(v) =>
                  setValue("how_did_you_find_us", v as FormValues["how_did_you_find_us"], {
                    shouldValidate: true,
                  })
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

            {/* Motivação */}
            <div className="space-y-2">
              <Label htmlFor="motivation" className="font-body text-sm">
                Motivação para aderir <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Textarea
                id="motivation"
                rows={4}
                maxLength={1000}
                placeholder="O que o leva a aderir à Associação Lusíada?"
                {...register("motivation")}
              />
              {errors.motivation && (
                <p className="text-xs text-destructive font-body">{errors.motivation.message}</p>
              )}
            </div>

            {/* Newsletter */}
            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="newsletter_consent"
                checked={newsletter}
                onCheckedChange={(c) => setValue("newsletter_consent", c === true)}
                className="mt-0.5"
              />
              <Label
                htmlFor="newsletter_consent"
                className="font-body text-sm text-foreground/80 leading-relaxed cursor-pointer"
              >
                Aceito receber comunicações da Associação por correio electrónico
              </Label>
            </div>

            {/* Submit error */}
            {submitError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/5 p-4 font-body text-sm text-destructive"
              >
                {submitError}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body tracking-wide rounded-md h-12"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    A confirmar…
                  </>
                ) : (
                  "Confirmar adesão"
                )}
              </Button>
            </div>
          </form>
        )}
      </article>
    </main>
  );
}