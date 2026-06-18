import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, MapPin } from "lucide-react";
import { useMutation } from "convex/react";

import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
      data-nav-theme="light"
      className="mx-auto max-w-[860px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Header */}
      <header className="text-center">
        <p className="font-body text-[12px] uppercase tracking-[0.25em] text-muted-foreground">
          Contacto
        </p>
        <h1 className="mt-4 font-display text-[40px] sm:text-[56px] leading-[1.1] text-primary">
          Fale connosco
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
        <p className="mx-auto mt-8 max-w-xl font-body text-[17px] leading-relaxed text-foreground/80">
          Tem uma questão, uma proposta ou quer saber como colaborar? Escreva-nos —
          respondemos a todas as mensagens.
        </p>
      </header>

      <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.4fr]">
        {/* Coordenadas */}
        <aside className="space-y-8">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[14px] uppercase tracking-[0.2em] text-primary">
                Correio
              </h2>
              <a
                href="mailto:admin@alusiada.pt"
                className="mt-1 block font-body text-[15px] text-foreground/75 hover:text-accent transition-colors"
              >
                admin@alusiada.pt
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-[14px] uppercase tracking-[0.2em] text-primary">
                Sede
              </h2>
              <address className="mt-1 not-italic font-body text-[15px] leading-relaxed text-foreground/75">
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
          <section className="rounded-2xl border border-border bg-card p-10 text-center premium-shadow">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
              Mensagem enviada.
            </h2>
            <p className="mt-5 font-body text-base text-foreground/80 leading-relaxed">
              Obrigado pelo seu contacto. Responderemos com a maior brevidade.
            </p>
          </section>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="rounded-2xl border border-border bg-card p-8 md:p-10 premium-shadow space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body text-sm">
                Nome
              </Label>
              <Input id="name" type="text" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive font-body">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-body text-sm">
                Correio electrónico
              </Label>
              <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive font-body">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="font-body text-sm">
                Assunto <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input id="subject" type="text" {...register("subject")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="font-body text-sm">
                Mensagem
              </Label>
              <Textarea
                id="message"
                rows={5}
                maxLength={2000}
                aria-invalid={!!errors.message}
                placeholder="A sua mensagem…"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs text-destructive font-body">{errors.message.message}</p>
              )}
            </div>

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
                    A enviar…
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
