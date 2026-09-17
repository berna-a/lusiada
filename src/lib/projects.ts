export type ProjectStatus = "preparing" | "funding" | "funded" | "completed";
export type ProjectUpdate = {
  title: string;
  body: string;
  publishedAt: number;
};
export type PublicProject = {
  slug: string;
  eyebrow: string | null;
  title: string;
  summary: string;
  description: string;
  coverImageUrl: string | null;
  status: ProjectStatus;
  goalCents: number;
  confirmedCents: number;
  currency: "EUR";
  budgetNote: string | null;
  materialNeeds: string[];
  technicalNeeds: string[];
  volunteerNeeds: string[];
  updates: ProjectUpdate[];
};
export type DemoProject = PublicProject & {
  isPublished: boolean;
  updatedAt: number;
};
export type DemoContribution = {
  id: string;
  projectSlug: string;
  amountCents: number;
  provider: string;
  reference: string;
  confirmedAt: number;
  revokedAt: number | null;
};

export const PIONEER_PROJECT: DemoProject = {
  slug: "clube-jogos-da-mente",
  eyebrow: "Projecto pioneiro",
  title: "Clube de Jogos da Mente",
  summary:
    "Uma casa comum para membros e jogadores de Xadrez e Go — para aprender, jogar e preparar os primeiros eventos.",
  description:
    "A LUSÍADA está a preparar um Clube de Jogos da Mente que reúna a comunidade em torno do Xadrez e do Go. Queremos criar condições materiais para encontros regulares, aproximar praticantes experientes de quem está a começar e, em breve, organizar eventos. A federação do clube é uma intenção para a fase seguinte, não um processo concluído.",
  coverImageUrl: null,
  status: "preparing",
  goalCents: 34_500,
  confirmedCents: 0,
  currency: "EUR",
  budgetNote:
    "Uma linha global de 345 € para tabuleiros. Modalidades, quantidades e fornecedores serão definidos antes da compra.",
  materialNeeds: [
    "Tabuleiros e peças de Xadrez e Go",
    "Empréstimo ou doação de material em bom estado",
    "Transporte do material, se necessário",
  ],
  technicalNeeds: [
    "Apoio na preparação de torneios e regras de competição",
    "Experiência associativa e orientação sobre futura federação",
    "Apoio logístico e comunicação dos encontros",
  ],
  volunteerNeeds: [
    "Jogadores que queiram acolher e ensinar principiantes",
    "Pessoas para ajudar a organizar sessões e futuros eventos",
    "Membros interessados em construir o clube desde o início",
  ],
  updates: [],
  isPublished: true,
  updatedAt: Date.UTC(2026, 8, 17),
};

