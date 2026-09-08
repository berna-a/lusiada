import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Crown,
  House,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

const FACTOS = [
  { icon: MapPin, rotulo: "Local", valor: "Lisboa" },
  { icon: CalendarDays, rotulo: "Data", valor: "A anunciar" },
  { icon: Users, rotulo: "Participantes", valor: "Até 30" },
  { icon: Clock3, rotulo: "Duração", valor: "Cerca de 3 horas" },
];

const PASSOS = [
  {
    numero: "01",
    titulo: "Diz-nos que queres jogar",
    texto:
      "Deixa o teu interesse agora. Não é uma inscrição nem te compromete com nada.",
  },
  {
    numero: "02",
    titulo: "Recebe primeiro a data",
    texto:
      "Assim que a sala estiver confirmada, enviamos-te o local, o horário e a abertura das inscrições.",
  },
  {
    numero: "03",
    titulo: "Senta-te à mesa",
    texto:
      "Vem para jogar, aprender e conhecer outras pessoas. O torneio é aberto a todos os níveis.",
  },
];

const PERGUNTAS = [
  {
    pergunta: "Nunca participei num torneio. Posso jogar?",
    resposta:
      "Sim. A primeira edição foi pensada para juntar quem já compete e quem nunca entrou num torneio.",
  },
  {
    pergunta: "Tenho de ser membro da LUSÍADA?",
    resposta:
      "Não. O torneio será aberto ao público e a participação na Associação não é obrigatória.",
  },
  {
    pergunta: "Preciso de levar tabuleiro?",
    resposta:
      "Estamos a reunir o material. As condições finais serão comunicadas antes da abertura das inscrições.",
  },
  {
    pergunta: "Quando sabemos a data e o local?",
    resposta:
      "O torneio será em Lisboa. A data e a sala serão anunciadas assim que o espaço estiver confirmado.",
  },
];

const MAIL_INTERESSE =
  "mailto:bernardo@alusiada.pt?subject=Torneio%20de%20Xadrez%20%E2%80%94%20quero%20ser%20avisado";
const MAIL_ESPACO =
  "mailto:bernardo@alusiada.pt?subject=Espa%C3%A7o%20para%20o%20Torneio%20de%20Xadrez%20%E2%80%94%20LUS%C3%8DADA";

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

