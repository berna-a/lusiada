// Léxico das divergências entre grafias — a fundação do motor de conversão.
//
// Guardamos APENAS as palavras que diferem entre as três grafias (a esmagadora
// maioria das palavras é igual). Cada entrada tem a forma nas três grafias, em
// minúsculas; o conversor preserva maiúsculas e inflexões de caixa.
//
// Eixos de divergência:
//  • "z" (Portuguez) — gentílicos/adjectivos onde o Portuguez usa z e a norma s
//    (português→portuguez). NÃO é regra cega: "beleza/natureza" são z na norma.
//  • "consoante" (AO90) — consoantes mudas que o AO90 deixa cair (acção→ação),
//    mas que o Portuguez e o pré-AO90 mantêm. Exceções reais que NÃO mudam em
//    pt-PT (facto, contacto, pacto, sector→setor é mudança; facto não) ficam de
//    fora porque não divergem.
//  • "acento" — acentos que o AO90 removeu (lêem→leem).
//  • "mês" — o AO90 escreve os meses em minúscula (Janeiro→janeiro).
//
// Semente inicial. A médio prazo é gerada a partir da tabela `lexicon` do
// Convex (editável pela comunidade na ARCA) e de listas de domínio público.

export type Grafia = "pz" | "ao" | "pre";

export type LexEntry = {
  /** Portuguez (forma canónica). */
  pz: string;
  /** Acordo Ortográfico de 1990. */
  ao: string;
  /** Pré-acordo (ortografia de 1945). */
  pre: string;
  /** Eixo de divergência (para análise/curadoria). */
  kind: "z" | "consoante" | "acento" | "mes" | "nome";
  /** Quando true, a forma de destino é usada tal-qual (ex.: meses). */
  caseExact?: boolean;
};

export const LEXICON: LexEntry[] = [
  // ── Eixo "z" — gentílicos e adjectivos (Portuguez usa z; norma usa s) ──
  ...gentilico("portuguez", "português"),
  ...gentilico("francez", "francês"),
  ...gentilico("inglez", "inglês"),
  ...gentilico("holandez", "holandês"),
  ...gentilico("japonez", "japonês"),
  ...gentilico("chinez", "chinês"),
  ...gentilico("irlandez", "irlandês"),
  ...gentilico("escocez", "escocês"),
  ...gentilico("freguez", "freguês"),
  ...gentilico("camponez", "camponês"),

  // ── Nomes próprios com grafia Portuguez ──
  { pz: "luiz", ao: "luís", pre: "luís", kind: "nome" },

  // ── Eixo "consoante" — AO90 deixa cair a consoante muda (c/p) ──
  ...consoante("acção", "ação"),
  ...consoante("acto", "ato"),
  ...consoante("actor", "ator"),
  ...consoante("actriz", "atriz"),
  ...consoante("actual", "atual"),
  ...consoante("actualidade", "atualidade"),
  ...consoante("actividade", "atividade"),
  ...consoante("activo", "ativo"),
  ...consoante("adoptar", "adotar"),
  ...consoante("adopção", "adoção"),
  ...consoante("afecto", "afeto"),
  ...consoante("afectar", "afetar"),
  ...consoante("arquitecto", "arquiteto"),
  ...consoante("arquitectura", "arquitetura"),
  ...consoante("aspecto", "aspeto"),
  ...consoante("baptismo", "batismo"),
  ...consoante("baptizar", "batizar"),
  ...consoante("colecção", "coleção"),
  ...consoante("coleccionar", "colecionar"),
  ...consoante("colectivo", "coletivo"),
  ...consoante("confecção", "confeção"),
  ...consoante("correcto", "correto"),
  ...consoante("dialecto", "dialeto"),
  ...consoante("detecção", "deteção"),
  ...consoante("direcção", "direção"),
  ...consoante("directo", "direto"),
  ...consoante("director", "diretor"),
  ...consoante("eléctrico", "elétrico"),
  ...consoante("electricidade", "eletricidade"),
  ...consoante("electrónico", "eletrónico"),
  ...consoante("exacto", "exato"),
  ...consoante("excepção", "exceção"),
  ...consoante("facção", "fação"),
  ...consoante("factor", "fator"),
  ...consoante("factual", "fatual"),
  ...consoante("fractura", "fratura"),
  ...consoante("infecção", "infeção"),
  ...consoante("inspecção", "inspeção"),
  ...consoante("objecção", "objeção"),
  ...consoante("objectivo", "objetivo"),
  ...consoante("objecto", "objeto"),
  ...consoante("olfacto", "olfato"),
  ...consoante("óptimo", "ótimo"),
  ...consoante("óptica", "ótica"),
  ...consoante("perspectiva", "perspetiva"),
  ...consoante("projecto", "projeto"),
  ...consoante("protecção", "proteção"),
  ...consoante("reacção", "reação"),
  ...consoante("recepção", "receção"),
  ...consoante("redacção", "redação"),
  ...consoante("respectivo", "respetivo"),
  ...consoante("secção", "seção"),
  ...consoante("sector", "setor"),
  ...consoante("selecção", "seleção"),
  ...consoante("seleccionar", "selecionar"),
  ...consoante("espectáculo", "espetáculo"),
  ...consoante("espectador", "espetador"),
  ...consoante("tacto", "tato"),
  ...consoante("tecto", "teto"),
  ...consoante("Egipto", "Egito"),
  ...consoante("peremptório", "perentório"),

  // ── Eixo "acento" — AO90 removeu acentos (formas verbais e outras) ──
  { pz: "lêem", ao: "leem", pre: "lêem", kind: "acento" },
  { pz: "vêem", ao: "veem", pre: "vêem", kind: "acento" },
  { pz: "crêem", ao: "creem", pre: "crêem", kind: "acento" },
  { pz: "dêem", ao: "deem", pre: "dêem", kind: "acento" },
  { pz: "vôo", ao: "voo", pre: "vôo", kind: "acento" },
  { pz: "vôos", ao: "voos", pre: "vôos", kind: "acento" },
  { pz: "enjôo", ao: "enjoo", pre: "enjôo", kind: "acento" },

  // ── Eixo "mês" — AO90 escreve em minúscula; Portuguez/pré-AO em maiúscula ──
  ...mes("Janeiro", "janeiro"),
  ...mes("Fevereiro", "fevereiro"),
  ...mes("Março", "março"),
  ...mes("Abril", "abril"),
  ...mes("Maio", "maio"),
  ...mes("Junho", "junho"),
  ...mes("Julho", "julho"),
  ...mes("Agosto", "agosto"),
  ...mes("Setembro", "setembro"),
  ...mes("Outubro", "outubro"),
  ...mes("Novembro", "novembro"),
  ...mes("Dezembro", "dezembro"),
];