export const REVIEW_PROJECTS: DemoProject[] = [
  PIONEER_PROJECT,
  {
    slug: "calendario-portuguez-2027",
    eyebrow: "Produto cultural · proposta para revisão",
    title: "Calendário Portuguez 2027",
    summary:
      "Um calendário físico que reúne memória, território e céu português — preparado através de uma pré-venda transparente.",
    description:
      "Queremos preparar uma primeira edição do Calendário Portuguez 2027: um objecto de uso quotidiano que ligue datas históricas, celebrações, território e observação astronómica. A campanha serviria para financiar uma tiragem previamente orçamentada, sem produzir stock antes de conhecermos a procura.\n\nEsta página é uma proposta editorial. As datas, a astronomia, o formato, a gráfica, a tiragem, o preço e a expedição ainda precisam de confirmação antes de qualquer pré-venda.",
    coverImageUrl: null,
    status: "preparing",
    goalCents: 0,
    confirmedCents: 0,
    currency: "EUR",
    budgetNote:
      "Meta a definir depois de validar conteúdo, protótipo, gráfica, tiragem, embalagem, expedição e tratamento fiscal.",
    materialNeeds: [
      "Protótipo impresso e provas de papel",
      "Orçamentos de gráfica para pequenas tiragens",
      "Solução de embalagem e expedição",
    ],
    technicalNeeds: [
      "Validação histórica e astronómica das datas",
      "Design editorial e preparação para impressão",
      "Planeamento de pré-venda, logística e fiscalidade",
    ],
    volunteerNeeds: [
      "Leitores para revisão factual e linguística",
      "Pessoas para testar legibilidade e utilização",
      "Apoio à preparação e expedição da primeira tiragem",
    ],
    updates: [],
    isPublished: true,
    updatedAt: Date.UTC(2026, 8, 17),
  },
  {
    slug: "azulejos-bairro-piloto",
    eyebrow: "Património · proposta para revisão",
    title: "Azulejos — um bairro-piloto",
    summary:
      "Documentar um território delimitado, criar um roteiro público e ajudar a preservar a memória das suas fachadas.",
    description:
      "Propomos escolher um único bairro ou percurso e documentar um número fechado de fachadas azulejadas. Cada registo deverá incluir fotografia, localização, contexto e estado observado, terminando num mapa e num roteiro público.\n\nO piloto permite testar método, direitos de imagem, moderação e utilidade pública antes de prometer um levantamento nacional. O território, a quantidade de registos, a equipa de curadoria e a relação com inventários municipais ainda estão por definir.",
    coverImageUrl: null,
    status: "preparing",
    goalCents: 0,
    confirmedCents: 0,
    currency: "EUR",
    budgetNote:
      "Meta a definir depois de escolher território, número de fachadas, deslocações, captação, curadoria e produção do roteiro.",
    materialNeeds: [
      "Equipamento fotográfico ou telemóveis adequados",
      "Deslocações no território escolhido",
      "Suportes de divulgação do roteiro-piloto",
    ],
    technicalNeeds: [
      "Fotografia documental e inventário patrimonial",
      "Curadoria, georreferenciação e verificação de dados",
      "Revisão de direitos, privacidade e moderação",
    ],
    volunteerNeeds: [
      "Moradores e conhecedores do bairro",
      "Pessoas para trabalho de campo acompanhado",
      "Revisores dos registos e do percurso final",
    ],
    updates: [],
    isPublished: true,
    updatedAt: Date.UTC(2026, 8, 17),
  },
  {
    slug: "decifrados-piloto",
    eyebrow: "Investigação · proposta para revisão",
    title: "Os Lusíadas Decifrados — piloto",
    summary:
      "Aplicar um método verificável a 20–30 estâncias e publicar um primeiro resultado aberto, citável e discutível.",
    description:
      "O piloto de Os Lusíadas Decifrados pretende trabalhar um corpus declarado de 20–30 estâncias, com edições e bibliografia identificadas, critérios de evidência e separação explícita entre facto e interpretação.\n\nO resultado deve ser pequeno mas completo: protocolo, análise, fontes, controlo negativo e publicação citável. Antes de abrir uma campanha faltam responsável científico, corpus final, licenças, formato de publicação, calendário e orçamento de horas.",
    coverImageUrl: null,
    status: "preparing",
    goalCents: 0,
    confirmedCents: 0,
    currency: "EUR",
    budgetNote:
      "Meta a definir depois de fechar corpus, edições, equipa, direitos, horas de investigação, revisão e publicação.",
    materialNeeds: [
      "Edições e bibliografia de referência",
      "Acesso legítimo às fontes necessárias",
      "Suporte editorial para o artefacto final",
    ],
    technicalNeeds: [
      "Filologia, história, poética e recepção literária",
      "Desenho do protocolo e critérios de evidência",
      "Revisão científica e preparação editorial",
    ],
    volunteerNeeds: [
      "Investigadores e leitores especializados",
      "Revisores para testar clareza e rastreabilidade",
      "Apoio à bibliografia e normalização de referências",
    ],
    updates: [],
    isPublished: true,
    updatedAt: Date.UTC(2026, 8, 17),
  },
  {
    slug: "primeiro-azulejo-camoes",
    eyebrow: "Criação contemporânea · proposta para revisão",
    title: "O primeiro azulejo contemporâneo de Camões",
    summary:
      "Encomendar ou seleccionar uma obra nova, produzir o azulejo e instalá-lo num lugar com contexto e permanência.",
    description:
      "Este projecto propõe criar uma primeira peça contemporânea dedicada a Camões, unindo património azulejar e criação actual. O resultado deve ser um objecto real, documentado e instalado num lugar previamente autorizado.\n\nAinda é necessário decidir entre concurso e encomenda, definir artista ou júri, fechar desenho, produção, instalação, direitos e localização. A referência histórica de custo existente não substitui um orçamento actual.",
    coverImageUrl: null,
    status: "preparing",
    goalCents: 0,
    confirmedCents: 0,
    currency: "EUR",
    budgetNote:
      "Meta a definir com propostas reais para criação, produção, transporte, instalação, direitos e documentação.",
    materialNeeds: [
      "Produção cerâmica e provas de cor",
      "Materiais e suporte de instalação",
      "Local autorizado e solução de conservação",
    ],
    technicalNeeds: [
      "Direcção artística e conhecimento de azulejaria",
      "Produção, instalação e conservação",
      "Contratos, direitos de autor e autorização do local",
    ],
    volunteerNeeds: [
      "Apoio de investigação iconográfica",
      "Documentação fotográfica do processo",
      "Mediação pública no momento de apresentação",
    ],
    updates: [],
    isPublished: true,
    updatedAt: Date.UTC(2026, 8, 17),
  },
  {
    slug: "tertulia-piloto-gravada",
    eyebrow: "Comunidade e media · proposta para revisão",
    title: "Uma tertúlia-piloto gravada",
    summary:
      "Reunir pessoas em torno de um tema, registar a conversa com consentimento e publicar uma primeira memória partilhável.",
    description:
      "A tertúlia-piloto testa um formato simples: um tema claro, uma pessoa convidada, uma sala acolhedora, conversa com o público e um registo audiovisual cuidado. O resultado será a sessão e uma edição curta que possa ser vista por quem não esteve presente.\n\nAntes de avançar faltam tema, convidado, espaço, data, capacidade, direitos de imagem e som, plano de gravação, edição e orçamento. Não existe ainda qualquer presença ou parceria confirmada.",
    coverImageUrl: null,
    status: "preparing",
    goalCents: 0,
    confirmedCents: 0,
    currency: "EUR",
    budgetNote:
      "Meta a definir depois de fechar sala, captação de som e imagem, edição, autorizações e acolhimento do público.",
    materialNeeds: [
      "Sala acessível e adequada à conversa",
      "Microfones, câmara, luz e armazenamento",
      "Acolhimento e sinalética simples",
    ],
    technicalNeeds: [
      "Moderação e preparação editorial",
      "Captação e edição audiovisual",
      "Consentimentos e direitos de imagem e som",
    ],
    volunteerNeeds: [
      "Acolhimento e apoio de sala",
      "Operação audiovisual acompanhada",
      "Transcrição, revisão e preparação de excertos",
    ],
    updates: [],
    isPublished: true,
    updatedAt: Date.UTC(2026, 8, 17),
  },
];

