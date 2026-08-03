import {
  COR_ESTADO,
  type Estado,
  ROTULO_ESTADO,
  TINTA_DO_ESTADO,
} from "@/lib/azulejos/mapa-estilo";

/**
 * O selo de um estado — íntegro, danificado, em risco, desaparecido.
 *
 * Era desenhado de quatro maneiras diferentes consoante a página: um círculo
 * e letra branca no mapa, um círculo e ponto colorido nos filtros, um retalho
 * cheio no pop-up, outro na ficha. É o vocabulário do inventário, e vai
 * acompanhar as colecções que vierem a seguir — por isso passa a ser um só.
 */

type Props = {
  estado: Estado;
  tamanho?: "normal" | "pequeno";
};

export function SeloEstado({ estado, tamanho = "normal" }: Props) {
  const pequeno = tamanho === "pequeno";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-body uppercase tracking-[0.1em] ${
        pequeno ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]"
      }`}
      style={{
        backgroundColor: COR_ESTADO[estado],
        color: TINTA_DO_ESTADO[estado],
      }}
    >
      {ROTULO_ESTADO[estado]}
    </span>
  );
}