/** Gera as 4 formas (m/f, sing/pl) de um gentílico do eixo "z". */
function gentilico(pzBase: string, normaBase: string): LexEntry[] {
  // pzBase termina em "z" (portuguez); normaBase em "ês" (português).
  const pzStem = pzBase.slice(0, -1); // "portugue"
  const normaStem = normaBase.slice(0, -2); // "portugu"
  return [
    { pz: `${pzStem}z`, ao: `${normaStem}ês`, pre: `${normaStem}ês`, kind: "z" },
    {
      pz: `${pzStem}za`,
      ao: `${normaStem}esa`,
      pre: `${normaStem}esa`,
      kind: "z",
    },
    {
      pz: `${pzStem}zes`,
      ao: `${normaStem}eses`,
      pre: `${normaStem}eses`,
      kind: "z",
    },
    {
      pz: `${pzStem}zas`,
      ao: `${normaStem}esas`,
      pre: `${normaStem}esas`,
      kind: "z",
    },
  ];
}

/** Entrada do eixo consoante + o plural quando é regular e seguro. */
function consoante(pz: string, ao: string): LexEntry[] {
  const out: LexEntry[] = [{ pz, ao, pre: pz, kind: "consoante" }];
  const isProper = pz[0] === pz[0].toUpperCase();
  let pzPl: string | null = null;
  let aoPl: string | null = null;
  if (isProper) {
    // nomes próprios não pluralizam
  } else if (pz.endsWith("ção")) {
    pzPl = `${pz.slice(0, -3)}ções`;
    aoPl = `${ao.slice(0, -3)}ções`;
  } else if (pz.endsWith("or")) {
    pzPl = `${pz}es`;
    aoPl = `${ao}es`;
  } else if (/[aeiou]$/.test(pz) && !pz.endsWith("ão")) {
    pzPl = `${pz}s`;
    aoPl = `${ao}s`;
  }
  if (pzPl && aoPl) {
    out.push({ pz: pzPl, ao: aoPl, pre: pzPl, kind: "consoante" });
  }
  return out;
}

/** Entrada de mês (caixa exacta: AO90 minúscula, restantes maiúscula). */
function mes(maiuscula: string, minuscula: string): LexEntry[] {
  return [
    {
      pz: maiuscula,
      ao: minuscula,
      pre: maiuscula,
      kind: "mes",
      caseExact: true,
    },
  ];
}
