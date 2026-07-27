import {
  BookOpen,
  Compass,
  Landmark,
  Mail,
  Scale,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

/** Um parágrafo do corpo — mesma métrica de leitura do Manifesto. */
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[17px] text-foreground/85 leading-[1.85]">
      {children}
    </p>
  );
}

/** Antetítulo de secção, em versaletes espaçados. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] text-accent uppercase tracking-[0.28em]">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-display text-[30px] text-primary leading-[1.15] sm:text-[38px]">
      {children}
    </h2>
  );
}

const LENTES = [
  {
    icon: ScrollText,
    numero: "I",
    nome: "Língua",
    lema: "O mapa genético da nossa língua.",
    corpo:
      "Os Lusíadas são o maior corpus coerente do português quinhentista, pela mão do maior mestre que a língua teve. Propomo-nos ao censo completo do léxico camoniano — que palavras morreram, quais sobreviveram, quais Camões cunhou. E à reconstrução da fonética de 1572: há rimas e jogos sonoros que hoje ninguém ouve, versos que deixaram de rimar em português moderno mas rimavam na boca de Camões.",
    remate:
      "Uma camada musical inteira do poema está surda há 400 anos — e é recuperável.",
  },
  {
    icon: Landmark,
    numero: "II",
    nome: "História",
    lema: "Os desvios são a impressão digital das intenções.",
    corpo:
      "Camões escreveu com as crónicas abertas na mesa — Castanheda, Barros. Cruzar cada estrofe com as suas fontes produz um mapa inédito: onde segue a crónica, narrativa fiel; onde diverge, matéria de estudo. Cada desvio deliberado é Camões a editorializar. O poema torna-se assim fonte dupla: do que sucedeu em 1498, e de como o Portugal de 1572 se via a si próprio.",
    remate: "Em vésperas de Alcácer Quibir — o último suspiro antes da queda.",
  },
  {
    icon: Sparkles,
    numero: "III",
    nome: "Mística",
    lema: "A arquitectura simbólica da obra.",
    corpo:
      "Camões era entendedor e mestre da linguagem simbólica do seu tempo, e parte substancial da sua mensagem é entregue nessa gramática — mitológica, hermética, astrológica. A Máquina do Mundo do Canto X como descrição celeste testável; a viagem lida como percurso iniciático; o sincretismo cristão-pagão como código neoplatónico. Hipóteses, todas elas, para submeter a método.",
    remate: "Ciência de mente aberta — mas ciência.",
  },
] as const;

const CONSELHO = [
  {
    titulo: "Lente linguística",
    desc: "Filologia, história da língua, fonética histórica do português quinhentista.",
    estado: "Por preencher",
  },
  {
    titulo: "Lente histórica",
    desc: "História moderna, cronística portuguesa e o contexto de 1572.",
    estado: "Por preencher",
  },
  {
    titulo: "Lente literária e mitológica",
    desc: "Estudos camonianos, epopeia clássica, mitologia e recepção da obra.",
    estado: "Em diálogo",
  },
] as const;

export default function DecifradosPage() {
  return (
    <main data-nav-theme="light">
      <Seo
        description="Análise computacional multi-agente d'Os Lusíadas, verso a verso, em três lentes — língua, história e mística. Um projecto de investigação da Associação Memória Lusíada."
        path="/os-lusiadas/decifrados"
        title="Os Lusíadas Decifrados — projecto de investigação"
        type="article"
      />

      {/* ── Frontispício ───────────────────────────────────────────── */}
      <header className="mx-auto max-w-[820px] px-6 pt-32 pb-4 text-center sm:pt-40">
        <Eyebrow>Associação Memória Lusíada · Projecto de investigação</Eyebrow>
        <h1 className="mt-5 font-display text-[44px] text-primary leading-[1.02] sm:text-[68px]">
          Os Lusíadas
          <br />
          <span className="text-accent">Decifrados</span>
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
        <p className="mx-auto mt-8 max-w-[560px] font-display text-[20px] text-primary/80 italic leading-[1.5] sm:text-[24px]">
          Ler o poema verso a verso, com as ferramentas do nosso século e o
          rigor do método académico.
        </p>
        <p className="mx-auto mt-6 max-w-[600px] font-body text-[16px] text-foreground/65 leading-[1.8]">
          Uma leitura sistemática das 1102 estâncias em três lentes — língua,
          história e mística — sujeita a contraditório em cada passo, e
          devolvida ao público na plataforma onde a obra já se lê.
        </p>
      </header>

      {/* ── Premissa ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 pt-20 pb-16">
        <Eyebrow>A premissa</Eyebrow>
        <SectionTitle>
          Quatro séculos de leitura, e ainda há poema por ler
        </SectionTitle>
        <div className="mt-8 space-y-6">
          <P>
            Os Lusíadas foram lidos, anotados e editados por gerações de
            estudiosos. Existem edições críticas notáveis e uma bibliografia
            camoniana vastíssima. Nada disto se substitui — e este projecto não
            pretende substituí-lo.
          </P>
          <P>
            O que mudou foi a escala do que é possível examinar. Uma leitura que
            cruze, para <em>cada verso</em>, o léxico, a métrica, as fontes
            cronísticas, os modelos clássicos e o aparato simbólico da época
            exigiria décadas de trabalho humano. É um problema de dimensão, não
            de inteligência: sempre foi possível fazê-lo para uma estância;
            nunca foi praticável fazê-lo para todas.
          </P>
          <P>
            É esse trabalho de varrimento exaustivo que hoje se pode
            instrumentar. Não para produzir conclusões — para produzir{" "}
            <em>matéria-prima verificável</em>, que investigadores humanos
            depois julgam.
          </P>
        </div>
      </section>

      {/* ── As três lentes ─────────────────────────────────────────── */}
      <section className="border-accent/15 border-y bg-secondary/30">
        <div className="mx-auto max-w-[900px] px-6 py-20">
          <div className="text-center">
            <Eyebrow>O objecto</Eyebrow>
            <SectionTitle>As três lentes</SectionTitle>
            <p className="mx-auto mt-5 max-w-[520px] font-body text-[15px] text-foreground/60 leading-relaxed">
              Cada estância é lida três vezes, por três disciplinas distintas,
              que não partilham pressupostos entre si.
            </p>
          </div>

          <div className="mt-14 space-y-6">
            {LENTES.map((lente) => (
              <article
                className="rounded-2xl border border-accent/25 bg-background/70 p-7 sm:p-9"
                key={lente.nome}
              >
                <div className="flex items-start gap-5">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/12 text-accent"
                  >
                    <lente.icon size={20} strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[12px] text-accent tracking-[0.2em]">
                      {lente.numero}
                    </p>
                    <h3 className="mt-1 font-display text-[26px] text-primary leading-tight">
                      {lente.nome}
                    </h3>
                    <p className="mt-2 font-display text-[17px] text-primary/70 italic">
                      {lente.lema}
                    </p>
                  </div>
                </div>
                <p className="mt-6 font-body text-[16px] text-foreground/85 leading-[1.8]">
                  {lente.corpo}
                </p>
                <p className="mt-5 border-accent/40 border-l-2 pl-4 font-body text-[15px] text-foreground/60 italic leading-relaxed">
                  {lente.remate}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── O método ───────────────────────────────────────────────── */}
      {/* Fundo escuro: marcar para a navbar inverter as cores ao passar por cima. */}
      <section
        className="bg-primary text-primary-foreground"
        data-nav-theme="dark"
      >
        <div className="mx-auto max-w-[820px] px-6 py-20">
          <div className="text-center">
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.28em]">
              O método
            </p>
            <h2 className="mt-3 font-display text-[30px] leading-[1.15] sm:text-[38px]">
              Um concílio que se contradiz
            </h2>
          </div>

          <div className="mt-10 space-y-6">
            <p className="font-body text-[17px] text-primary-foreground/85 leading-[1.85]">
              O risco de aplicar modelos de linguagem a texto arcaico é
              conhecido: produzem leituras plausíveis e infundadas com a mesma
              fluência com que produzem leituras correctas. Um sistema que
              procura confirmação encontra-a sempre.
            </p>
            <p className="font-body text-[17px] text-primary-foreground/85 leading-[1.85]">
              O nosso desenho inverte o incentivo. Cada estância é submetida a
              três agentes com mandatos opostos — um filólogo céptico, um
              historiador das fontes, um leitor da tradição simbólica — que
              analisam em paralelo e depois se contra-interrogam. Um quarto
              agente modera e só regista o que sobreviveu ao ataque dos outros.
              Toda a afirmação nasce ligada à passagem e à fonte que a sustenta;
              o que não se ancora, cai.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Scale,
                t: "Contraditório obrigatório",
                d: "Nenhuma leitura passa sem sobreviver à refutação das outras duas lentes.",
              },
              {
                icon: BookOpen,
                t: "Ancoragem documental",
                d: "Cada achado remete para o verso e para a fonte — verificável, citável, refutável.",
              },
              {
                icon: Compass,
                t: "Hipótese, não veredicto",
                d: "O sistema propõe. A validação científica é humana, e é dela que depende a publicação.",
              },
            ].map((item) => (
              <div
                className="rounded-xl border border-primary-foreground/15 p-6"
                key={item.t}
              >
                <item.icon
                  className="text-accent"
                  size={20}
                  strokeWidth={1.5}
                />
                <h3 className="mt-4 font-display text-[17px] leading-snug">
                  {item.t}
                </h3>
                <p className="mt-2 font-body text-[14px] text-primary-foreground/70 leading-relaxed">
                  {item.d}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center font-display text-[19px] text-accent italic leading-relaxed">
            O que sobreviver fica blindado precisamente porque o método foi
            desenhado para o matar.
          </p>
        </div>
      </section>

      {/* ── A plataforma ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 py-20">
        <Eyebrow>A plataforma</Eyebrow>
        <SectionTitle>A investigação tem para onde ir</SectionTitle>
        <div className="mt-8 space-y-6">
          <P>
            Este projecto não começa numa página em branco. O poema já está
            publicado, integral e gratuito, em{" "}
            <Link
              className="text-primary underline decoration-accent/40 decoration-dotted underline-offset-4 transition-colors hover:decoration-accent"
              to="/os-lusiadas"
            >
              oslusiadas.pt
            </Link>{" "}
            — legível nas três grafias da língua, com dicionário de época, plano
            de leitura e anotação verso a verso pela comunidade.
          </P>
          <P>
            O modelo de leitura é o de uma plataforma de anotação aberta: cada
            estância tem o seu espaço de discussão, onde as contribuições mais
            valiosas sobem e o contraditório permanece visível. O que a
            investigação apurar entra por essa porta — junto ao verso a que diz
            respeito, ao alcance de quem estuda a obra.
          </P>
          <P>
            Está aí a razão de ser deste trabalho. Não é produzir mais um volume
            que fique por ler: é aproximar o texto de quem hoje o encontra pela
            primeira vez — no ensino básico, no secundário, na universidade —
            sem lhe baixar o nível.
          </P>
        </div>
      </section>

      {/* ── Conselho científico ────────────────────────────────────── */}
      <section className="border-accent/15 border-y bg-secondary/30">
        <div className="mx-auto max-w-[820px] px-6 py-20">
          <div className="text-center">
            <Eyebrow>O convite</Eyebrow>
            <SectionTitle>Conselho científico</SectionTitle>
            <p className="mx-auto mt-6 max-w-[600px] font-body text-[16px] text-foreground/75 leading-[1.8]">
              Temos a capacidade técnica e temo-la comprometida a título
              gratuito. O que nos falta — e é o que verdadeiramente decide a
              qualidade deste projecto — é orientação científica.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {CONSELHO.map((c) => (
              <div
                className="rounded-xl border border-accent/25 bg-background/70 p-6"
                key={c.titulo}
              >
                <p className="font-body text-[10px] text-accent uppercase tracking-[0.2em]">
                  {c.estado}
                </p>
                <h3 className="mt-3 font-display text-[19px] text-primary leading-snug">
                  {c.titulo}
                </h3>
                <p className="mt-2 font-body text-[14px] text-foreground/70 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-accent/30 bg-background/70 p-7 sm:p-9">
            <h3 className="font-display text-[20px] text-primary">
              O que pedimos a quem aceite
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                "Validar o desenho metodológico de cada lente antes de se produzir seja o que for.",
                "Arbitrar o que se publica — nada sai com chancela científica sem passar por este crivo.",
                "Indicar a bibliografia e as edições de referência que devem alimentar o trabalho.",
                "Emprestar o nome ao conselho, com a liberdade de o retirar se o rumo deixar de merecer.",
              ].map((linha) => (
                <li
                  className="flex gap-3 font-body text-[15px] text-foreground/80 leading-relaxed"
                  key={linha}
                >
                  <span aria-hidden="true" className="mt-2 text-accent">
                    —
                  </span>
                  <span>{linha}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 border-accent/30 border-t pt-6 font-body text-[15px] text-foreground/65 leading-relaxed">
              Não pedimos trabalho de investigação não remunerado nem
              exclusividade. Pedimos rigor — e o direito de o invocar.
            </p>
          </div>
        </div>
      </section>

      {/* ── Estado e calendário ────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 py-20">
        <Eyebrow>Estado</Eyebrow>
        <SectionTitle>Onde estamos, com franqueza</SectionTitle>
        <div className="mt-8 space-y-6">
          <P>
            A Associação Memória Lusíada foi constituída em 2024 para assinalar
            o quinto centenário do nascimento de Camões. A plataforma de leitura
            está no ar e é o nosso activo mais sólido. A equipa técnica —
            engenharia de software — trabalha em regime gratuito. O portefólio
            está disponível a quem o queira examinar.
          </P>
          <P>
            O financiamento da componente computacional será pedido ao programa{" "}
            <em>Claude Science</em>, da Anthropic, sob a forma de créditos de
            utilização. A candidatura formal está em preparação para o próximo
            trimestre — deliberadamente adiada para que o conselho científico
            esteja constituído antes de se submeter, e não depois.
          </P>
          <P>
            É esta a ordem que nos parece correcta: primeiro o crivo académico,
            depois os meios. Um projecto desta natureza sem supervisão
            científica não merecia ser financiado — e nós não o quereríamos
            assim.
          </P>
        </div>

        <div className="mt-12 rounded-2xl border border-accent/25 bg-secondary/40 p-7 text-center sm:p-9">
          <Mail className="mx-auto text-accent" size={22} strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-[22px] text-primary">
            Falar connosco
          </h3>
          <p className="mx-auto mt-3 max-w-[440px] font-body text-[15px] text-foreground/70 leading-relaxed">
            A investigadores, professores e instituições que queiram conhecer o
            desenho do projecto em detalhe — ou apontar-lhe defeitos.
          </p>
          <a
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            href="mailto:bernardo@alusiada.pt?subject=Os%20Lusíadas%20Decifrados"
          >
            bernardo@alusiada.pt
          </a>
          <p className="mt-6 font-body text-[13px] text-muted-foreground">
            Associação Memória Lusíada · NIF 518 533 301
          </p>
        </div>
      </section>

      {/* ── Remate ─────────────────────────────────────────────────── */}
      <section className="border-accent/15 border-t">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center">
          <p className="font-display text-[24px] text-primary italic leading-[1.5] sm:text-[28px]">
            «As Armas e os Barões assinalados»
          </p>
          <p className="mt-5 font-body text-[14px] text-muted-foreground">
            Canto I, estância 1 — o princípio de tudo o que temos para ler.
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            to="/os-lusiadas"
          >
            Ler o poema
          </Link>
        </div>
      </section>
    </main>
  );
}
