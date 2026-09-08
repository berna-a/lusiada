import {
  ArrowDown,
  ArrowUpRight,
  Brain,
  CircleDot,
  Dumbbell,
  Footprints,
  Handshake,
  Mail,
  Mountain,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import "./desporto.css";

type Modalidade = {
  id: string;
  numero: string;
  nome: string;
  familia: string;
  estado: string;
  fase: "actual" | "preparacao" | "parceiro";
  icon: typeof Brain;
  mote: string;
  descricao: string;
  acao: string;
  href?: string;
};

const MODALIDADES: Modalidade[] = [
  {
    id: "xadrez",
    numero: "01",
    nome: "Xadrez",
    familia: "Mente",
    estado: "Torneio em preparação",
    fase: "preparacao",
    icon: Brain,
    mote: "Pensar antes de mexer.",
    descricao:
      "O primeiro Torneio Aberto de Xadrez da LUSÍADA está em preparação. A página do torneio reúne a informação já disponível; data e local serão anunciados quando estiverem confirmados.",
    acao: "Ver o estado do torneio",
    href: "/xadrez",
  },
  {
    id: "go",
    numero: "02",
    nome: "Go",
    familia: "Mente",
    estado: "Comunidade inicial",
    fase: "actual",
    icon: CircleDot,
    mote: "Cercar sem fechar.",
    descricao:
      "O Go é o ponto de partida do programa. Já há pessoas interessadas em jogar e estamos a consolidar uma primeira dinâmica regular, aberta tanto a quem começa como a quem já conhece o jogo.",
    acao: "Manifestar interesse",
  },
  {
    id: "futebol",
    numero: "03",
    nome: "Futebol",
    familia: "Equipa",
    estado: "A reunir comunidade",
    fase: "preparacao",
    icon: Users,
    mote: "Ninguém joga sozinho.",
    descricao:
      "Estamos a reunir interesse para criar encontros entre membros e amigos, sem a estrutura de um clube. Formato, regularidade e local ainda estão por definir.",
    acao: "Manifestar interesse",
  },
  {
    id: "boxe",
    numero: "04",
    nome: "Boxe",
    familia: "Combate",
    estado: "À procura de parceiro",
    fase: "parceiro",
    icon: Dumbbell,
    mote: "Força com disciplina.",
    descricao:
      "Ainda não temos ginásio nem orientação técnica. Procuramos um espaço e uma pessoa ou entidade com experiência para avaliar uma porta de entrada segura ao boxe.",
    acao: "Falar connosco",
  },
  {
    id: "atletismo",
    numero: "05",
    nome: "Atletismo",
    familia: "Resistência",
    estado: "A formar grupo",
    fase: "preparacao",
    icon: Footprints,
    mote: "Ir mais longe juntos.",
    descricao:
      "Queremos começar por corridas de grupo, com uma proposta simples e acessível. Percurso, regularidade e condições de participação estão ainda em preparação.",
    acao: "Manifestar interesse",
  },
  {
    id: "montanhismo",
    numero: "06",
    nome: "Montanhismo",
    familia: "Natureza",
    estado: "A preparar o caminho",
    fase: "parceiro",
    icon: Mountain,
    mote: "Subir muda a perspectiva.",
    descricao:
      "Ainda não há saídas marcadas. Procuramos quem conheça o terreno e possa ajudar a avaliar percursos, orientação e condições de segurança.",
    acao: "Falar connosco",
  },
];

const NECESSIDADES = [
  [
    "01",
    "Espaços",
    "Salas para os jogos da mente, campos, pistas e locais de treino.",
  ],
  [
    "02",
    "Meios",
    "Tabuleiros, material de treino, transporte e equipamento de segurança.",
  ],
  [
    "03",
    "Conhecimento",
    "Treinadores, clubes, guias e pessoas capazes de ensinar com rigor.",
  ],
];

export default function DesportoPage() {
  const [activa, setActiva] = useState(MODALIDADES[0]);
  const emailParticipar = `mailto:bernardo@alusiada.pt?subject=${encodeURIComponent(`Desporto — quero participar em ${activa.nome}`)}`;

  return (
    <article className="desporto" data-nav-theme="dark">
      <Seo
        description="O programa de desporto da Associação Memória Lusíada: xadrez, Go, futebol, boxe, atletismo e montanhismo. Participe ou ajude-nos com espaços, meios e conhecimento."
        path="/desporto"
        title="Desporto — Associação Memória Lusíada"
      />

      <header className="desporto-hero">
        <div aria-hidden="true" className="desporto-hero-grid" />
        <div className="desporto-shell desporto-hero-content">
          <div className="desporto-kicker">
            <span>Associação Memória Lusíada</span>
            <span>Programa de desporto</span>
          </div>
          <div className="desporto-hero-title-wrap">
            <p className="desporto-index">CORPO / MENTE / COMUNIDADE</p>
            <h1>
              O corpo
              <br />
              também <em>pensa.</em>
            </h1>
          </div>
          <div className="desporto-hero-bottom">
            <p>
              Não jogamos só para vencer. Jogamos para aprender a decidir,
              resistir, confiar e pertencer.
            </p>
            <a className="desporto-round-link" href="#modalidades">
              <ArrowDown aria-hidden="true" />
              <span>Explorar</span>
            </a>
          </div>
        </div>
        <div aria-hidden="true" className="desporto-scoreboard">
          {MODALIDADES.map((modalidade) => (
            <span key={modalidade.id}>{modalidade.numero}</span>
          ))}
        </div>
      </header>

      <section className="desporto-manifesto desporto-shell">
        <p className="desporto-section-label">A nossa ideia de desporto</p>
        <div>
          <h2>
            Seis disciplinas.
            <br />
            Uma forma de estar.
          </h2>
          <p>
            Da decisão silenciosa no tabuleiro ao esforço partilhado numa
            subida, cada modalidade cultiva uma qualidade humana. A LUSÍADA
            aproxima pessoas através da prática — com ambição, mas sem fingir
            que já existe aquilo que ainda estamos a construir.
          </p>
        </div>
      </section>

      <section className="desporto-explorer" id="modalidades">
        <div className="desporto-shell">
          <div className="desporto-section-head">
            <div>
              <p className="desporto-section-label">Estado do programa</p>
              <h2>Escolha o seu terreno.</h2>
            </div>
            <p>
              Cada frente avança ao seu ritmo. Veja o que já existe, o que está
              em preparação e o que depende de um parceiro.
            </p>
          </div>
          <div
            aria-label="Modalidades"
            className="desporto-selector"
            role="tablist"
          >
            {MODALIDADES.map((modalidade) => (
              <button
                aria-controls="painel-modalidade"
                aria-selected={activa.id === modalidade.id}
                className={activa.id === modalidade.id ? "is-active" : ""}
                id={`tab-${modalidade.id}`}
                key={modalidade.id}
                onClick={() => setActiva(modalidade)}
                role="tab"
                type="button"
              >
                <span>{modalidade.numero}</span>
                {modalidade.nome}
              </button>
            ))}
          </div>
          <div
            aria-labelledby={`tab-${activa.id}`}
            className={`desporto-discipline desporto-discipline--${activa.id}`}
            id="painel-modalidade"
            key={activa.id}
            role="tabpanel"
          >
            <div aria-hidden="true" className="desporto-discipline-art">
              <div className="desporto-art-mark">
                <activa.icon />
              </div>
              <strong>{activa.numero}</strong>
              <span>{activa.familia}</span>
            </div>
            <div className="desporto-discipline-copy">
              <p className={`desporto-status desporto-status--${activa.fase}`}>
                {activa.estado}
              </p>
              <h3>{activa.nome}</h3>
              <blockquote>{activa.mote}</blockquote>
              <p>{activa.descricao}</p>
              {activa.href ? (
                <Link className="desporto-action" to={activa.href}>
                  {activa.acao}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ) : (
                <a className="desporto-action" href={emailParticipar}>
                  {activa.acao}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="desporto-truth desporto-shell">
        <div className="desporto-truth-title">
          <p className="desporto-section-label">O estado do programa</p>
          <h2>Crescer sem fazer de conta.</h2>
        </div>
        <div className="desporto-truth-grid">
          <div>
            <span className="desporto-dot desporto-dot--actual" />
            <p>Já acontece</p>
            <strong>Go — comunidade inicial</strong>
          </div>
          <div>
            <span className="desporto-dot desporto-dot--preparacao" />
            <p>Em preparação</p>
            <strong>Xadrez · Futebol · Atletismo</strong>
          </div>
          <div>
            <span className="desporto-dot desporto-dot--parceiro" />
            <p>Precisam de parceiro</p>
            <strong>Boxe · Montanhismo</strong>
          </div>
        </div>
      </section>

      <section className="desporto-partners" id="parceiros">
        <div className="desporto-shell">
          <div className="desporto-partners-intro">
            <div>
              <Handshake aria-hidden="true" />
              <p className="desporto-section-label">Uma proposta concreta</p>
            </div>
            <h2>
              Tem um meio.
              <br />
              Nós damos-lhe movimento.
            </h2>
            <p>
              Procuramos espaços, meios e conhecimento que permitam avaliar e
              preparar actividades com responsabilidade. Cada colaboração é
              conversada caso a caso, antes de qualquer anúncio.
            </p>
          </div>
          <div className="desporto-needs">
            {NECESSIDADES.map(([numero, titulo, texto]) => (
              <article key={numero}>
                <span>{numero}</span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </article>
            ))}
          </div>
          <a
            className="desporto-partner-cta"
            href="mailto:bernardo@alusiada.pt?subject=Desporto%20LUSÍADA%20—%20quero%20ser%20parceiro"
          >
            <span>Tenho um espaço, meio ou conhecimento</span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="desporto-join">
        <div className="desporto-shell">
          <p className="desporto-section-label">Para participantes</p>
          <h2>O primeiro passo é aparecer.</h2>
          <p>
            Diga-nos o que quer praticar. Esta mensagem manifesta interesse; não
            é uma inscrição nem confirma uma actividade.
          </p>
          <a href="mailto:bernardo@alusiada.pt?subject=Desporto%20LUSÍADA%20—%20quero%20participar">
            <Mail aria-hidden="true" />
            Manifestar interesse
          </a>
        </div>
      </section>
    </article>
  );
}
