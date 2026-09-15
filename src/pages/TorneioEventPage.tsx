import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Crown,
  Mail,
  MapPin,
  Ticket,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

type ProgramaItem = {
  hora: string;
  titulo: string;
};

export type TorneioConfig = {
  caminho: string;
  descricao: string;
  imagemCartaz: string;
  imagemSocial: string;
  interesse: string;
  modalidade: string;
  nome: string;
  preço: string;
  programa: ProgramaItem[];
  subtitulo: string;
  tituloSeo: string;
  textoInteresse?: string;
};

const LOCAL = "Biblioteca de Marvila";
const ESPAÇO = "Espaço da cafetaria";
const DATA = "24 de Outubro de 2026";

function ChessPattern() {
  return (
    <div aria-hidden="true" className="grid grid-cols-8 overflow-hidden">
      {Array.from({ length: 32 }, (_, index) => (
        <span
          className={`aspect-square ${
            index % 7 === 0
              ? "bg-[#c73216]"
              : (index + Math.floor(index / 8)) % 2 === 0
                ? "bg-[#073c78]"
                : "bg-[#f2e5c8]"
          }`}
          key={`casa-${index}`}
        />
      ))}
    </div>
  );
}

export default function TorneioEventPage({
  children,
  event,
}: {
  children?: ReactNode;
  event: TorneioConfig;
}) {
  const textoInteresse = event.textoInteresse ?? "Quero informações";
  const IconeInteresse = event.interesse.startsWith("mailto:")
    ? Mail
    : ArrowRight;
  const perguntas = [
    {
      pergunta: "Onde e quando se realiza?",
      resposta: `${DATA}, na ${LOCAL}, no ${ESPAÇO.toLowerCase()}.`,
    },
    {
      pergunta: "Quanto custa?",
      resposta: event.preço,
    },
    {
      pergunta: "Como funciona o programa?",
      resposta: `${event.programa[0].titulo} ${event.programa[0].hora}; ${event.programa[1].titulo.toLowerCase()} ${event.programa[1].hora}; ${event.programa[2].titulo.toLowerCase()} ${event.programa[2].hora}.`,
    },
  ];

  return (
    <article
      className="-m-4 overflow-hidden bg-[#f2e5c8] text-[#081f42] sm:-m-6 md:-m-10"
      data-nav-theme="light"
    >
      <Seo
        description={event.descricao}
        image={event.imagemSocial}
        path={event.caminho}
        title={event.tituloSeo}
      />

      <section className="relative isolate overflow-hidden border-[#073c78] border-b-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(#073c78 1px, transparent 1px), linear-gradient(90deg, #073c78 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute top-28 right-[-14rem] h-16 w-[42rem] rotate-[-37deg] bg-[#c73216] sm:h-20"
        />

        <div className="relative mx-auto grid min-h-[760px] max-w-[1260px] items-center gap-12 px-6 pt-32 pb-16 lg:grid-cols-[1fr_0.82fr] lg:px-12 lg:pt-40 lg:pb-24">
          <div className="relative z-10">
            <p className="font-black font-body text-[#c73216] text-sm uppercase tracking-[0.24em] sm:text-base">
              Associação Memória Lusíada apresenta
            </p>
            <h1 className="mt-7 max-w-[760px] font-black font-body text-[clamp(3.7rem,9vw,8.5rem)] uppercase leading-[0.82] tracking-[-0.065em]">
              {event.nome}
            </h1>
            <p className="mt-9 max-w-[650px] font-body text-[#081f42]/80 text-lg leading-relaxed sm:text-xl">
              {event.subtitulo} O encontro realiza-se a {DATA}, na {LOCAL}, no{" "}
              {ESPAÇO.toLowerCase()}.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 bg-[#073c78] px-6 py-3.5 font-body font-bold text-[#f7edd6] text-sm uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-4"
                href={event.interesse}
              >
                <IconeInteresse aria-hidden="true" size={18} />
                {textoInteresse}
              </a>
              <a
                className="inline-flex items-center gap-2 border-2 border-[#073c78] px-6 py-3 font-body font-bold text-sm uppercase tracking-[0.12em] transition-colors hover:bg-[#073c78] hover:text-[#f7edd6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-4"
                href="#programa"
              >
                Ver programa
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[500px] lg:mx-0 lg:justify-self-end">
            <div
              aria-hidden="true"
              className="absolute -inset-3 translate-x-4 translate-y-4 bg-[#c73216]"
            />
            <img
              alt={`Cartaz do ${event.nome}`}
              className="relative block h-auto w-full border-4 border-[#073c78]"
              decoding="async"
              fetchPriority="high"
              src={event.imagemSocial}
            />
          </figure>
        </div>
      </section>

      <section className="bg-[#073c78] text-[#f7edd6]">
        <div className="mx-auto grid max-w-[1260px] grid-cols-2 border-[#f7edd6]/20 border-x lg:grid-cols-4">
          {[
            { icon: MapPin, rotulo: "Local", valor: LOCAL },
            { icon: CalendarDays, rotulo: "Data", valor: DATA },
            { icon: Clock3, rotulo: "Espaço", valor: "Cafetaria" },
            { icon: Ticket, rotulo: "Participação", valor: event.preço },
          ].map((facto) => (
            <div
              className="border-[#f7edd6]/20 border-b p-5 sm:p-7 lg:border-r lg:border-b-0"
              key={facto.rotulo}
            >
              <facto.icon
                aria-hidden="true"
                className="text-[#ef4b2d]"
                size={22}
              />
              <p className="mt-4 font-body text-[#f7edd6]/60 text-xs uppercase tracking-[0.18em]">
                {facto.rotulo}
              </p>
              <p className="mt-1 font-body font-bold text-base uppercase sm:text-lg">
                {facto.valor}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-32">
        <div>
          <p className="font-black font-body text-[#c73216] text-sm uppercase tracking-[0.22em]">
            {event.modalidade}
          </p>
          <h2 className="mt-5 font-black font-body text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl">
            Uma mesa para jogar, aprender e conviver.
          </h2>
        </div>
        <div className="space-y-6 font-body text-[#081f42]/78 text-lg leading-relaxed">
          <p>
            O encontro decorre no {ESPAÇO.toLowerCase()} da {LOCAL}, a {DATA}.
          </p>
          <p>
            {event.programa[0].titulo} {event.programa[0].hora};{" "}
            {event.programa[1].titulo.toLowerCase()} {event.programa[1].hora};{" "}
            {event.programa[2].titulo.toLowerCase()} {event.programa[2].hora}.
          </p>
          <p className="border-[#c73216] border-l-4 pl-5 font-bold text-[#081f42]">
            {event.preço}
          </p>
        </div>
      </section>

      <ChessPattern />

      <section
        className="mx-auto max-w-[1120px] px-6 py-24 lg:px-12 lg:py-32"
        id="programa"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-black font-body text-[#c73216] text-sm uppercase tracking-[0.22em]">
              Programa
            </p>
            <h2 className="mt-5 max-w-[720px] font-black font-body text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
              Do convívio às medalhas.
            </h2>
          </div>
          <p className="max-w-[300px] font-body text-[#081f42]/65 text-sm leading-relaxed">
            {LOCAL} · {ESPAÇO} · {DATA}
          </p>
        </div>

        <div className="mt-14 overflow-hidden border-2 border-[#073c78]">
          <img
            alt={`Imagem do ${event.nome}`}
            className="block aspect-[768/518] w-full object-cover"
            decoding="async"
            src={event.imagemCartaz}
          />
          <div className="grid lg:grid-cols-3">
            {event.programa.map((item, index) => (
              <div
                className="border-[#073c78] border-b p-7 last:border-b-0 lg:min-h-[250px] lg:border-r lg:border-b-0 lg:last:border-r-0"
                key={item.hora}
              >
                <span className="font-black font-body text-5xl text-[#c73216]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 font-black font-body text-2xl leading-tight tracking-[-0.03em]">
                  {item.titulo}
                </h3>
                <p className="mt-4 font-body text-[#081f42]/70 text-lg leading-relaxed">
                  {item.hora}
                </p>
              </div>
            ))}
          </div>
        </div>

        <a
          className="mt-8 inline-flex items-center gap-2 bg-[#c73216] px-7 py-4 font-black font-body text-sm text-white uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#073c78] focus-visible:outline-offset-4"
          href={event.interesse}
        >
          {event.textoInteresse ?? "Quero receber informações"}
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </section>

      {children}

      <section className="mx-auto max-w-[1120px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <Crown aria-hidden="true" className="text-[#c73216]" size={46} />
            <h2 className="mt-5 font-black font-body text-4xl leading-none tracking-[-0.04em]">
              Perguntas antes da primeira jogada.
            </h2>
          </div>
          <div className="border-[#073c78] border-t-2">
            {perguntas.map((item) => (
              <div
                className="grid gap-3 border-[#073c78]/30 border-b py-7 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"
                key={item.pergunta}
              >
                <h3 className="font-black font-body text-base leading-snug">
                  {item.pergunta}
                </h3>
                <p className="font-body text-[#081f42]/70 leading-relaxed">
                  {item.resposta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7edd6] px-6 py-14 lg:px-12">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-black font-body text-[#c73216] text-sm uppercase tracking-[0.22em]">
              Apoio
            </p>
            <p className="mt-3 max-w-[400px] font-body text-[#081f42]/72 leading-relaxed">
              Com o apoio da Câmara Municipal de Lisboa e das Bibliotecas de
              Lisboa.
            </p>
          </div>
          <img
            alt="Câmara Municipal de Lisboa e Bibliotecas de Lisboa"
            className="h-auto w-full max-w-[260px]"
            decoding="async"
            src="/eventos-marvila/apoio-cml-blx-preto.png"
          />
        </div>
      </section>

      <section className="bg-[#c73216] px-6 py-20 text-white lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="font-body font-bold text-sm text-white/70 uppercase tracking-[0.22em]">
              {LOCAL} · {ESPAÇO} · {DATA}
            </p>
            <h2 className="mt-5 max-w-[760px] font-black font-body text-5xl leading-[0.88] tracking-[-0.05em] sm:text-7xl">
              O teu lugar à mesa começa aqui.
            </h2>
          </div>
          <a
            className="inline-flex shrink-0 items-center gap-2 bg-[#f7edd6] px-7 py-4 font-black font-body text-[#073c78] text-sm uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
            href={event.interesse}
          >
            {textoInteresse}
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <div className="bg-[#081f42] px-6 py-7 text-center text-[#f7edd6]/60">
        <Link
          className="font-body text-xs uppercase tracking-[0.16em] transition-colors hover:text-[#f7edd6]"
          to="/desporto"
        >
          Conhecer os desportos da LUSÍADA
        </Link>
      </div>
    </article>
  );
}