export default function TorneioXadrezPage() {
  return (
    <article
      className="-m-4 overflow-hidden bg-[#f2e5c8] text-[#081f42] sm:-m-6 md:-m-10"
      data-nav-theme="light"
    >
      <Seo
        description="Primeiro Torneio Aberto de Xadrez da Associação Memória Lusíada, em Lisboa. Aberto a todos os níveis. Data e local a anunciar."
        image="/torneio-xadrez/social.webp"
        path="/xadrez"
        title="Torneio Aberto de Xadrez em Lisboa — LUSÍADA"
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
              Pensa antes de mexer.
            </h1>
            <p className="mt-9 max-w-[650px] font-body text-[#081f42]/80 text-lg leading-relaxed sm:text-xl">
              O primeiro Torneio Aberto de Xadrez da LUSÍADA junta
              principiantes, curiosos e jogadores experientes à mesma mesa — em
              Lisboa, para todos os níveis.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center gap-2 bg-[#073c78] px-6 py-3.5 font-body font-bold text-[#f7edd6] text-sm uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-4"
                href={MAIL_INTERESSE}
              >
                <Mail aria-hidden="true" size={18} />
                Quero ser avisado
              </a>
              <a
                className="inline-flex items-center gap-2 border-2 border-[#073c78] px-6 py-3 font-body font-bold text-sm uppercase tracking-[0.12em] transition-colors hover:bg-[#073c78] hover:text-[#f7edd6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c73216] focus-visible:outline-offset-4"
                href="#como-funciona"
              >
                Como funciona
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
              alt="Cartaz do primeiro Torneio Aberto de Xadrez da Associação Memória Lusíada"
              className="relative block h-auto w-full border-4 border-[#073c78]"
              decoding="async"
              fetchPriority="high"
              src="/torneio-xadrez/cartaz.webp"
            />
          </figure>
        </div>
      </section>

      <section className="bg-[#073c78] text-[#f7edd6]">
        <div className="mx-auto grid max-w-[1260px] grid-cols-2 border-[#f7edd6]/20 border-x lg:grid-cols-4">
          {FACTOS.map((facto) => (
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
            Aberto significa aberto
          </p>
          <h2 className="mt-5 font-black font-body text-4xl leading-[0.95] tracking-[-0.04em] sm:text-5xl">
            Não é preciso jogar bem para jogar a sério.
          </h2>
        </div>
        <div className="space-y-6 font-body text-[#081f42]/78 text-lg leading-relaxed">
          <p>
            Um torneio pode parecer um lugar reservado a quem conhece todas as
            aberturas e fala numa língua de números. Este não é.
          </p>
          <p>
            Queremos uma sala onde uma pessoa que aprendeu ontem possa sentar-se
            diante de alguém que joga há trinta anos — e ambos saiam de lá com
            vontade de voltar.
          </p>
          <p className="border-[#c73216] border-l-4 pl-5 font-bold text-[#081f42]">
            O que conta não é o teu nível. É a vontade de pensar antes de mexer.
          </p>
        </div>
      </section>

      <ChessPattern />

      <section
        className="mx-auto max-w-[1120px] px-6 py-24 lg:px-12 lg:py-32"
        id="como-funciona"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-black font-body text-[#c73216] text-sm uppercase tracking-[0.22em]">
              Como funciona
            </p>
            <h2 className="mt-5 max-w-[720px] font-black font-body text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
              Da primeira jogada até à mesa.
            </h2>
          </div>
          <p className="max-w-[300px] font-body text-[#081f42]/65 text-sm leading-relaxed">
            A data só será anunciada quando a sala estiver confirmada.
          </p>
        </div>

        <div className="mt-14 grid border-2 border-[#073c78] lg:grid-cols-3">
          {PASSOS.map((passo) => (
            <div
              className="border-[#073c78] border-b p-7 last:border-b-0 lg:min-h-[330px] lg:border-r lg:border-b-0 lg:last:border-r-0"
              key={passo.numero}
            >
              <span className="font-black font-body text-5xl text-[#c73216]">
                {passo.numero}
              </span>
              <h3 className="mt-10 font-black font-body text-2xl leading-tight tracking-[-0.03em]">
                {passo.titulo}
              </h3>
              <p className="mt-4 font-body text-[#081f42]/70 leading-relaxed">
                {passo.texto}
              </p>
            </div>
          ))}
        </div>

        <a
          className="mt-8 inline-flex items-center gap-2 bg-[#c73216] px-7 py-4 font-black font-body text-sm text-white uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#073c78] focus-visible:outline-offset-4"
          href={MAIL_INTERESSE}
        >
          Avisem-me quando abrir
          <ArrowRight aria-hidden="true" size={18} />
        </a>
      </section>

      <section className="relative overflow-hidden bg-[#073c78] text-[#f7edd6]">
        <div
          aria-hidden="true"
          className="absolute right-[-9rem] bottom-[-2rem] h-12 w-[32rem] rotate-[-38deg] bg-[#c73216] sm:h-16"
        />
        <div className="relative mx-auto grid max-w-[1120px] gap-12 px-6 py-24 lg:grid-cols-[0.7fr_1.3fr] lg:px-12 lg:py-28">
          <div className="flex h-28 w-28 items-center justify-center border-4 border-[#f7edd6]">
            <House aria-hidden="true" size={52} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-black font-body text-[#ef4b2d] text-sm uppercase tracking-[0.22em]">
              Uma proposta a quem tem uma sala
            </p>
            <h2 className="mt-5 max-w-[760px] font-black font-body text-4xl leading-none tracking-[-0.04em] sm:text-6xl">
              Procuramos uma casa em Lisboa.
            </h2>
            <p className="mt-7 max-w-[700px] font-body text-[#f7edd6]/76 text-lg leading-relaxed">
              Precisamos de mesas e cadeiras para até 30 pessoas, durante cerca
              de três horas ao fim-de-semana. É um evento cultural, silencioso e
              aberto ao público. Devolvemos a sala como a encontrámos.
            </p>
            <a
              className="mt-8 inline-flex items-center gap-2 border-2 border-[#f7edd6] px-7 py-4 font-body font-bold text-sm uppercase tracking-[0.12em] transition-colors hover:bg-[#f7edd6] hover:text-[#073c78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ef4b2d] focus-visible:outline-offset-4"
              href={MAIL_ESPACO}
            >
              Tenho um espaço
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <Crown aria-hidden="true" className="text-[#c73216]" size={46} />
            <h2 className="mt-5 font-black font-body text-4xl leading-none tracking-[-0.04em]">
              Perguntas antes da primeira jogada.
            </h2>
          </div>
          <div className="border-[#073c78] border-t-2">
            {PERGUNTAS.map((item) => (
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

      <section className="bg-[#c73216] px-6 py-20 text-white lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1120px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="font-body font-bold text-sm text-white/70 uppercase tracking-[0.22em]">
              Lisboa · Data a anunciar
            </p>
            <h2 className="mt-5 max-w-[760px] font-black font-body text-5xl leading-[0.88] tracking-[-0.05em] sm:text-7xl">
              O teu lugar à mesa começa aqui.
            </h2>
          </div>
          <a
            className="inline-flex shrink-0 items-center gap-2 bg-[#f7edd6] px-7 py-4 font-black font-body text-[#073c78] text-sm uppercase tracking-[0.12em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
            href={MAIL_INTERESSE}
          >
            Quero jogar
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
