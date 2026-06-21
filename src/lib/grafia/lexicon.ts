// Léxico das divergências entre grafias — a fundação do motor de conversão.
//
// Guardamos APENAS as palavras que diferem entre as três grafias (a esmagadora
// maioria das palavras é igual). Cada entrada tem a forma nas três grafias, em
// minúsculas; o conversor preserva maiúsculas e inflexões de caixa.
//
// Eixos de divergência:
//  • "z" (Portuguez) — gentílicos/adjectivos onde o Portuguez usa z e a norma s
//    (português→portuguez). NÃO é regra cega: "beleza/natureza" são z na norma.
//  • "consoante" (AO90) — consoantes mudas que o AO90 deixa cair
//    (acção→ação), mas que o Portuguez e o pré-AO90 mantêm. Exceções reais
//    (facto, contacto) não entram, porque não divergem.
//
// Este ficheiro é a semente inicial. A médio prazo é gerado a partir da tabela
// `lexicon` do Convex (editável pela comunidade na ARCA) e de listas de domínio
// público (Vocabulário Ortográfico).

export type Grafia = "pz" | "ao" | "pre";

export type LexEntry = {
  /** Portuguez (forma canónica). */
  pz: string;
  /** Acordo Ortográfico de 1990. */
  ao: string;
  /** Pré-acordo (ortografia de 1945). */
  pre: string;
  /** Eixo de divergência (para análise/curadoria). */
  kind: "z" | "consoante" | "nome";
};

export const LEXICON: LexEntry[] = [
  // ── Eixo "z" — gentílicos e adjectivos (Portuguez usa z; norma usa s) ──
  { pz: "portuguez", ao: "português", pre: "português", kind: "z" },
  { pz: "portugueza", ao: "portuguesa", pre: "portuguesa", kind: "z" },
  { pz: "portuguezes", ao: "portugueses", pre: "portugueses", kind: "z" },
  { pz: "portuguezas", ao: "portuguesas", pre: "portuguesas", kind: "z" },
  { pz: "francez", ao: "francês", pre: "francês", kind: "z" },
  { pz: "franceza", ao: "francesa", pre: "francesa", kind: "z" },
  { pz: "francezes", ao: "franceses", pre: "franceses", kind: "z" },
  { pz: "francezas", ao: "francesas", pre: "francesas", kind: "z" },
  { pz: "inglez", ao: "inglês", pre: "inglês", kind: "z" },
  { pz: "ingleza", ao: "inglesa", pre: "inglesa", kind: "z" },
  { pz: "inglezes", ao: "ingleses", pre: "ingleses", kind: "z" },
  { pz: "inglezas", ao: "inglesas", pre: "inglesas", kind: "z" },

  // ── Nomes próprios com grafia Portuguez ──
  { pz: "luiz", ao: "luís", pre: "luís", kind: "nome" },

  // ── Eixo "consoante" — AO90 deixa cair a consoante muda ──
  { pz: "acção", ao: "ação", pre: "acção", kind: "consoante" },
  { pz: "acções", ao: "ações", pre: "acções", kind: "consoante" },
  { pz: "objectivo", ao: "objetivo", pre: "objectivo", kind: "consoante" },
  { pz: "objectivos", ao: "objetivos", pre: "objectivos", kind: "consoante" },
  { pz: "objectiva", ao: "objetiva", pre: "objectiva", kind: "consoante" },
  { pz: "director", ao: "diretor", pre: "director", kind: "consoante" },
  { pz: "directores", ao: "diretores", pre: "directores", kind: "consoante" },
  { pz: "direcção", ao: "direção", pre: "direcção", kind: "consoante" },
  { pz: "actividade", ao: "atividade", pre: "actividade", kind: "consoante" },
  {
    pz: "actividades",
    ao: "atividades",
    pre: "actividades",
    kind: "consoante",
  },
  { pz: "colectivo", ao: "coletivo", pre: "colectivo", kind: "consoante" },
  { pz: "colectiva", ao: "coletiva", pre: "colectiva", kind: "consoante" },
  {
    pz: "arquitectura",
    ao: "arquitetura",
    pre: "arquitectura",
    kind: "consoante",
  },
  { pz: "arquitecto", ao: "arquiteto", pre: "arquitecto", kind: "consoante" },
  { pz: "aspecto", ao: "aspeto", pre: "aspecto", kind: "consoante" },
  { pz: "aspectos", ao: "aspetos", pre: "aspectos", kind: "consoante" },
  { pz: "excepção", ao: "exceção", pre: "excepção", kind: "consoante" },
  { pz: "excepções", ao: "exceções", pre: "excepções", kind: "consoante" },
  { pz: "correcto", ao: "correto", pre: "correcto", kind: "consoante" },
  { pz: "correcta", ao: "correta", pre: "correcta", kind: "consoante" },
  { pz: "afecto", ao: "afeto", pre: "afecto", kind: "consoante" },
  { pz: "óptimo", ao: "ótimo", pre: "óptimo", kind: "consoante" },
  { pz: "óptima", ao: "ótima", pre: "óptima", kind: "consoante" },
  { pz: "exacto", ao: "exato", pre: "exacto", kind: "consoante" },
  { pz: "exacta", ao: "exata", pre: "exacta", kind: "consoante" },
  {
    pz: "electricidade",
    ao: "eletricidade",
    pre: "electricidade",
    kind: "consoante",
  },
  { pz: "adopção", ao: "adoção", pre: "adopção", kind: "consoante" },
  { pz: "baptismo", ao: "batismo", pre: "baptismo", kind: "consoante" },
  { pz: "espectador", ao: "espetador", pre: "espectador", kind: "consoante" },
];
