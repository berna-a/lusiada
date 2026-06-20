export const CATEGORIES = [
  "Pessoas",
  "Lugares",
  "Obras",
  "Eventos",
  "Conceitos",
  "Língua",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Campos sugeridos para a ficha lateral, por categoria (o autor pode mudar). */
export const INFOBOX_SUGGESTIONS: Record<string, string[]> = {
  Pessoas: ["Nascimento", "Morte", "Naturalidade", "Época", "Área"],
  Lugares: ["Localização", "Tipo", "Época"],
  Obras: ["Autor", "Ano", "Tipo"],
  Eventos: ["Data", "Local"],
  Conceitos: [],
  Língua: ["Tipo", "Origem"],
};
