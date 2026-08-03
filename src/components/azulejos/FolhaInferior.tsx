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
  /** O que se lê no fundo da folha recolhida, e que também a abre. */
  pista?: string;
  /** Altura da parte visível quando recolhida, em pixels. */
  alturaRecolhida?: number;
};

/**
 * Percentagem do contentor (que é `fixed inset-0`), não unidades de viewport:
 * o `dvh` muda debaixo dos pés no Safari quando a barra de endereço aparece.
 */
const ALTURA_ABERTA = "88%";
const LIMIAR_ARRASTO = 56;
/** Acima disto o gesto foi um arrasto, não um toque. */
const TREMOR = 8;

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
  pista = "Saber mais",
  alturaRecolhida = 208,
}: Props) {
  const [aberta, setAberta] = useState(false);
  const [arrasto, setArrasto] = useState(0);
  const inicio = useRef<number | null>(null);
  const arrastou = useRef(false);
  const corpo = useRef<HTMLDivElement | null>(null);

  const aoDescer = useCallback((e: React.PointerEvent) => {
    inicio.current = e.clientY;
    arrastou.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const aoMover = useCallback((e: React.PointerEvent) => {
    if (inicio.current === null) {
      return;
    }
    const delta = e.clientY - inicio.current;
    if (Math.abs(delta) > TREMOR) {
      arrastou.current = true;
    }
    setArrasto(delta);
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

  /**
   * O clique só conta se a mão esteve quieta. Sem isto, arrastar para cima
   * abria a folha no `pointerup` e o `click` a seguir fechava-a outra vez —
   * o gesto que a página pede era o único que não funcionava.
   */
  const aoClicar = useCallback(() => {
    if (arrastou.current) {
      arrastou.current = false;
      return;
    }
    setAberta((v) => !v);
  }, []);

  // Ao recolher, o conteúdo volta ao topo — abrir a meio de um scroll confunde.
  useEffect(() => {
    if (!aberta && corpo.current) {
      corpo.current.scrollTop = 0;
    }
  }, [aberta]);

  const alturaBase = aberta ? ALTURA_ABERTA : `${alturaRecolhida}px`;

  return (
    <>
      {/* Tocar no mapa por trás recolhe a folha, como em qualquer mapa. Só
          existe com a folha aberta, para não roubar toques ao mapa. */}
      {aberta && (
        <button
          aria-label="Recolher painel"
          className="absolute inset-0 z-10 cursor-default md:hidden"
          onClick={() => setAberta(false)}
          tabIndex={-1}
          type="button"
        />
      )}

      <section
        aria-label="Informação e acções"
        className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] border-white/60 border-t bg-white/85 shadow-[0_-8px_40px_-8px_rgba(18,58,107,0.28)] backdrop-blur-2xl backdrop-saturate-150 md:inset-x-auto md:bottom-6 md:left-6 md:w-[380px] md:rounded-3xl md:border"
        style={{
          height: alturaBase,
          transform: arrasto
            ? `translateY(${Math.max(0, arrasto)}px)`
            : undefined,
          transition: arrasto
            ? "none"
            : "height 320ms cubic-bezier(.32,.72,0,1)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Pega — a zona de arrasto. Alta o suficiente para um polegar: a
            risca vê-se pequena, mas o alvo tem 44px. */}
        <button
          aria-expanded={aberta}
          aria-label={aberta ? "Recolher painel" : "Abrir painel"}
          className="flex w-full shrink-0 cursor-grab touch-none items-center justify-center px-6 pt-4 pb-3 active:cursor-grabbing"
          onClick={aoClicar}
          onPointerCancel={aoLargar}
          onPointerDown={aoDescer}
          onPointerMove={aoMover}
          onPointerUp={aoLargar}
          type="button"
        >
          <span
            aria-hidden="true"
            className="block h-1.5 w-11 rounded-full bg-slate-300"
          />
        </button>

        <div className="shrink-0 px-6">{cabecalho}</div>

        {/* A pista é um botão a sério: arrastar é o gesto elegante, tocar é o
            gesto que toda a gente tenta primeiro. */}
        {!aberta && (
          <button
            className="shrink-0 px-6 pt-2.5 pb-3 text-center font-body text-[13px] text-slate-500 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-700"
            onClick={() => setAberta(true)}
            type="button"
          >
            {pista}
          </button>
        )}

        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 ${
            aberta ? "opacity-100" : "pointer-events-none opacity-0"
          } transition-opacity duration-200`}
          ref={corpo}
        >
          {children}
        </div>
      </section>
    </>
  );
}
