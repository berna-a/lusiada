/**
 * As colecções do mapa.
 *
 * O mapa não é dos azulejos: os azulejos são a primeira colecção. Cada uma
 * mora no seu endereço — `alusiada.pt/mapa/azulejos` — e o `/mapa` sozinho
 * mostra tudo. Acrescentar uma colecção nova é acrescentar uma linha aqui.
 */

export type ColeccaoId = "azulejos";

export type Coleccao = {
  nome: string;
  /** O que se lê na barra do mapa, por baixo do nome. */
  descricao: string;
  /** Onde se lê a história completa desta colecção. */
  sobre: string;
};

export const COLECCOES: Record<ColeccaoId, Coleccao> = {
  azulejos: {
    nome: "Azulejos",
    descricao: "O que ainda está nas paredes",
    sobre: "/azulejos",
  },
};

/** Devolve a colecção pedida no endereço, ou null se não existir nenhuma assim. */
export function coleccaoDe(chave: string | undefined): ColeccaoId | null {
  return chave && chave in COLECCOES ? (chave as ColeccaoId) : null;
}
