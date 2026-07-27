import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "../../convex/_generated/api";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Indique o seu nome (mínimo 3 caracteres)." })
    .max(120),
  email: z
    .string()
    .trim()
    .email({ message: "Indique um endereço de correio electrónico válido." })
    .max(255),
  subject: z.string().trim().max(150).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." })
    .max(2000, { message: "A mensagem deve ter menos de 2000 caracteres." }),
});

type FormValues = z.infer<typeof schema>;

export default function ContactosPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const sendMessage = useMutation(api.contact.send);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await sendMessage({
        name: values.name.trim(),
        email: values.email.toLowerCase(),
        subject: values.subject?.trim() ? values.subject.trim() : null,
        message: values.message.trim(),
      });
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Não foi possível enviar a sua mensagem. Por favor, tente novamente em instantes."
      );
    }
  };

  return (
    <main
      className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Contacto"
        intro="Tem uma questão, uma proposta ou quer saber como colaborar? Escreva-nos — respondemos a todas as mensagens."
        title="Fale connosco"
      />

      <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.4fr]">
        {/* Coordenadas */}
        <aside className="space-y-8">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[14px] text-primary uppercase tracking-[0.2em]">
                Correio
              </h2>
              <a
                className="mt-1 block font-body text-[15px] text-foreground/75 transition-colors hover:text-accent"
                href="mailto:bernardo@alusiada.pt"
              >
                bernardo@alusiada.pt
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[14px] text-primary uppercase tracking-[0.2em]">
                Sede
              </h2>
              <address className="mt-1 font-body text-[15px] text-foreground/75 not-italic leading-relaxed">
                Associação Memória Lusíada
                <br />
                Largo da Freiria 6
                <br />
                3000-196 Coimbra
                <br />
                NIF 518 533 301
              </address>
            </div>
          </div>
        </aside>

        {/* Formulário */}
        {submitted ? (
          <section className="premium-shadow rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="font-display font-semibold text-2xl text-foreground md:text-3xl">
              Mensagem enviada.
            </h2>
            <p className="mt-5 font-body text-base text-foreground/80 leading-relaxed">
              Obrigado pelo seu contacto. Responderemos com a maior brevidade.
            </p>
          </section>
        ) : (
          <form
            className="premium-shadow space-y-6 rounded-2xl border border-border bg-card p-8 md:p-10"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label className="font-body text-sm" htmlFor="name">
                Nome
              </Label>
              <Input
                aria-invalid={!!errors.name}
                autoComplete="name"
                id="name"
                type="text"
                {...register("name")}
              />
              {errors.name && (
                <p className="font-body text-destructive text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm" htmlFor="email">
                Correio electrónico
              </Label>
              <Input
                aria-invalid={!!errors.email}
                autoComplete="email"
                id="email"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="font-body text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm" htmlFor="subject">
                Assunto{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </Label>
              <Input id="subject" type="text" {...register("subject")} />
            </div>

            <div className="space-y-2">
              <Label className="font-body text-sm" htmlFor="message">
                Mensagem
              </Label>
              <Textarea
                aria-invalid={!!errors.message}
                id="message"
                maxLength={2000}
                placeholder="A sua mensagem…"
                rows={5}
                {...register("message")}
              />
              {errors.message && (
                <p className="font-body text-destructive text-xs">
                  {errors.message.message}
                </p>
              )}
            </div>

            {submitError && (
              <div
                className="rounded-md border border-destructive/40 bg-destructive/5 p-4 font-body text-destructive text-sm"
                role="alert"
              >
                {submitError}
              </div>
            )}

            <div className="pt-2">
              <Button
                className="h-12 w-full rounded-md bg-primary font-body text-primary-foreground tracking-wide hover:bg-primary/90"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />A enviar…
                  </>
                ) : (
                  "Enviar mensagem"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
