import { PageHeader } from "@/components/PageHeader";

type Secao = { titulo: string; paragrafos: string[] };

const SECCOES: Secao[] = [
  {
    titulo: "1. Quem trata os seus dados",
    paragrafos: [
      "A responsável pelo tratamento dos dados pessoais recolhidos neste site é a Associação Memória Lusíada, NIF 518 533 301, com sede no Largo da Freiria 6, 3000-196 Coimbra. Para qualquer questão sobre esta política ou sobre os seus dados, pode contactar-nos através de admin@alusiada.pt.",
    ],
  },
  {
    titulo: "2. Que dados recolhemos e para quê",
    paragrafos: [
      "Pedido de adesão: nome completo, email, distrito, cidade, como nos conheceu, motivação e consentimentos de newsletter/eventos — para avaliar e processar o seu pedido de sócio.",
      "Conta e pagamento: ao autenticar-se com a Google, recebemos o seu nome e email. Ao pagar a quota, os dados de pagamento são processados directamente pelo Stripe (ver secção 5) — não vemos nem guardamos o número do seu cartão.",
      "Formulário de contacto: nome, email, assunto e mensagem — para lhe podermos responder.",
      "Contributos na Arca: memórias, comentários e artigos que submeta ficam associados à sua conta, para efeitos de moderação e atribuição de autoria.",
      "Doações: email, nome (ou nome a exibir) e valor doado, quando aplicável.",
    ],
  },
  {
    titulo: "3. Base legal do tratamento",
    paragrafos: [
      "Tratamos os seus dados com base no seu consentimento explícito (por exemplo, ao aceitar a newsletter ou submeter um formulário), na execução do contrato de adesão como sócio (incluindo o pagamento da quota) e no nosso interesse legítimo em responder a contactos e manter a comunidade a funcionar em segurança.",
    ],
  },
  {
    titulo: "4. Quanto tempo guardamos os seus dados",
    paragrafos: [
      "Os dados de adesão e quota são conservados enquanto for sócio e, depois disso, pelo prazo necessário para cumprir obrigações legais (nomeadamente fiscais e contabilísticas). As mensagens de contacto são conservadas o tempo necessário para resolver o assunto. Pode pedir a eliminação dos seus dados em qualquer momento, nos termos da secção 7.",
    ],
  },
  {
    titulo: "5. Com quem partilhamos os seus dados",
    paragrafos: [
      "Não vendemos nem cedemos os seus dados a terceiros para fins de marketing. Partilhamos apenas o estritamente necessário com prestadores de serviços que nos ajudam a operar o site, actuando estes como subcontratantes:",
      "Google — autenticação (Google OAuth) para criar e aceder à sua conta.",
      "Stripe — processamento de pagamentos das quotas de sócio.",
      "Convex — alojamento da base de dados e dos ficheiros do site.",
    ],
  },
  {
    titulo: "6. Cookies e tecnologias semelhantes",
    paragrafos: [
      "Este site não utiliza cookies de publicidade ou de rastreamento. Utilizamos apenas os cookies e mecanismos técnicos estritamente necessários para manter a sua sessão autenticada.",
    ],
  },
  {
    titulo: "7. Os seus direitos",
    paragrafos: [
      "Nos termos do Regulamento Geral de Protecção de Dados, tem o direito de acesso, rectificação, apagamento, limitação e portabilidade dos seus dados, bem como o direito de se opor ao seu tratamento. Para exercer qualquer um destes direitos, contacte-nos através de admin@alusiada.pt. Tem também o direito de apresentar reclamação à Comissão Nacional de Protecção de Dados (CNPD), em www.cnpd.pt.",
    ],
  },
  {
    titulo: "8. Segurança",
    paragrafos: [
      "Adoptamos medidas técnicas e organizativas adequadas para proteger os seus dados contra acesso não autorizado, perda ou destruição, proporcionais à natureza dos dados que tratamos.",
    ],
  },
  {
    titulo: "9. Alterações a esta política",
    paragrafos: [
      "Esta política pode ser actualizada para reflectir alterações no site ou na lei. A data da última actualização é indicada no final desta página.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <article
      className="mx-auto max-w-[760px] px-6 pt-32 pb-24 sm:pt-40 sm:pb-32"
      data-nav-theme="light"
    >
      <PageHeader
        eyebrow="Associação Memória Lusíada"
        intro="Como recolhemos, usamos e protegemos os seus dados pessoais."
        title="Política de Privacidade"
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
