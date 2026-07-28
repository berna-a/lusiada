import {
  BookOpen,
  Compass,
  FlaskConical,
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
    lema: "As palavras que o poema pressupõe que já se sabem.",
    corpo:
      "O censo do léxico camoniano: que palavras morreram, quais sobreviveram, quais mudaram de sentido debaixo do mesmo som, quais Camões cunhou — e quais nunca escreveu. E a camada sonora: há versos que deixaram de rimar em português moderno e que fechavam na boca de quem os leu em 1572. Não a inventamos: lemo-los segundo o sistema fonológico já descrito para o quinhentismo, e declaramos as escolhas em nota.",
    remate:
      "Uma camada de música do poema está surda há quatro séculos. Não está perdida — está surda.",
  },
  {
    icon: Landmark,
    numero: "II",
    nome: "História",
    lema: "Onde o poema se afasta da crónica, alguém decidiu.",
    corpo:
      "Camões escreveu com as crónicas abertas na mesa — Castanheda, Barros, Góis, Osório. Cruzar cada estância com as suas fontes distingue o que narra do que altera, e cada alteração é matéria de estudo. Com uma cautela que não pode faltar: o texto de 1572 passou pela licença do Santo Ofício, assinada por Frei Bartolomeu Ferreira, e o de 1584 foi mexido. Antes de atribuir uma escolha ao poeta, há que perguntar se é dele.",
    remate:
      "Nem toda a decisão que está no texto é uma decisão de Camões — e essa é a primeira coisa a apurar.",
  },
  {
    icon: Scale,
    numero: "III",
    nome: "Poética",
    lema: "A oficina: o metro, a oitava, os modelos.",
    corpo:
      "A disciplina central dos estudos camonianos, e a que tem mais gente viva a trabalhá-la. A oitava-rima e o que ela obriga; a cesura e o que ela permite; a imitatio de Virgílio, de Ariosto, de Sannazaro, verificada verso a verso e não por impressão; a retórica das falas; a arquitectura dos dez cantos. É aqui que a afirmação vaga — «isto é ariostesco» — se converte em contagem, e portanto em coisa que se pode contestar.",
    remate: "É aqui que o poema deixa de ser assunto e passa a ser feitura.",
  },
  {
    icon: Sparkles,
    numero: "IV",
    nome: "Símbolo",
    lema: "O que um leitor de 1572 via sem esforço, e nós deixámos de ver.",
    corpo:
      "Em 1572, a mitologia era língua franca de gente instruída e a cosmografia lia-se com a astrologia ao lado. Reconstituímos esse código pelas fontes que Camões podia ter à mão — a Esfera de Sacrobosco, os Conimbricenses, Pedro Nunes, os mitógrafos, o neoplatonismo amoroso que entra em Portugal por Leão Hebreu — e medimos os desvios, como na lente histórica. O poema traz a sua própria objecção mais dura: é Tétis quem avisa que os deuses «fomos fabulosos, fingidos de mortal e cego engano» (X, 82). Começamos por aí.",
    remate:
      "Não procuramos um segredo escondido. Procuramos a literacia que o poema dá por adquirida.",
  },
] as const;

const ORGAOS_SOCIAIS = [
  {
    orgao: "Direcção",
    membros: [
      ["Bernardo Abreu", "Presidente"],
      ["Manuel Dugos Pimentel", "Vice-presidente"],
      ["Daniel Leal", "Secretário Geral"],
    ],
  },
  {
    orgao: "Mesa da Assembleia Geral",
    membros: [
      ["Ricardo Santos", "Presidente"],
      ["Vasco Semedo", "1.º Secretário"],
      ["Cristina Fernandes", "2.ª Secretária"],
    ],
  },
  {
    orgao: "Conselho Fiscal",
    membros: [
      ["João Silva", "Presidente"],
      ["Gonçalo Santos", "Vice-presidente"],
      ["Afonso Santos", "Vogal"],
    ],
  },
  {
    orgao: "Vogais",
    membros: [
      ["João Oliveira", ""],
      ["Tiago Lobo", ""],
      ["Tomás Duarte", ""],
      ["Guilherme Pinho", ""],
      ["Gonçalo Chaveiro", ""],
    ],
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
    titulo: "Lente poética",
    desc: "Métrica, oitava-rima, épica clássica e a oficina do verso camoniano.",
    estado: "Por preencher",
  },
  {
    titulo: "Lente literária e mitológica",
    desc: "Estudos camonianos, mitologia, tradição simbólica e recepção da obra.",
    estado: "Em diálogo",
  },
] as const;

