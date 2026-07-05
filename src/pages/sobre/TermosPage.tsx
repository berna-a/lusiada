import { PageHeader } from "@/components/PageHeader";

type Secao = { titulo: string; paragrafos: string[] };

const SECCOES: Secao[] = [
  {
    titulo: "1. Âmbito",
    paragrafos: [
      "Estes Termos e Condições regulam o acesso e utilização do site alusiada.pt e oslusiadas.pt, propriedade da Associação Memória Lusíada, NIF 518 533 301, e de todas as funcionalidades nele disponíveis — leitura, adesão, contribuição para a Arca, área de sócios e apoio/doações. Ao utilizar o site, aceita estes termos.",
    ],
  },
  {
    titulo: "2. Adesão como sócio",
    paragrafos: [
      "A adesão à Associação é livre e gratuita na sua submissão, ficando sujeita a aprovação pela Direcção. Uma vez aprovada a elegibilidade, o estatuto de sócio activo depende do pagamento da quota, nos valores e periodicidade indicados no momento da adesão. A Associação reserva-se o direito de suspender ou recusar adesões que não cumpram os seus Estatutos ou estes Termos.",
    ],
  },
  {
    titulo: "3. Conteúdo submetido pelos utilizadores",
    paragrafos: [
      "Ao submeter memórias, comentários, artigos ou outros contributos à Arca, garante que detém os direitos necessários sobre esse conteúdo e concede à Associação uma licença não exclusiva para o publicar, exibir e utilizar no âmbito da sua missão de preservação da memória portuguesa.",
      "A Associação modera os contributos e reserva-se o direito de rejeitar, editar ou remover conteúdo que considere inadequado, incorrecto, ofensivo ou que viole direitos de terceiros, sem necessidade de aviso prévio.",
      "É proibido submeter conteúdo ilegal, difamatório, discriminatório ou que viole direitos de autor de terceiros.",
    ],
  },
  {
    titulo: "4. Propriedade intelectual",
    paragrafos: [
      "O texto d'Os Lusíadas encontra-se em domínio público. O restante conteúdo original do site — incluindo design, marca, ilustrações e artigos da Lusopédia produzidos pela Associação — é propriedade da Associação Memória Lusíada ou dos respectivos autores, salvo indicação em contrário, e não pode ser reproduzido comercialmente sem autorização.",
    ],
  },
  {
    titulo: "5. Doações e pagamentos",
    paragrafos: [
      "As doações e o pagamento de quotas são processados através do Stripe. As doações são, em regra, não reembolsáveis, salvo erro comprovado de cobrança — nesse caso, contacte admin@alusiada.pt.",
    ],
  },
  {
    titulo: "6. Utilização aceitável",
    paragrafos: [
      "Compromete-se a não utilizar o site para fins ilegais, a não tentar aceder indevidamente a áreas restritas ou a dados de outros utilizadores, e a não perturbar o normal funcionamento da plataforma.",
    ],
  },
  {
    titulo: "7. Limitação de responsabilidade",
    paragrafos: [
      "O conteúdo histórico, linguístico e enciclopédico disponibilizado no site — incluindo a Lusopédia e as anotações da comunidade — tem fins educativos e culturais, podendo conter imprecisões próprias de um projecto vivo e em construção colectiva. A Associação não garante a exactidão absoluta de todo o conteúdo submetido por terceiros.",
    ],
  },
  {
    titulo: "8. Alterações",
    paragrafos: [
      "Estes Termos podem ser actualizados a qualquer momento, sendo a versão em vigor sempre a publicada nesta página. A utilização continuada do site após uma alteração implica a aceitação dos novos termos.",
    ],
  },
  {
    titulo: "9. Lei aplicável",
    paragrafos: [
      "Estes Termos são regidos pela lei portuguesa. Para qualquer litígio, é competente o foro da comarca de Coimbra, sem prejuízo dos direitos que assistam ao consumidor nos termos da lei.",
    ],
  },
];

export default function TermosPage() {
  return (
    <article
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="As regras de utilização do site e da adesão à Associação."
        title="Termos e Condições"
      />

      <div className="mt-16 space-y-10">
        {SECCOES.map((s) => (
          <section key={s.titulo}>
            <h2 className="font-display text-[20px] text-primary">
              {s.titulo}
            </h2>
            <div className="mt-3 space-y-3">
              {s.paragrafos.map((p) => (
                <p
                  className="font-body text-[15px] text-foreground/80 leading-relaxed"
                  key={p.slice(0, 40)}
                >
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-16 text-center font-body text-[13px] text-muted-foreground">
        Última actualização: Julho de 2026.
      </p>
    </article>
  );
}
