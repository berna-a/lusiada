import { useQuery } from "convex/react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/../convex/_generated/api";
import {
  MapaAzulejos,
  type PainelNoMapa,
} from "@/components/azulejos/MapaAzulejos";
import { Seo } from "@/components/Seo";
import { COR_ESTADO } from "@/lib/azulejos/mapa-estilo";
import NotFound from "@/pages/NotFound";

const ROTULO_ESTADO = {
  integro: "Íntegro",
  danificado: "Danificado",
  em_risco: "Em risco",
  desaparecido: "Desaparecido",
} as const;

type Estado = keyof typeof ROTULO_ESTADO;

function dataPt(ms: number) {
  return new Date(ms).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AzulejoPage() {
  const { id } = useParams<{ id: string }>();
  const painel = useQuery(api.azulejos.get, id ? { id } : "skip");

  if (painel === undefined) {
    return (
      <main
        className="mx-auto max-w-3xl px-6 pt-32 pb-24"
        data-nav-theme="light"
      >
        <p className="text-center font-body text-[15px] text-muted-foreground">
          A carregar…
        </p>
      </main>
    );
  }

  if (painel === null) {
    return <NotFound />;
  }

  const estado = painel.estado as Estado;
  const titulo = painel.morada ?? painel.concelho ?? "Painel de azulejo";
  const localizacao = [painel.morada, painel.concelho]
    .filter(Boolean)
    .join(" · ");

  // O que se sabe — só se aparecer alguma coisa preenchida.
  const historia = [
    { rotulo: "Padrão", valor: painel.padrao },
    { rotulo: "Época", valor: painel.epoca },
    { rotulo: "Oficina", valor: painel.oficina },
    { rotulo: "Autor", valor: painel.autor },
  ].filter((c) => Boolean(c.valor));

  const noMapa: PainelNoMapa[] = [
    {
      _id: painel._id,
      lat: painel.lat,
      lng: painel.lng,
      estado,
      concelho: painel.concelho,
    },
  ];

  return (
    <article
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description={`Painel de azulejo registado${
          localizacao ? ` em ${localizacao}` : ""
        }. Estado: ${ROTULO_ESTADO[estado]}. Registo datado e geolocalizado.`}
        image={painel.imageUrl}
        path={`/azulejos/${painel._id}`}
        title={`${titulo} — Azulejos | Memória Lusíada`}
        type="article"
      />

      <Link
        className="inline-flex items-center gap-2 font-body text-[14px] text-muted-foreground transition-colors hover:text-foreground"
        to="/azulejos"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Voltar ao mapa
      </Link>

      {painel.imageUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <img
            alt={`Painel de azulejo${localizacao ? ` em ${localizacao}` : ""}`}
            className="w-full object-cover"
            src={painel.imageUrl}
          />
        </div>
      )}

      <header className="mt-8">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-body text-[11px] uppercase tracking-[0.16em]"
          style={{
            borderColor: COR_ESTADO[estado],
            color: COR_ESTADO[estado],
          }}
        >
          <span
            aria-hidden="true"
            className="block h-2 w-2 rounded-full"
            style={{ backgroundColor: COR_ESTADO[estado] }}
          />
          {ROTULO_ESTADO[estado]}
        </span>
        <h1 className="mt-4 font-display text-[30px] text-primary leading-[1.15] sm:text-[38px]">
          {titulo}
        </h1>
        {painel.concelho && painel.morada && (
          <p className="mt-2 flex items-center gap-2 font-body text-[15px] text-muted-foreground">
            <MapPin size={15} strokeWidth={1.5} />
            {painel.concelho}
          </p>
        )}
      </header>

      {/* O registo é uma prova: a data é tão importante como a fotografia. */}
      <section className="mt-8 rounded-2xl border border-accent/30 bg-secondary px-7 py-6">
        <p className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
          O registo
        </p>
        <p className="mt-2 font-body text-[16px] text-foreground/85 leading-relaxed">
          Fotografado e localizado a <strong>{dataPt(painel.createdAt)}</strong>
          {painel.authorName ? ` por ${painel.authorName}` : ""}. As coordenadas
          vieram do telemóvel, no local.
        </p>
      </section>

      {historia.length > 0 && (
        <section className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
              O que se sabe
            </h2>
            {!painel.historiaConfirmada && (
              <span className="rounded-full border border-border px-3 py-1 font-body text-[11px] text-muted-foreground uppercase tracking-[0.14em]">
                Por confirmar
              </span>
            )}
          </div>
          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {historia.map((c) => (
              <div className="border-accent/25 border-t pt-3" key={c.rotulo}>
                <dt className="font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
                  {c.rotulo}
                </dt>
                <dd className="mt-1 font-body text-[15px] text-foreground/85 leading-relaxed">
                  {c.valor}
                </dd>
              </div>
            ))}
          </dl>
          {!painel.historiaConfirmada && (
            <p className="mt-5 font-body text-[14px] text-muted-foreground leading-relaxed">
              Isto foi escrito por quem registou o painel e ainda não foi
              validado. O que se vê — a fotografia, o sítio, a data — é
              verificável; o que se afirma sobre história, ainda não.
            </p>
          )}
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Onde está
        </h2>
        <div className="premium-shadow mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="h-[300px] w-full">
            <MapaAzulejos paineis={noMapa} />
          </div>
        </div>
      </section>

      <section className="mt-14 border-accent/20 border-t pt-10 text-center">
        <p className="font-display text-[20px] text-primary leading-snug">
          Conhece outro painel?
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            to="/azulejos/registar"
          >
            Registar um painel
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            to="/azulejos"
          >
            Ver o mapa
          </Link>
        </div>
      </section>
    </article>
  );
}
