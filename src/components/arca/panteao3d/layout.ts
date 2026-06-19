// Geometria partilhada da galeria do Panteão (usada pela cena e pelo hall).

export const SPACING = 4.3;

/** Posição x da estátua i numa fila de n estátuas, centrada na origem. */
export function xAt(i: number, n: number) {
  return (i - (n - 1) / 2) * SPACING;
}

/** Limite de deslocação lateral (|pan|) para ver da primeira à última estátua. */
export function panLimit(n: number) {
  return ((n - 1) / 2) * SPACING;
}
