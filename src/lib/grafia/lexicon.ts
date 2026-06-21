// Camada "Portuguez" do léxico — a parte que é NOSSA e editável (futura ARCA).
//
// O grosso das divergências (eixo consoante AO90 ↔ pré-AO90, ~7.5k pares com
// inflexões) vem de `divergencias.json`. Aqui ficam apenas as decisões próprias
// da grafia Portuguez:
//  • "z" — gentílicos onde o Portuguez usa z e a norma usa s (português→portuguez)
//  • "nome" — nomes próprios (Luiz)
//  • "acento" — formas que mantemos como o pré-AO mas o AO90 desacentua
//
// Esta camada é a que a comunidade da ARCA vai construir e votar. É também o que
// semeia a tabela `lexicon` do Convex.
//
// Fonte do `divergencias.json`: pedro-mendonca/Convert-PT-AO90 (GPL-3.0) — pares
// pré-AO90 ↔ AO90. Ver src/lib/grafia/FONTES.md.

export type Grafia = "pz" | "ao" | "pre";

export type LexEntry = {
  pz: string;
  ao: string;
  pre: string;
  kind: "z" | "consoante" | "acento" | "mes" | "nome";
  caseExact?: boolean;
};

/** Gera as 4 formas (m/f, sing/pl) de um gentílico do eixo "z". */
function gentilico(pzBase: string, normaBase: string): LexEntry[] {
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

/** Camada Portuguez (editável). */
export const LEXICON: LexEntry[] = [
  // ── Gentílicos com "z" (Portuguez) ──
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

  // ── Acentos que o Portuguez/pré-AO mantêm e o AO90 removeu ──
  { pz: "lêem", ao: "leem", pre: "lêem", kind: "acento" },
  { pz: "vêem", ao: "veem", pre: "vêem", kind: "acento" },
  { pz: "crêem", ao: "creem", pre: "crêem", kind: "acento" },
  { pz: "dêem", ao: "deem", pre: "dêem", kind: "acento" },
  { pz: "vôo", ao: "voo", pre: "vôo", kind: "acento" },
  { pz: "vôos", ao: "voos", pre: "vôos", kind: "acento" },
];