export default function DecifradosPage() {
  return (
    <main data-nav-theme="light">
      <Seo
        description="Análise computacional multi-agente d'Os Lusíadas, verso a verso, em quatro lentes — língua, história, poética e símbolo. Um projecto de investigação de oslusiadas.pt."
        path="/os-lusiadas/decifrados"
        title="Os Lusíadas Decifrados — projecto de investigação"
        type="article"
      />

      {/* ── Frontispício ───────────────────────────────────────────── */}
      <header className="mx-auto max-w-[820px] px-6 pt-32 pb-4 text-center sm:pt-40">
        <Eyebrow>Projecto de investigação</Eyebrow>
        <h1 className="mt-5 font-display text-[44px] text-primary leading-[1.02] sm:text-[68px]">
          Os Lusíadas
          <br />
          <span className="text-accent">Decifrados</span>
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
        <p className="mx-auto mt-8 max-w-[560px] font-display text-[20px] text-primary/80 italic leading-[1.5] sm:text-[24px]">
          Ler o poema verso a verso, com os instrumentos do nosso século e o
          método da casa.
        </p>
        <p className="mx-auto mt-6 max-w-[600px] font-body text-[16px] text-foreground/65 leading-[1.8]">
          Decifrar, aqui, não é descobrir um segredo. É restituir uma literacia:
          devolver ao poema aquilo que em 1572 se lia sem esforço e hoje já não
          se lê. Uma leitura sistemática das 1102 estâncias, em quatro lentes,
          sujeita a contraditório em cada passo.
        </p>
      </header>

      {/* ── Premissa ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 pt-20 pb-16">
        <Eyebrow>A premissa</Eyebrow>
        <SectionTitle>
          O poema pressupõe um leitor que deixou de existir
        </SectionTitle>
        <div className="mt-8 space-y-6">
          <P>
            <em>Os Lusíadas</em> foram lidos, anotados e editados por gerações
            de estudiosos. Existem edições críticas notáveis e uma bibliografia
            camoniana que ninguém domina inteira. Nada disto se substitui, e
            este projecto não pretende substituí-lo. Trabalha à sombra dessas
            obras, não ao lado delas.
          </P>
          <P>
            O que mudou não foi a inteligência disponível: foi a escala do que
            se pode examinar sem escolher. Toda a crítica camoniana argumenta
            por passagem exemplar — a estância eleita, lida até ao fim. É bom
            método, e tem uma consequência que ninguém quis: quatro séculos de
            atenção concentraram-se em cerca de cinquenta estâncias, e as
            restantes mil chegaram até hoje quase sem comentário. Sempre foi
            possível fazer o levantamento completo de uma estância. Nunca foi
            praticável fazê-lo para todas.
          </P>
          <P>
            E há uma coisa que só o levantamento exaustivo vê. A leitura humana
            encontra o que está lá, porque a atenção é puxada pelo que existe.
            Só o censo completo torna visível o que <em>não</em> está: a palavra
            que Camões nunca usa, a rima que evita, o episódio das crónicas que
            se recusou a versificar. Num poeta que escreve sob censura, o
            silêncio é o gesto mais deliberado que praticou — e é ilegível a
            olho nu.
          </P>
        </div>
      </section>

      {/* ── O texto ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 pb-20">
        <Eyebrow>O texto</Eyebrow>
        <SectionTitle>Qual é o Camões que lemos</SectionTitle>
        <div className="mt-8 space-y-6">
          <P>
            Esta é a primeira pergunta que se faz a um projecto assim, e não
            deve ficar para o fim.
          </P>
          <P>
            Não há autógrafo d'<em>Os Lusíadas</em>. Ninguém, em quatro séculos
            e meio, leu o que Camões escreveu pelo seu punho: lemos o que um
            compositor tipográfico assentou. Há duas impressões de 1572 e a
            discussão sobre qual delas é a primeira não está encerrada; a edição
            de 1584 traz alterações; e a grafia de qualquer uma delas é da
            oficina, não do poeta.
          </P>
          <P>
            Este projecto não decide essa questão — não lhe compete. Compete-lhe
            declará-la e trabalhar dentro dela.{" "}
            <em>A primeira tarefa não é interpretativa</em>: é a colação
            sistemática dos testemunhos, verso a verso, variante a variante, com
            o aparato aberto e citável. É trabalho ingrato, é mecânico, é
            exactamente aquilo em que a máquina é indiscutivelmente melhor do
            que um homem cansado — e sem ele, tudo o que se disser a seguir é
            comentário sobre um texto que não se sabe qual é.
          </P>
          <P>
            A camada de leitura pública continua a ser o texto modernizado, para
            quem chega ao poema pela primeira vez. A camada de trabalho é outra,
            e será nomeada estância a estância.
          </P>
        </div>
      </section>

      {/* ── As quatro lentes ───────────────────────────────────────── */}
      <section className="border-accent/15 border-y bg-secondary/30">
        <div className="mx-auto max-w-[900px] px-6 py-20">
          <div className="text-center">
            <Eyebrow>O objecto</Eyebrow>
            <SectionTitle>As quatro lentes</SectionTitle>
            <p className="mx-auto mt-5 max-w-[520px] font-body text-[15px] text-foreground/60 leading-relaxed">
              Cada estância é lida quatro vezes, por quatro disciplinas com
              hábitos diferentes e bibliografias diferentes.
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
              Uma disputa desenhada para perder
            </h2>
          </div>

          <div className="mt-10 space-y-6">
            <p className="font-body text-[17px] text-primary-foreground/85 leading-[1.85]">
              O risco de aplicar modelos de linguagem a texto antigo é conhecido
              e é grave: produzem leituras plausíveis e infundadas com a mesma
              fluência com que produzem leituras correctas. Um sistema que
              procura confirmação encontra-a sempre.
            </p>
            <p className="font-body text-[17px] text-primary-foreground/85 leading-[1.85]">
              O desenho inverte o incentivo. Cada estância é submetida a quatro
              leitores automáticos com mandatos opostos, que analisam em
              separado e depois se contra-interrogam; um quinto modera e regista
              apenas o que sobreviveu ao ataque dos outros. Toda a afirmação
              nasce ligada à passagem e à fonte que a sustenta.
            </p>
            <p className="font-body text-[17px] text-primary-foreground/85 leading-[1.85]">
              <strong>
                E é preciso dizer aquilo que este arranjo não resolve.
              </strong>{" "}
              Quatro leitores automáticos com papéis diferentes não são quatro
              disciplinas independentes: partilham substrato e partilham os
              lugares-comuns herdados sobre o Renascimento português.
              Contradizerem-se por mandato não fabrica independência. O que a
              fabrica é obrigar cada lente a ancorar em evidência externa de
              tipo diferente — uma concordância lexical, um fac-símile, uma
              crónica — e deitar fora tudo o que se apoie apenas no que a
              máquina julga saber.
            </p>
            <p className="font-body text-[17px] text-primary-foreground/85 leading-[1.85]">
              Por isso o método traz duas armadilhas montadas contra si próprio.{" "}
              <strong>Prova cega:</strong> correr o sistema sobre estâncias
              cujas fontes já foram estabelecidas por investigadores conhecidos,
              e publicar três números antes de qualquer outra coisa — o que
              acertou, o que não viu, e o que inventou.{" "}
              <strong>Controlo negativo:</strong> dar-lhe a ler uma oitava de
              outro poeta quinhentista disfarçada de Camões, e uma estância
              genuína com um verso adulterado. Se descobrir arquitectura
              simbólica no que não é dele, o método está morto, e é melhor
              sabê-lo por nós do que por um revisor.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Scale,
                t: "Contraditório obrigatório",
                d: "Nenhuma leitura passa sem sobreviver à refutação das outras lentes.",
              },
              {
                icon: BookOpen,
                t: "Ancoragem documental",
                d: "Cada achado remete para o verso e para a fonte — verificável, citável, refutável.",
              },
              {
                icon: Compass,
                t: "Hipótese, não veredicto",
                d: "O sistema propõe; o juízo é humano, e é dele que depende a publicação.",
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
            O critério «o que não se ancora, cai» não separa o falso do
            verdadeiro: separa o documentável do indocumentável. Este método
            levanta a anatomia do poema; não o lê.
          </p>
        </div>
      </section>

      {/* ── A prova ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 py-20">
        <Eyebrow>A prova</Eyebrow>
        <SectionTitle>Uma estância, de ponta a ponta</SectionTitle>
        <div className="mt-8 space-y-6">
          <P>
            Prometer é fácil. Aqui está o género de coisa que se produz,
            apresentado como aquilo que é — hipótese à espera de arbitragem, e
            não achado.
          </P>
          <P>
            <strong>Canto X, estâncias 82 a 84.</strong> Tétis desfaz-se a si
            própria: «porque eu, Saturno e Jano, Júpiter, Juno, fomos fabulosos,
            fingidos de mortal e cego engano. Só pera fazer versos deleitosos
            servimos». É a refutação mais forte que existe contra qualquer
            leitura simbólica do poema — e está dentro do poema.
          </P>
          <P>
            Duas estâncias adiante, porém, o texto conserva uma máquina do mundo
            governada «por espíritos mil que têm prudência», e logo a seguir
            esclarece: «Que os Anjos de celeste companhia deuses o sacro verso
            está chamando». A fábula é despromovida; a cosmologia fica de pé,
            mas convertida em angelologia cristã.
          </P>
          <P>
            <strong>A lente do símbolo propõe</strong> que a fronteira do poema
            não passa entre crer e não crer nos deuses, mas entre a fábula e a
            doutrina — e que essa fronteira é o objecto de estudo.{" "}
            <strong>A lente da poética objecta</strong> que a passagem é
            primeiro um problema de decoro épico: o modo de conciliar máquina
            pagã e ortodoxia, e que Camões não é o primeiro a resolvê-lo assim.{" "}
            <strong>A lente histórica pergunta</strong> o que destas três
            estâncias responde à licença do Santo Ofício e o que responde ao
            poeta.
          </P>
          <P>
            Nenhuma das três vence sozinha. É esse o ponto: o que fica registado
            é a disputa, ancorada ao verso, à espera de quem a arbitre.
          </P>
        </div>
      </section>

      {/* ── A plataforma ───────────────────────────────────────────── */}
      <section className="border-accent/15 border-t bg-secondary/30">
        <div className="mx-auto max-w-[760px] px-6 py-20">
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
              — legível em três grafias, com dicionário de época, plano de
              leitura e anotação verso a verso pela comunidade.
            </P>
            <P>
              O modelo é o de uma plataforma de anotação aberta: cada estância
              tem o seu espaço de discussão, e o contraditório permanece
              visível. O que a investigação apurar entra por essa porta, junto
              ao verso a que diz respeito, ao alcance de quem estuda a obra e de
              quem a está a ler pela primeira vez.
            </P>
            <P>
              Tudo o que se produzir — corpus anotado, colação, aparato — fica
              depositado em acesso aberto, com licença declarada e forma de
              citação estável por estância, para que sobreviva a este projecto e
              a quem o faz. Quem o quiser usar contra nós, usa.
            </P>
            <P>
              Está aí a razão de ser do trabalho. Não é produzir mais um volume
              que fique por abrir: é pôr o texto ao alcance de quem hoje o
              encontra pela primeira vez — no ensino básico, no secundário, na
              universidade, e em português que já não é só de Portugal — sem lhe
              baixar o nível.
            </P>
          </div>
        </div>
      </section>

      {/* ── Conselho científico ────────────────────────────────────── */}
      <section className="mx-auto max-w-[820px] px-6 py-20">
        <div className="text-center">
          <Eyebrow>O convite</Eyebrow>
          <SectionTitle>Conselho científico</SectionTitle>
          <p className="mx-auto mt-6 max-w-[600px] font-body text-[16px] text-foreground/75 leading-[1.8]">
            Temos os meios técnicos e temo-los comprometidos. O que nos falta é
            quem escreva o exame que este trabalho tem de passar.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[600px] space-y-4">
          <P>
            Não convidamos ninguém para fiscalizar o trabalho alheio. Convidamos
            para uma coisa que não existe e que ficará feita:{" "}
            <strong>
              o padrão pelo qual se afere a leitura automática do português
              quinhentista literário.
            </strong>{" "}
            Não há nenhum. Quem o fizer, fá-lo para quem vier depois, e o
            objecto certo para o fazer é o mais difícil que a língua tem.
          </P>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <div className="mt-12 rounded-2xl border border-accent/30 bg-secondary/40 p-7 sm:p-9">
          <h3 className="font-display text-[20px] text-primary">
            Na prática, é isto
          </h3>
          <ul className="mt-5 space-y-3">
            {[
              [
                "Escrever o gabarito.",
                "Escolher estâncias e estabelecer, à mão, a leitura correcta contra a qual a máquina será medida. É trabalho de autoria, e é assinado.",
              ],
              [
                "Definir o que conta como erro",
                "em cada lente, e o que conta como achado.",
              ],
              [
                "Indicar as edições e a bibliografia",
                "que devem alimentar o trabalho — e as que não devem.",
              ],
              [
                "Arbitrar o que se publica.",
                "Nada sai com o selo do conselho sem passar por aqui.",
              ],
            ].map(([forte, resto]) => (
              <li
                className="flex gap-3 font-body text-[15px] text-foreground/80 leading-relaxed"
                key={forte}
              >
                <span aria-hidden="true" className="mt-2 text-accent">
                  —
                </span>
                <span>
                  <strong>{forte}</strong> {resto}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-7 border-accent/30 border-t pt-6 font-body text-[15px] text-foreground/75 leading-relaxed">
            Onde a máquina reprovar está o resultado mais interessante: cada
            falha assinala um ponto em que a leitura do poema exige algo que não
            está no texto. Esse mapa nunca foi desenhado, e é matéria de tese
            para quem entrar agora.
          </p>
          <p className="mt-4 font-body text-[15px] text-foreground/65 leading-relaxed">
            Não pedimos investigação não remunerada nem exclusividade. Pedimos
            rigor — e o direito de o invocar.
          </p>
        </div>
      </section>

      {/* ── Estado ─────────────────────────────────────────────────── */}
      <section className="border-accent/15 border-t bg-secondary/30">
        <div className="mx-auto max-w-[760px] px-6 py-20">
          <Eyebrow>Estado</Eyebrow>
          <SectionTitle>Onde estamos, com franqueza</SectionTitle>
          <div className="mt-8 space-y-6">
            <P>
              O trabalho começou em 2024, ao redor do quinto centenário do
              nascimento de Camões. A plataforma de leitura está no ar e é a
              parte sólida. A equipa de engenharia trabalha em regime gratuito.
              O desenho completo do projecto está disponível a quem o peça, e é
              enviado inteiro — incluindo o que ainda não sabemos fazer.
            </P>
            <P>
              Nenhuma das quatro cadeiras do conselho está ocupada. Preferimos
              declará-lo a insinuar o contrário: um conselho científico começa
              com o primeiro nome, e o primeiro nome fixa todos os que vêm
              depois.
            </P>
            <P>
              Esta é a ordem que nos parece correcta: primeiro o crivo
              académico, depois tudo o resto. Um projecto desta natureza sem
              orientação científica não merecia existir, e não o quereríamos
              assim.
            </P>
          </div>

          <div className="mt-10 rounded-2xl border border-accent/25 bg-background/70 p-7 sm:p-9">
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
              Quem convida
            </p>
            <p className="mt-3 font-body text-[16px] text-foreground/85 leading-[1.8]">
              <strong className="text-primary">Bernardo Abreu</strong>,
              presidente da Associação Memória Lusíada, por{" "}
              <em>Os Lusíadas Decifrados</em>.
            </p>
            <p className="mt-3 font-body text-[15px] text-foreground/65 leading-relaxed">
              Associação cultural sem fins lucrativos dedicada à memória
              literária portuguesa. Dizemo-lo à cabeça e não em rodapé: quem
              aceitar um lugar neste conselho tem direito a saber a quem se
              associa antes de responder, e não depois de procurar.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-accent/25 bg-background/70 p-7 sm:p-9">
            <p className="font-body text-[11px] text-accent uppercase tracking-[0.2em]">
              Órgãos sociais
            </p>
            <p className="mt-3 font-body text-[14px] text-foreground/60 leading-relaxed">
              Eleitos em Assembleia Geral, 20 de Abril de 2026.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {ORGAOS_SOCIAIS.map((grupo) => (
                <div key={grupo.orgao}>
                  <h4 className="font-display text-[15px] text-primary">
                    {grupo.orgao}
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {grupo.membros.map(([nome, cargo]) => (
                      <li
                        className="font-body text-[14px] text-foreground/75"
                        key={nome}
                      >
                        {nome}
                        {cargo ? (
                          <span className="text-foreground/50"> — {cargo}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Falar connosco ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[760px] px-6 py-20">
        <div className="rounded-2xl border border-accent/25 bg-secondary/40 p-7 text-center sm:p-9">
          <Mail className="mx-auto text-accent" size={22} strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-[22px] text-primary">
            Falar connosco
          </h3>
          <p className="mx-auto mt-3 max-w-[440px] font-body text-[15px] text-foreground/70 leading-relaxed">
            A investigadores, professores e instituições que queiram conhecer o
            desenho do projecto em detalhe — ou apontar-lhe defeitos, que é o
            que mais nos serve.
          </p>
          <a
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            href="mailto:decifrados@oslusiadas.pt?subject=Os%20Lusíadas%20Decifrados"
          >
            decifrados@oslusiadas.pt
          </a>
        </div>
      </section>

      {/* ── Remate ─────────────────────────────────────────────────── */}
      <section className="border-accent/15 border-t">
        <div className="mx-auto max-w-[640px] px-6 py-20 text-center">
          <FlaskConical
            className="mx-auto text-accent/60"
            size={22}
            strokeWidth={1.5}
          />
          <p className="mt-6 font-display text-[24px] text-primary italic leading-[1.5] sm:text-[28px]">
            «Que os Anjos de celeste companhia
            <br />
            Deuses o sacro verso está chamando»
          </p>
          <p className="mt-5 font-body text-[14px] text-muted-foreground">
            Canto X, estância 84 — uma das mil que quase ninguém leu.
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            to="/os-lusiadas"
          >
            Ler o poema
          </Link>

          {/* Filiação — presente, mas em surdina: oslusiadas.pt tem marca própria. */}
          <p className="mt-16 font-body text-[12px] text-muted-foreground/70 tracking-wide">
            Ao cuidado da{" "}
            <a
              className="underline decoration-accent/25 decoration-dotted underline-offset-4 transition-colors hover:decoration-accent"
              href="https://www.alusiada.pt"
              rel="noopener"
            >
              Associação Memória Lusíada
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