export const REVIEW_PROJECT_SLUGS = REVIEW_PROJECTS.map(
  (project) => project.slug
);

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  preparing: "Em preparação",
  funding: "A recolher apoios",
  funded: "Meta alcançada",
  completed: "Concluído",
};
export const SUPPORT_LABELS = {
  financial: "Apoio financeiro",
  material: "Material",
  technical: "Conhecimento técnico",
  volunteer: "Voluntariado",
} as const;
export type SupportType = keyof typeof SUPPORT_LABELS;
const STORE_KEY = "lusiada-projects-demo-v2";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type DemoState = { projects: DemoProject[]; contributions: DemoContribution[] };
const seedState = (): DemoState => ({
  projects: REVIEW_PROJECTS.map((project) => ({ ...project })),
  contributions: [],
});

function withReviewProjects(state: DemoState): DemoState {
  const present = new Set(state.projects.map((project) => project.slug));
  return {
    ...state,
    projects: [
      ...state.projects,
      ...REVIEW_PROJECTS.filter((project) => !present.has(project.slug)).map(
        (project) => ({ ...project })
      ),
    ],
  };
}

export function readDemoState(): DemoState {
  if (typeof window === "undefined") {
    return seedState();
  }
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? withReviewProjects(JSON.parse(raw) as DemoState) : seedState();
  } catch {
    return seedState();
  }
}
export function writeDemoState(state: DemoState) {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("lusiada-projects-demo"));
}
export function saveDemoProject(project: DemoProject, originalSlug?: string) {
  validateDemoProject(project);
  const state = readDemoState();
  const collision = state.projects.some(
    (p) => p.slug === project.slug && p.slug !== originalSlug
  );
  if (collision) {
    throw new Error("Este endereço já existe.");
  }
  const next = state.projects.filter(
    (p) => p.slug !== originalSlug && p.slug !== project.slug
  );
  next.push({ ...project, confirmedCents: 0, updatedAt: Date.now() });
  writeDemoState({
    projects: next,
    contributions: state.contributions.map((row) =>
      originalSlug && row.projectSlug === originalSlug
        ? { ...row, projectSlug: project.slug }
        : row
    ),
  });
}
export function validateDemoProject(project: DemoProject) {
  const now = Date.now();
  if (!SLUG_RE.test(project.slug) || project.slug.length > 80) {
    throw new Error("Endereço inválido.");
  }
  if (
    project.title.length < 3 ||
    project.title.length > 120 ||
    project.summary.length < 10 ||
    project.summary.length > 320 ||
    project.description.length < 20 ||
    project.description.length > 10_000
  ) {
    throw new Error("Preencha título, resumo e descrição dentro dos limites.");
  }
  if (
    (project.eyebrow &&
      (project.eyebrow.length < 2 || project.eyebrow.length > 80)) ||
    (project.budgetNote &&
      (project.budgetNote.length < 2 || project.budgetNote.length > 1000))
  ) {
    throw new Error("Chapéu ou nota de orçamento inválidos.");
  }
  if (
    !Number.isSafeInteger(project.goalCents) ||
    project.goalCents < 0 ||
    project.goalCents > 100_000_000
  ) {
    throw new Error("Meta inválida.");
  }
  if (
    project.coverImageUrl &&
    (project.coverImageUrl.length > 500 ||
      !/^(https:\/\/|\/)/.test(project.coverImageUrl))
  ) {
    throw new Error("A capa deve usar HTTPS ou um asset local iniciado por /.");
  }
  const needs = [
    project.materialNeeds,
    project.technicalNeeds,
    project.volunteerNeeds,
  ];
  if (
    needs.some(
      (group) =>
        group.length > 20 ||
        group.some((item) => item.length < 2 || item.length > 240)
    )
  ) {
    throw new Error("Necessidades inválidas.");
  }
  if (
    project.updates.length > 30 ||
    project.updates.some(
      (item) =>
        item.title.length < 2 ||
        item.title.length > 120 ||
        item.body.length < 10 ||
        item.body.length > 4000 ||
        !Number.isSafeInteger(item.publishedAt) ||
        item.publishedAt < 0 ||
        item.publishedAt > now + 5 * 60 * 1000
    )
  ) {
    throw new Error("Actualizações inválidas.");
  }
}
export function confirmDemoContribution(
  input: Omit<DemoContribution, "id" | "confirmedAt" | "revokedAt">
) {
  if (
    !Number.isSafeInteger(input.amountCents) ||
    input.amountCents < 1 ||
    input.amountCents > 100_000_000 ||
    input.provider.trim().length < 2 ||
    input.provider.trim().length > 80 ||
    input.reference.trim().length < 2 ||
    input.reference.trim().length > 160
  ) {
    throw new Error("Dados do recebimento inválidos.");
  }
  const state = readDemoState();
  const existing = state.contributions.find(
    (row) =>
      row.projectSlug === input.projectSlug && row.reference === input.reference
  );
  if (existing) {
    if (existing.revokedAt) {
      throw new Error(
        "Esta referência pertence a um recebimento revogado. Use uma nova referência para preservar o histórico."
      );
    }
    if (
      existing.amountCents !== input.amountCents ||
      existing.provider !== input.provider
    ) {
      throw new Error(
        "A referência já existe com outro valor ou origem. Confirme os dados."
      );
    }
    return existing;
  }
  const row: DemoContribution = {
    ...input,
    id: crypto.randomUUID(),
    confirmedAt: Date.now(),
    revokedAt: null,
  };
  writeDemoState({
    ...state,
    contributions: [
      ...state.contributions.filter((item) => item.id !== row.id),
      row,
    ],
  });
  return row;
}
export function revokeDemoContribution(id: string) {
  const state = readDemoState();
  writeDemoState({
    ...state,
    contributions: state.contributions.map((row) =>
      row.id === id && !row.revokedAt ? { ...row, revokedAt: Date.now() } : row
    ),
  });
}
export function demoPublicProjects() {
  const state = readDemoState();
  return state.projects
    .filter((p) => p.isPublished)
    .map((p) => ({
      ...p,
      confirmedCents: state.contributions
        .filter((c) => c.projectSlug === p.slug && !c.revokedAt)
        .reduce((sum, c) => sum + c.amountCents, 0),
    }));
}
export function resetDemoState() {
  writeDemoState(seedState());
}
export function euros(cents: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
export function parseEuroInput(value: string) {
  if (!value.trim()) {
    return;
  }
  const amount = Number(value.trim().replace(",", "."));
  return !Number.isFinite(amount) || amount < 1 || amount > 1_000_000
    ? null
    : Math.round(amount * 100);
}
