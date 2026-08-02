import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  /** Sempre visível, mesmo com a folha recolhida. */
  cabecalho: ReactNode;
  /** Só visível quando a folha está aberta. */
  children: ReactNode;
  /** Altura da parte visível quando recolhida, em pixels. */
  alturaRecolhida?: number;
};

/**
 * Percentagem do contentor (que é `fixed inset-0`), não unidades de viewport:
 * o `dvh` muda debaixo dos pés no Safari quando a barra de endereço aparece.
 */
const ALTURA_ABERTA = "88%";
const LIMIAR_ARRASTO = 56;

/**
 * Folha inferior arrastável — o padrão dos mapas no telemóvel.
 *
 * Dois estados apenas (recolhida e aberta) de propósito: três pontos de
 * paragem dão mais maneiras de falhar do que valor, e o que interessa aqui
 * é chegar depressa ao botão de fotografar.
 */
export function FolhaInferior({
  cabecalho,
  children,
  alturaRecolhida = 208,
}: Props) {
  const [aberta, setAberta] = useState(false);
  const [arrasto, setArrasto] = useState(0);
  const inicio = useRef<number | null>(null);
  const corpo = useRef<HTMLDivElement | null>(null);

  const aoDescer = useCallback((e: React.PointerEvent) => {
    inicio.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const aoMover = useCallback((e: React.PointerEvent) => {
    if (inicio.current === null) {
      return;
    }
    setArrasto(e.clientY - inicio.current);
  }, []);

  const aoLargar = useCallback((e: React.PointerEvent) => {
    if (inicio.current === null) {
      return;
    }
    const delta = e.clientY - inicio.current;
    if (delta < -LIMIAR_ARRASTO) {
      setAberta(true);
    } else if (delta > LIMIAR_ARRASTO) {
      setAberta(false);
    }
    inicio.current = null;
    setArrasto(0);
  }, []);

  // Ao recolher, o conteúdo volta ao topo — abrir a meio de um scroll confunde.
  useEffect(() => {
    if (!aberta && corpo.current) {
      corpo.current.scrollTop = 0;
    }
  }, [aberta]);

  const alturaBase = aberta ? ALTURA_ABERTA : `${alturaRecolhida}px`;

  return (
    <section
      aria-label="Informação e acções"
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] border-white/60 border-t bg-white/85 shadow-[0_-8px_40px_-8px_rgba(18,58,107,0.28)] backdrop-blur-2xl backdrop-saturate-150 md:inset-x-auto md:bottom-6 md:left-6 md:w-[380px] md:rounded-3xl md:border"
      style={{
        height: alturaBase,
        transform: arrasto
          ? `translateY(${Math.max(0, arrasto)}px)`
          : undefined,
        transition: arrasto ? "none" : "height 320ms cubic-bezier(.32,.72,0,1)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Pega — a zona de arrasto. Toda ela é botão, para abrir sem arrastar. */}
      <button
        aria-expanded={aberta}
        aria-label={aberta ? "Recolher painel" : "Abrir painel"}
        className="w-full shrink-0 cursor-grab touch-none px-6 pt-3 pb-1 active:cursor-grabbing"
        onClick={() => setAberta((v) => !v)}
        onPointerCancel={aoLargar}
        onPointerDown={aoDescer}
        onPointerMove={aoMover}
        onPointerUp={aoLargar}
        type="button"
      >
        <span
          aria-hidden="true"
          className="mx-auto block h-1.5 w-11 rounded-full bg-slate-300"
        />
      </button>

      <div className="shrink-0 px-6 pb-1">{cabecalho}</div>

      <div
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 ${
          aberta ? "opacity-100" : "pointer-events-none opacity-0"
        } transition-opacity duration-200`}
        ref={corpo}
      >
        {children}
      </div>
    </section>
  );
}
