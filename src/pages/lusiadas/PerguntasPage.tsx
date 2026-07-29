import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { cantoHref, lusiadasBase } from "@/lib/lusiadas/nav";

/**
 * Respostas factuais às perguntas mais procuradas sobre a obra.
 * Factos verificáveis apenas — a interpretação continua a ser da comunidade,
 * nos feeds de anotação.
 */
const PERGUNTAS: { p: string; r: string }[] = [
  {
    p: "Quantos cantos tem Os Lusíadas?",
    r: "Os Lusíadas têm 10 cantos, num total de 1102 estrofes e 8816 versos. Cada estrofe tem oito versos e cada verso tem dez sílabas métricas.",
  },
  {
    p: "Quem escreveu Os Lusíadas?",
    r: "Os Lusíadas foram escritos por Luís Vaz de Camões e publicados em Lisboa em 1572. Não se conhece nenhum manuscrito autógrafo do poema — o texto que lemos hoje vem das edições impressas.",
  },
  {
    p: "Qual é o assunto d'Os Lusíadas?",
    r: "A acção principal é a viagem marítima de Vasco da Gama à Índia, em 1497-1499. Em torno dela, o poema conta também a história de Portugal, desde as origens até ao reinado de D. Manuel I.",
  },
  {
    p: "Qual é a estrutura d'Os Lusíadas?",
    r: "O poema divide-se em cinco partes: Proposição (o poeta anuncia o tema), Invocação (pede inspiração às Ninfas do Tejo), Dedicatória (dirige a obra a D. Sebastião), Narração (a matéria do poema, a maior parte do texto) e Epílogo (as considerações finais do poeta).",
  },
  {
    p: "Que tipo de estrofe e de verso usa Camões?",
    r: "Camões usa a oitava rima: estrofes de oito versos decassílabos, com o esquema de rima ABABABCC. É a forma da epopeia renascentista italiana, que Camões adopta para o português.",
  },
  {
    p: "Quais são os planos narrativos do poema?",
    r: "Distinguem-se habitualmente quatro: o plano da viagem (a navegação de Vasco da Gama), o plano da História de Portugal (contada por Gama ao rei de Melinde), o plano mitológico (os deuses do Olimpo que ajudam ou dificultam a viagem) e o plano do poeta (as reflexões de Camões, dirigidas ao leitor ou ao rei).",
  },
  {
    p: "Quem é o Adamastor?",
    r: "O Adamastor é um gigante que aparece no Canto V, no Cabo das Tormentas (hoje Cabo da Boa Esperança). Surge aos navegadores sob a forma de uma nuvem ameaçadora e profetiza desgraças a quem ali passar.",
  },
  {
    p: "Em que canto está o episódio de Inês de Castro?",
    r: "No Canto III, estâncias 118 a 135. Inês de Castro é morta por ordem de D. Afonso IV, pai do príncipe D. Pedro, de quem era amada — o episódio termina com as lágrimas transformadas na fonte que ainda hoje tem esse nome.",
  },
  {
    p: "O que é o episódio do Velho do Restelo?",
    r: "Está no Canto IV, estâncias 94 a 104. No momento da partida da armada de Lisboa, um velho ergue a voz na praia do Restelo para avisar do custo humano da aventura marítima e criticar a ambição que a move.",
  },
  {
    p: "O que é a Ilha dos Amores?",
    r: "É a ilha que Vénus prepara no Canto IX como recompensa para os navegadores, ao fim da viagem. No Canto X, já na ilha, a ninfa Tétis mostra a Vasco da Gama os feitos futuros dos portugueses e a «Máquina do Mundo».",
  },
];

export default function PerguntasPage() {
  const base = lusiadasBase();
  return (
    <main
      className="mx-auto max-w-3xl px-6 pt-32 pb-24 sm:pt-40"
      data-nav-theme="light"
    >
      <Seo
        description="Quantos cantos tem Os Lusíadas, quem os escreveu, qual a estrutura e a métrica — respostas directas às perguntas mais feitas sobre a epopeia de Camões."
        jsonLd={{
          "@type": "FAQPage",
          mainEntity: PERGUNTAS.map((q) => ({
            "@type": "Question",
            name: q.p,
            acceptedAnswer: { "@type": "Answer", text: q.r },
          })),
        }}
        path="/os-lusiadas/perguntas"
        title="Os Lusíadas — perguntas frequentes | Camões"
        type="article"
      />

      <header className="text-center">
        <p className="font-body text-[12px] text-accent uppercase tracking-[0.3em]">
          Os Lusíadas
        </p>
        <h1 className="mt-3 font-display text-[40px] text-primary leading-[1.05] sm:text-[52px]">
          Perguntas frequentes
        </h1>
        <p className="mx-auto mt-6 max-w-[520px] font-body text-[16px] text-foreground/65 leading-relaxed">
          Respostas directas ao que se pergunta primeiro sobre a obra. São
          factos — o que os versos significam fica para quem os lê.
        </p>
      </header>

      <div className="mt-16 space-y-10">
        {PERGUNTAS.map((q) => (
          <section key={q.p}>
            <h2 className="font-display text-[22px] text-primary leading-snug">
              {q.p}
            </h2>
            <p className="mt-2 font-body text-[16px] text-foreground/80 leading-[1.8]">
              {q.r}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-20 border-accent/20 border-t pt-10 text-center">
        <p className="font-body text-[15px] text-foreground/70 leading-relaxed">
          O texto completo está aqui, verso a verso, nas três grafias da língua
          — com o resumo do enredo em cada canto.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
            to={cantoHref(base, 1)}
          >
            Ler Os Lusíadas
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
            to={`${base}/episodios`}
          >
            Os episódios
          </Link>
        </div>
      </section>
    </main>
  );
}
