import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

/**
 * A página do azulejo — a vertente inteira, não o mapa.
 *
 * O mapa é uma das frentes; esta página é a razão de haver frentes. Se
 * alguém só ler uma página da casa sobre azulejo, é esta.
 */

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[17px] text-foreground/90 leading-[1.85]">
      {children}
    </p>
  );
}

type Frente = {
  titulo: string;
  estado: "em curso" | "por começar";
  texto: string;
  para?: string;
};

const FRENTES: Frente[] = [
  {
    titulo: "O mapa",
    estado: "em curso",
    para: "/mapa",
    texto:
      "Um inventário aberto, feito por quem passa na rua. Fotografa-se o painel, o telemóvel marca o sítio, e fica registado com data. Não é o mais completo — há bases académicas que sabem muito mais sobre o azulejo de autor. É o único onde entra o azulejo comum, sem autor conhecido, em prédio sem classificação.",
  },
  {
    titulo: "Defender o que está de pé",
    estado: "em curso",
    texto:
      "Uma fotografia datada é a diferença entre um furto e um caso. O que está a cair, o que já caiu e o que está debaixo de andaimes fica assinalado — e fica assinalado antes, que é quando serve para alguma coisa.",
  },
  {
    titulo: "História e padrão",
    estado: "em curso",
    texto:
      "Fábricas, oficinas, pintores, épocas, padrões que se repetem de Braga a Faro e ninguém sabe explicar porquê. Documentar o que se sabe — e dizer com todas as letras o que ainda não se sabe.",
  },
  {
    titulo: "Um concurso nacional",
    estado: "por começar",
    texto:
      "Com júri, com prémio e com obra feita e assente numa parede. Não para premiar o que já existe: para que se faça mais. Um país que ainda encomenda azulejo é um país onde a arte está viva, não catalogada.",
  },
  {
    titulo: "Voltar a produzir",
    estado: "por começar",
    texto:
      "Há quem saiba pintar e não tenha para quem. Há quem queira encomendar e não saiba a quem. Pôr os dois na mesma sala é metade do trabalho — a outra metade é convencer quem constrói de que uma fachada pode ser mais do que reboco.",
  },
  {
    titulo: "Oficinas",
    estado: "por começar",
    texto:
      "Aprender com as mãos. Um dia à frente de um azulejo em branco chega para perceber porque é que aquilo demora, porque é que o azul corre, e porque é que arrancar um da parede é um disparate.",
  },
  {
    titulo: "Percursos",
    estado: "por começar",
    texto:
      "Roteiros a pé pelas fachadas que valem a viagem, com o que se sabe de cada uma. Levar gente à rua a olhar para cima é a maneira mais barata de criar quem depois defenda.",
  },
];

