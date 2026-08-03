import { useQuery } from "convex/react";
import { ArrowLeft, Camera, Loader2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import {
  COBALTO,
  COR_ESTADO,
  type Estado,
  ROTULO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";
import NotFound from "@/pages/NotFound";
import { api } from "../../../convex/_generated/api";

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
      <main className="flex min-h-dvh items-center justify-center bg-slate-50">
        <Loader2
          className="h-6 w-6 animate-spin"
          style={{ color: COBALTO.forte }}
        />
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
  const historia = [
    { r: "Padrão", v: painel.padrao },
    { r: "Época", v: painel.epoca },
    { r: "Oficina", v: painel.oficina },
    { r: "Autor", v: painel.autor },
  ].filter((c) => Boolean(c.v));

  return (
    <main className="min-h-dvh bg-slate-50">
      <Seo
        description={`Painel de azulejo${localizacao ? ` em ${localizacao}` : ""}. Estado: ${ROTULO_ESTADO[estado]}. Registo datado e geolocalizado.`}
        image={painel.imageUrl}
        path={`/azulejos/${painel._id}`}
        title={`${titulo} — Azulejos | Memória Lusíada`}
        type="article"
      />

      {/* A fotografia é a página; o resto vem por baixo. */}
      <div className="relative">
        {painel.imageUrl && (
          <img
            alt={`Painel de azulejo${localizacao ? ` em ${localizacao}` : ""}`}
            className="h-[46vh] w-full object-cover"
            src={painel.imageUrl}
          />
        )}
        <Link
          aria-label="Voltar ao mapa"
          className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md"
          style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
          to="/mapa"
        >
          <ArrowLeft size={19} strokeWidth={1.75} />
        </Link>
      </div>

      <div className="mx-auto -mt-6 max-w-[560px] rounded-t-[28px] bg-slate-50 px-5 pt-7 pb-16">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-body text-[12px] text-white"
          style={{ backgroundColor: COR_ESTADO[estado] }}
        >
          {ROTULO_ESTADO[estado]}
        </span>
        <h1
          className="mt-4 font-display text-[27px] leading-[1.15]"
          style={{ color: COBALTO.tinta }}
        >
          {titulo}
        </h1>
        {painel.concelho && painel.morada && (
          <p className="mt-2 flex items-center gap-1.5 font-body text-[15px] text-slate-500">
            <MapPin size={15} strokeWidth={1.75} />
            {painel.concelho}
          </p>
        )}

        {/* A data é tão importante como a fotografia: é o que faz a prova. */}
        <div
          className="mt-6 rounded-2xl px-5 py-4"
          style={{ backgroundColor: COBALTO.lavado }}
        >
          <p
            className="font-body text-[11px] uppercase tracking-[0.16em]"
            style={{ color: COBALTO.medio }}
          >
            O registo
          </p>
          <p className="mt-2 font-body text-[15px] text-slate-700 leading-relaxed">
            Fotografado e localizado a{" "}
            <strong className="text-slate-900">
              {dataPt(painel.createdAt)}
            </strong>
            {painel.authorName ? ` por ${painel.authorName}` : ""}. As
            coordenadas vieram do telemóvel, no local.
          </p>
        </div>

        {historia.length > 0 && (
          <section className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2
                className="font-display text-[13px] uppercase tracking-[0.2em]"
                style={{ color: COBALTO.medio }}
              >
                O que se sabe
              </h2>
              {!painel.historiaConfirmada && (
                <span className="rounded-full border border-slate-200 px-2.5 py-1 font-body text-[11px] text-slate-500 uppercase tracking-[0.1em]">
                  Por confirmar
                </span>
              )}
            </div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {historia.map((c) => (
                <div
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  key={c.r}
                >
                  <dt className="font-body text-[11px] text-slate-400 uppercase tracking-[0.14em]">
                    {c.r}
                  </dt>
                  <dd className="mt-1 font-body text-[15px] text-slate-800">
                    {c.v}
                  </dd>
                </div>
              ))}
            </dl>
            {!painel.historiaConfirmada && (
              <p className="mt-4 font-body text-[13px] text-slate-500 leading-relaxed">
                Isto foi escrito por quem registou o painel e ainda não foi
                validado. O que se vê — a fotografia, o sítio, a data — é
                verificável; o que se afirma sobre história, ainda não.
              </p>
            )}
          </section>
        )}

        <div className="mt-10 grid gap-2.5">
          <Link
            className="flex items-center justify-center gap-2.5 rounded-2xl py-4 font-body text-[15px] text-white transition-transform active:scale-[0.98]"
            style={{ backgroundColor: COBALTO.forte }}
            to="/azulejos/registar"
          >
            <Camera size={18} strokeWidth={1.75} />
            Registar outro painel
          </Link>
          <Link
            className="rounded-2xl border border-slate-200 bg-white py-4 text-center font-body text-[15px] text-slate-700"
            to="/mapa"
          >
            Ver o mapa
          </Link>
        </div>
      </div>
    </main>
  );
}
