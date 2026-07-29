import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

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

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[17px] text-foreground/85 leading-[1.85]">
      {children}
    </p>
  );
}

const GRUPOS = [
  {
    lente: "Língua",
    temas: [
      "O léxico morto d'Os Lusíadas — censo das palavras sem uso no português contemporâneo.",
      "Neologismos camonianos: inventário verificado (hoje só existe por amostragem).",
      "Rimas perdidas — reconstituição fonológica quinhentista e o que ela revela sobre a construção da oitava.",
      "Falsos amigos diacrónicos: palavras que mudaram de sentido debaixo do mesmo som.",
      "Onde é que Camões ainda se fala — sobrevivência do léxico camoniano nos falares lusófonos.",
    ],
  },
  {
    lente: "História",
    temas: [
      "Os desvios face a Castanheda e a Barros: catálogo sistemático e tipologia.",
      "O argumento do silêncio — o que Camões escolheu não versificar das crónicas.",
      "A licença do Santo Ofício e as alterações de 1584: o que é do poeta e o que é do censor.",
    ],
  },
  {
    lente: "Poética",
    temas: [
      "A imitatio virgiliana verificada verso a verso, contra a impressão crítica herdada.",
      "A cesura na oitava camoniana — norma, desvio e efeito.",
      "Ariosto em Camões: medir uma afirmação repetida há séculos sem nunca a contar.",
    ],
  },
  {
    lente: "Símbolo",
    temas: [
      "A cosmografia do Canto X confrontada com as fontes disponíveis em 1572 (Sacrobosco, Pedro Nunes, Conimbricenses).",
      "Fábula e doutrina: a fronteira em X, 82-84 e o que ela decide sobre toda a leitura simbólica.",
      "O neoplatonismo de Leão Hebreu na Ilha dos Amores.",
    ],
  },
  {
    lente: "Memória",
    temas: [
      "Como um poema se torna intocável — mapeamento da canonização de Camões entre o século XVI e o Romantismo.",
      "A tradição paródica d'Os Lusíadas como sismógrafo cultural: o que cada época achou digno de riso, e porquê.",
    ],
  },
  {
    lente: "Transversais",
    temas: [
      "Quatro séculos de atenção crítica: mapeamento de que estâncias foram lidas, e quais não.",
      "Onde a máquina falha — taxonomia dos limites da leitura automática de poesia antiga.",
    ],
  },
] as const;

export default function TemasTesePage() {
  return (
    <main data-nav-theme="light">
      <Seo
        description="Dezoito temas de tese que o projecto Os Lusíadas Decifrados abre, organizados pelas cinco lentes — para orientadores e estudantes de literatura portuguesa."
        path="/os-lusiadas/decifrados/temas-de-tese"
        title="Temas de tese — Os Lusíadas Decifrados"
        type="article"
      />

      <header className="mx-auto max-w-[760px] px-6 pt-32 pb-4 text-center sm:pt-40">
        <Eyebrow>Os Lusíadas Decifrados</Eyebrow>
        <h1 className="mt-5 font-display text-[40px] text-primary leading-[1.05] sm:text-[54px]">
          Temas de tese
        </h1>
        <div className="mt-8 flex justify-center">
          <span aria-hidden="true" className="block h-px w-[60px] bg-accent" />
        </div>
        <p className="mx-auto mt-8 max-w-[560px] font-body text-[16px] text-foreground/65 leading-[1.8]">
          Um orientador tem, todos os anos em Setembro, alunos sem tema bom.
          Este projecto tem mil estâncias por estudar. Aqui ficam dezoito pontos
          de partida, organizados pelas cinco lentes do projecto.
        </p>
      </header>

      <section className="mx-auto max-w-[700px] px-6 pt-16 pb-10">
        <P>
          Nenhum destes temas está fechado — são propostas, não teses já
          desenhadas. Cada um precisa de ser lido, ajustado e validado por um
          orientador antes de ser oferecido a um estudante; é trabalho de
          autoria de quem o adopta, não um encargo que entregamos pronto.
        </P>
      </section>

      <section className="mx-auto max-w-[760px] px-6 pb-24">
        <div className="space-y-12">
          {GRUPOS.map((grupo) => (
            <div key={grupo.lente}>
              <h2 className="font-display text-[22px] text-primary">
                Lente da {grupo.lente}
              </h2>
              <ol className="mt-4 space-y-3">
                {grupo.temas.map((tema) => (
                  <li
                    className="flex gap-3 font-body text-[15px] text-foreground/80 leading-relaxed"
                    key={tema}
                  >
                    <span aria-hidden="true" className="mt-1 text-accent">
                      —
                    </span>
                    <span>{tema}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="border-accent/15 border-t bg-secondary/30">
        <div className="mx-auto max-w-[700px] px-6 py-20 text-center">
          <SectionTitle>Falta um tema que devia estar aqui?</SectionTitle>
          <p className="mx-auto mt-4 max-w-[500px] font-body text-[15px] text-foreground/70 leading-relaxed">
            Escreva-nos. Um orientador conhece a área melhor do que nós — esta
            lista cresce com quem a usa.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-body text-[14px] text-primary-foreground transition-opacity hover:opacity-90"
              href="mailto:decifrados@oslusiadas.pt?subject=Temas%20de%20tese"
            >
              <Mail size={16} strokeWidth={1.5} />
              decifrados@oslusiadas.pt
            </a>
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-7 py-3 font-body text-[14px] text-primary transition-colors hover:bg-accent/10"
              to="/os-lusiadas/decifrados"
            >
              Ver o projecto completo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