export default function AzulejoPortuguesPage() {
  return (
    <main
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <Seo
        description="O azulejo é a arte que Portugal pôs na rua. Inventário aberto, concurso nacional, oficinas, percursos e defesa do que ainda está nas paredes — a casa do azulejo português."
        path="/azulejos"
        title="Azulejo — a arte que Portugal pôs na rua | Memória Lusíada"
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-muted-foreground uppercase tracking-[0.25em]">
          Azulejo português
        </p>
        <h1 className="mt-4 font-display text-[40px] text-primary leading-[1.1] sm:text-[56px]">
          A arte que Portugal
          <br />
          pôs na rua
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
      </header>

      <div className="mt-16 space-y-7">
        <p className="text-center font-display text-[22px] text-primary italic leading-[1.4] sm:text-[26px]">
          Nenhum outro país se veste por fora.
        </p>

        <P>
          Há países com grandes museus. Portugal tem grandes ruas. Está tudo lá
          fora, à chuva e à vista — nas estações, nas igrejas, nas fachadas de
          prédios sem nome e sem placa. É a maior galeria do mundo e não cobra
          bilhete.
        </P>

        <P>
          O azulejo não é decoração. É a maneira como um povo aprendeu a olhar:
          o azul sobre branco, a repetição que acalma, a cercadura que fecha, a
          figura que conta uma história a quem passa sem parar. Quando é preciso
          dizer <em>isto é português</em> sem escrever uma palavra, é para aqui
          que toda a gente vem.
        </P>

        <P>
          E está a sair das paredes. De noite, com ferramenta, para mercados
          onde ninguém pergunta de onde veio. Lisboa proíbe a remoção de azulejo
          de fachada desde 2013 e os furtos continuam. O problema não é só o
          roubo: é que quando um painel desaparece quase nunca existe uma
          fotografia com data que prove o que ali estava.
        </P>

        <P>
          <strong className="text-primary">
            Queremos ser a casa de tudo o que diga respeito ao azulejo
            português.
          </strong>{" "}
          Não uma secção sobre azulejo — a casa. O sítio onde está o inventário,
          a história, quem ainda pinta, quem quer aprender, o que está em risco
          e o que se vai fazer a seguir.
        </P>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          As frentes
        </h2>
        <p className="mt-4 font-body text-[17px] text-foreground/80 leading-[1.85]">
          Umas já andam. Outras estão escritas e por começar — e ficam aqui
          escritas na mesma, para que se cobre.
        </p>

        <div className="mt-10 space-y-px overflow-hidden rounded-2xl border border-border/70">
          {FRENTES.map((f) => {
            const corpo = (
              <>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-[21px] text-primary leading-snug">
                    {f.titulo}
                  </h3>
                  <span
                    className={`font-body text-[11px] uppercase tracking-[0.16em] ${
                      f.estado === "em curso"
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {f.estado}
                  </span>
                  {f.para && (
                    <ArrowRight
                      className="ml-auto shrink-0 text-accent"
                      size={17}
                      strokeWidth={1.75}
                    />
                  )}
                </div>
                <p className="mt-2.5 font-body text-[16px] text-foreground/80 leading-[1.7]">
                  {f.texto}
                </p>
              </>
            );
            const classe =
              "block bg-card px-6 py-6 transition-colors sm:px-7 sm:py-7";
            return f.para ? (
              <Link
                className={`${classe} hover:bg-secondary/60`}
                key={f.titulo}
                to={f.para}
              >
                {corpo}
              </Link>
            ) : (
              <div className={classe} key={f.titulo}>
                {corpo}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-20 space-y-7">
        <h2 className="font-display text-[13px] text-accent uppercase tracking-[0.3em]">
          Onde isto vai dar
        </h2>
        <P>
          O objectivo não é modesto e não vale a pena fingir que é. Queremos que
          o azulejo seja a linguagem visual de Portugal — a forma como o país se
          representa a si próprio, e não apenas a lembrança que os outros levam
          na mala.
        </P>
        <P>
          Isso não se decreta nem se pede a ninguém. Faz-se de uma maneira só:
          inventariando o que existe, ensinando quem quer aprender, encomendando
          obra nova, levando gente à rua a olhar, e não deixando passar em
          silêncio o que é arrancado.
        </P>
      </section>

      <section className="mt-16 rounded-2xl border border-accent/30 bg-secondary px-7 py-9 text-center sm:px-10">
        <h2 className="font-display text-[24px] text-primary leading-snug sm:text-[28px]">
          Comece pela parede da sua rua
        </h2>
        <p className="mx-auto mt-4 max-w-[460px] font-body text-[16px] text-foreground/80 leading-relaxed">
          Não é preciso perceber de azulejo. É preciso passar por lá com o
          telemóvel na mão. O primeiro painel é o mais difícil de arranjar e o
          mais importante de todos.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[15px] text-primary-foreground transition-opacity hover:opacity-90"
            to="/azulejos/registar"
          >
            <Camera size={16} strokeWidth={1.75} />
            Fotografar um painel
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[15px] text-primary transition-colors hover:bg-accent/10"
            to="/mapa"
          >
            Abrir o mapa
          </Link>
        </div>
      </section>
    </main>
  );
}
