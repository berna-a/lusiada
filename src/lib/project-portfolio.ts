export type PortfolioStage = "active" | "candidate" | "roadmap" | "internal";

export type PortfolioIdea = {
  id: string;
  title: string;
};

export type PortfolioProject = {
  title: string;
  summary: string;
  stage: PortfolioStage;
  campaignSlugs?: string[];
  ideas: PortfolioIdea[];
};

export type PortfolioCategory = {
  id: string;
  title: string;
  summary: string;
  projects: PortfolioProject[];
};

export const PORTFOLIO_STAGE_LABELS: Record<PortfolioStage, string> = {
  active: "Em curso",
  candidate: "Candidato",
  roadmap: "Visão futura",
  internal: "Âmbito interno",
};

const ideas = (...rows: [string, string][]): PortfolioIdea[] =>
  rows.map(([id, title]) => ({ id, title }));

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    id: "camoes-lingua",
    title: "Camões, língua e Os Lusíadas",
    summary:
      "Leitura, investigação, edição e novas formas de transmitir a obra camoniana.",
    projects: [
      {
        title: "Os Lusíadas Decifrados",
        summary:
          "Programa de leitura crítica e investigação, começando por um piloto reproduzível.",
        stage: "active",
        campaignSlugs: ["decifrados-piloto"],
        ideas: ideas(
          ["C01", "Os Lusíadas Decifrados"],
          ["C02", "Piloto de 20–30 estâncias"],
          ["C03", "Língua, léxico e fonética"],
          ["C04", "História, fontes e silêncios"],
          ["C05", "Poética"],
          ["C06", "Símbolo e mística"],
          ["C07", "Memória e recepção de Camões"],
          ["C14", "Aplicar o método a outros autores"]
        ),
      },
      {
        title: "Os Lusíadas Manuscritos",
        summary:
          "Participação pública na cópia manuscrita da obra, precedida por um piloto pequeno.",
        stage: "roadmap",
        ideas: ideas(
          ["C08", "Cinco manuscritos participados"],
          ["C09", "Sessão-piloto dos Manuscritos"],
          ["R03", "Canetas dos Manuscritos"]
        ),
      },
      {
        title: "Edição aberta e escolar",
        summary:
          "Texto acessível, edições físicas e instrumentos editoriais para leitores e escolas.",
        stage: "active",
        ideas: ideas(
          ["C15", "Edição pública e apoio escolar"],
          ["R02", "Edições d’Os Lusíadas"],
          ["E07", "Conteúdo escolar e descoberta digital"]
        ),
      },
      {
        title: "Cinema e animação épica",
        summary:
          "Desenvolvimento audiovisual progressivo, da prova curta a formatos de maior escala.",
        stage: "roadmap",
        ideas: ideas(
          ["C10", "Série animada d’Os Lusíadas"],
          ["C11", "Filme e curta do Adamastor"],
          ["C12", "Prova audiovisual de 30 segundos"]
        ),
      },
      {
        title: "Camões para a infância",
        summary:
          "Criação literária para aproximar crianças da obra e do imaginário.",
        stage: "roadmap",
        ideas: ideas(["C13", "Concurso de livros infantis"]),
      },
    ],
  },
  {
    id: "patrimonio-memoria",
    title: "Património, memória e território",
    summary:
      "Guardar, localizar, interpretar e recriar património português com prova e contexto.",
    projects: [
      {
        title: "ARCA pública da memória",
        summary:
          "Arquivo cultural público com memórias, testemunhos e colecções temáticas.",
        stage: "active",
        ideas: ideas(
          ["P01", "ARCA pública"],
          ["P06", "Memórias e testemunhos"],
          ["P07", "Colecções temáticas"]
        ),
      },
      {
        title: "ARCA privada e legado",
        summary:
          "Memória privada e continuidade entre gerações, dependentes de salvaguardas próprias.",
        stage: "internal",
        ideas: ideas(
          ["P02", "ARCA privada e banco de memória"],
          ["P03", "Testamento da Arca"],
          ["T04", "Federação lusófona e mundial da ARCA"]
        ),
      },
      {
        title: "Panteão, lugares e mapa histórico",
        summary:
          "Experiências digitais que ligam pessoas, acontecimentos e lugares no tempo.",
        stage: "roadmap",
        ideas: ideas(
          ["P04", "Panteão 3D e VR"],
          ["P05", "Lugares no espaço e no tempo"],
          ["T03", "Mapa base comum de Portugal"]
        ),
      },
      {
        title: "Azulejo Português",
        summary:
          "Inventário, rotas, conservação e criação contemporânea em torno do azulejo.",
        stage: "active",
        campaignSlugs: ["azulejos-bairro-piloto", "primeiro-azulejo-camoes"],
        ideas: ideas(
          ["P08", "Mapa aberto de fachadas"],
          ["P09", "Roteiros de azulejos"],
          ["P10", "Gamificação dos Azulejos"],
          ["P11", "Arquivo fotográfico contra furto"],
          ["A03", "Concurso do azulejo de Camões"],
          ["A04", "Murais e encomenda de azulejo novo"],
          ["R05", "Fábrica e oficina de azulejos"]
        ),
      },
    ],
  },
  {
    id: "educacao-conhecimento",
    title: "Educação e conhecimento",
    summary:
      "Infra-estruturas editoriais e académicas para tornar o conhecimento acessível e verificável.",
    projects: [
      {
        title: "Lusopédia e Dicionário",
        summary: "Conhecimento estruturado sobre Portugal, língua e grafias.",
        stage: "active",
        ideas: ideas(["E01", "Lusopédia"], ["E02", "Dicionário e grafias"]),
      },
      {
        title: "Academia, teses e colóquio",
        summary:
          "Temas de investigação, bolseiros e arbitragem científica com responsabilidades claras.",
        stage: "candidate",
        ideas: ideas(
          ["E03", "Temas de tese e bolseiros"],
          ["E04", "Conselho científico e colóquio"]
        ),
      },
      {
        title: "Currículo Lusíada",
        summary:
          "Cursos e percursos de aprendizagem ligados à missão cultural.",
        stage: "roadmap",
        ideas: ideas(["E05", "Currículo Lusíada e cursos"]),
      },
      {
        title: "Editora Lusíada",
        summary:
          "Capacidade editorial própria ou através de parcerias verificadas.",
        stage: "roadmap",
        ideas: ideas(["E06", "Editora própria ou parceria"]),
      },
    ],
  },
  {
    id: "artes-media",
    title: "Artes, media e criação contemporânea",
    summary:
      "Dar continuidade à memória através de criação visual, música, conversas e audiovisual.",
    projects: [
      {
        title: "Nova arte portuguesa",
        summary:
          "Programa de criação contemporânea e arqueofuturismo português.",
        stage: "roadmap",
        ideas: ideas(["A02", "Nova arte portuguesa e arqueofuturismo"]),
      },
      {
        title: "Música e tertúlias",
        summary:
          "Encontros regulares onde música, pensamento e comunidade se encontram.",
        stage: "candidate",
        campaignSlugs: ["tertulia-piloto-gravada"],
        ideas: ideas(
          ["A05", "Música e instrumentos portugueses"],
          ["V02", "Tertúlias mensais e noites de fado"]
        ),
      },
      {
        title: "Podcast e documentários",
        summary: "Registo, interpretação e divulgação através de som e imagem.",
        stage: "candidate",
        ideas: ideas(["A06", "Podcast e clips"], ["A07", "Séries documentais"]),
      },
      {
        title: "Anno de Camões",
        summary:
          "Programa expositivo, participativo e audiovisual em torno de Camões.",
        stage: "roadmap",
        ideas: ideas(
          ["A01", "Exposições físicas sobre Camões"],
          ["A08", "Vídeo Anno de Camões"],
          ["V01", "Flores ao Poeta"],
          ["V03", "Exibições"],
          ["V04", "Jogo do Anno"],
          ["V05", "Concursos do Anno de Camões"],
          ["V06", "Noite das Quinhentas Velas"],
          ["V08", "10 de Junho e Festival"]
        ),
      },
    ],
  },
  {
    id: "comunidade-territorio",
    title: "Comunidade, celebrações e território",
    summary:
      "Projectos presenciais que criam hábitos, serviço, encontros e pertença.",
    projects: [
      {
        title: "Calendário Portuguez",
        summary:
          "Produto cultural e roda anual de datas, território, memória e observação do céu.",
        stage: "candidate",
        campaignSlugs: ["calendario-portuguez-2027"],
        ideas: ideas(
          ["V07", "Aniversário de Camões e Chama na Serra"],
          ["V09", "Arraial dos Santos Populares"],
          ["V10", "Romarias, roteiros e acampamentos"],
          ["V11", "Conquista de Lisboa"],
          ["V12", "Roda anual de memória e serviço"],
          ["N03", "Calendário astronómico e eclipse 2027"],
          ["R01", "Calendário Portuguez 2027"]
        ),
      },
      {
        title: "Clube de Jogos da Mente",
        summary: "Xadrez e Go como prática regular, aprendizagem e encontro.",
        stage: "active",
        campaignSlugs: ["clube-jogos-da-mente"],
        ideas: ideas(
          ["D01", "Clube de Jogos da Mente"],
          ["D02", "Torneio aberto de Xadrez"],
          ["D03", "Torneio e actividade de Go"]
        ),
      },
      {
        title: "Desporto e território",
        summary:
          "Modalidades comunitárias e práticas ligadas ao corpo e à paisagem.",
        stage: "roadmap",
        ideas: ideas(
          ["D04", "Futebol comunitário"],
          ["D05", "Boxe, atletismo e montanhismo"],
          ["D06", "Esgrima lusitana, vela e equitação"]
        ),
      },
      {
        title: "Solidariedade e serviço",
        summary:
          "Acções delimitadas com parceiros e beneficiários claros, ligadas ao calendário comunitário.",
        stage: "roadmap",
        ideas: ideas(
          ["S01", "Solidariedade com pobres e esquecidos"],
          ["S02", "Serviço ligado às datas de memória"],
          ["S03", "Voluntariado como missões e desafios"]
        ),
      },
      {
        title: "Património natural",
        summary: "Conhecer, visitar e cuidar do território e da paisagem.",
        stage: "roadmap",
        ideas: ideas(
          ["N01", "Protecção do património natural"],
          ["N02", "Visitas e cuidado do território"]
        ),
      },
    ],
  },
  {
    id: "tecnologia-participacao",
    title: "Tecnologia e participação",
    summary:
      "Ferramentas digitais ao serviço dos projectos, dos membros e da transparência.",
    projects: [
      {
        title: "Projectos e angariação",
        summary:
          "Catálogo público, páginas de campanha e gestão responsável dos apoios.",
        stage: "active",
        ideas: ideas(["T01", "Área de projectos tipo crowdfunding"]),
      },
      {
        title: "Portal de membros e equipa",
        summary: "Identidade, participação e coordenação interna dos membros.",
        stage: "active",
        ideas: ideas(["T02", "Portal de membros e Equipa"]),
      },
    ],
  },
  {
    id: "sustentabilidade-institucional",
    title: "Sustentabilidade institucional",
    summary:
      "Capacidade humana, comunidade de apoio e infra-estrutura, sem confundir operação com campanhas.",
    projects: [
      {
        title: "Produtos e símbolos",
        summary:
          "Produtos culturais sujeitos a protótipo, procura real e controlo de stock.",
        stage: "roadmap",
        ideas: ideas(["R04", "Roupa, T-shirts, insígnias e vestes"]),
      },
      {
        title: "Coordenação, Mecenas e Apoiantes",
        summary:
          "Financiamento transparente da capacidade institucional e da continuidade comunitária.",
        stage: "candidate",
        ideas: ideas(
          ["O01", "Coordenação e equipa"],
          ["O02", "Mecenas"],
          ["O03", "Apoiantes regulares"]
        ),
      },
      {
        title: "Núcleos e casa física",
        summary:
          "Expansão territorial, sede, atelier e viatura apenas depois de capacidade demonstrada.",
        stage: "roadmap",
        ideas: ideas(
          ["O04", "Núcleos territoriais e diáspora"],
          ["O05", "Sede, atelier e viatura"]
        ),
      },
      {
        title: "Ordem e Guardiões",
        summary:
          "Conceitos privados e iniciáticos mantidos fora do website e do crowdfunding.",
        stage: "internal",
        ideas: ideas(["O06", "Ordem Lusíada, Guardiões e rituais privados"]),
      },
    ],
  },
];

export const PORTFOLIO_PROJECTS = PORTFOLIO_CATEGORIES.flatMap(
  (category) => category.projects
);

export const PORTFOLIO_IDEA_COUNT = PORTFOLIO_PROJECTS.reduce(
  (total, project) => total + project.ideas.length,
  0
);

export const CAMPAIGN_PORTFOLIO = new Map(
  PORTFOLIO_CATEGORIES.flatMap((category) =>
    category.projects.flatMap((project) =>
      (project.campaignSlugs ?? []).map((slug) => [slug, { category, project }])
    )
  )
);
