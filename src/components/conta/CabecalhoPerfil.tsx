import { X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * O cabeçalho de um perfil: capa, retrato, nome, terra e frase.
 *
 * É o mesmo no meu perfil e no de outra pessoa — só muda o que se pode fazer
 * com ele, que entra por `accoes`. Tê-lo em dois sítios levava a que uma
 * correcção num deles não chegasse ao outro.
 */

type Props = {
  nome: string;
  concelho: string | null;
  bio: string | null;
  avatarUrl: string | null;
  capaUrl: string | null;
  /** Que altura da capa fica à vista, de 0 (topo) a 100 (fundo). */
  capaPos: number;
  /** Canto da capa — o menu de quem é dono da página. */
  accoes?: ReactNode;
  /** Enquanto se enquadra a capa, o cabeçalho fica em modo de arrasto. */
  aEnquadrar?: boolean;
  onEnquadrar?: (pos: number) => void;
};

/** Vê a fotografia inteira, sem o recorte redondo. */
function Lupa({
  src,
  alt,
  onFechar,
}: {
  src: string;
  alt: string;
  onFechar: () => void;
}) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onFechar();
      }
    };
    window.addEventListener("keydown", tecla);
    // O fundo não deve rolar por trás da fotografia aberta.
    const antes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = antes;
    };
  }, [onFechar]);

  return (
    <dialog
      aria-label={alt}
      className="fixed inset-0 z-[100] flex h-full w-full max-w-none items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
      onClick={onFechar}
      open
    >
      <img
        alt={alt}
        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        src={src}
      />
      <button
        aria-label="Fechar"
        className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        onClick={onFechar}
        type="button"
      >
        <X size={20} strokeWidth={1.75} />
      </button>
    </dialog>
  );
}

export function CabecalhoPerfil({
  nome,
  concelho,
  bio,
  avatarUrl,
  capaUrl,
  capaPos,
  accoes,
  aEnquadrar = false,
  onEnquadrar,
}: Props) {
  const [aberta, setAberta] = useState(false);
  const capa = useRef<HTMLDivElement | null>(null);
  const arrasto = useRef<{ y: number; pos: number } | null>(null);

  // Arrastar a capa move a janela pela fotografia. Em píxeis a conta seria
  // enganadora — o que interessa é a fracção da altura visível que se andou.
  const mover = (y: number) => {
    const inicio = arrasto.current;
    const alturaVisivel = capa.current?.clientHeight ?? 1;
    if (!(inicio && onEnquadrar)) {
      return;
    }
    const andou = ((inicio.y - y) / alturaVisivel) * 100;
    onEnquadrar(Math.min(100, Math.max(0, inicio.pos + andou)));
  };

  useEffect(() => {
    if (!aEnquadrar) {
      return;
    }
    const aoMover = (e: PointerEvent) => mover(e.clientY);
    const aoLargar = () => {
      arrasto.current = null;
    };
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerup", aoLargar);
    return () => {
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoLargar);
    };
  });

  return (
    <>
      {/* A capa é o fundo. O retrato vem por cima — daí o `z` explícito: sem
          ele o contentor da capa, que é posicionado, tapava o retrato. */}
      <div className="relative z-0 -mx-6 sm:mx-0">
        <div
          className={`relative h-36 overflow-hidden bg-secondary sm:h-52 sm:rounded-2xl ${
            aEnquadrar ? "cursor-grab touch-none active:cursor-grabbing" : ""
          }`}
          onPointerDown={(e) => {
            if (aEnquadrar) {
              arrasto.current = { y: e.clientY, pos: capaPos };
            }
          }}
          ref={capa}
        >
          {capaUrl ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
              src={capaUrl}
              style={{ objectPosition: `50% ${capaPos}%` }}
            />
          ) : (
            <div className="calcada-pattern h-full w-full opacity-40" />
          )}
          {aEnquadrar && (
            <p className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/45 py-2 text-center font-body text-[13px] text-white">
              Arraste a capa para escolher o que fica à vista
            </p>
          )}
        </div>
        {accoes && (
          <div className="absolute top-3 right-3 z-20 sm:top-4 sm:right-4">
            {accoes}
          </div>
        )}
      </div>

      <header className="relative z-10 -mt-14 flex flex-col items-center text-center">
        <button
          aria-label={avatarUrl ? `Ver a fotografia de ${nome}` : nome}
          className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-secondary shadow-lg transition-transform enabled:hover:scale-[1.03]"
          disabled={!avatarUrl}
          onClick={() => setAberta(true)}
          type="button"
        >
          {avatarUrl ? (
            <img
              alt={nome}
              className="h-full w-full object-cover"
              src={avatarUrl}
            />
          ) : (
            <span className="font-display text-[30px] text-primary">
              {nome.slice(0, 1).toUpperCase()}
            </span>
          )}
        </button>
        <h1 className="mt-5 font-display text-[30px] text-primary leading-tight sm:text-[38px]">
          {nome}
        </h1>
        {concelho && (
          <p className="mt-1.5 font-body text-[14px] text-muted-foreground">
            {concelho}
          </p>
        )}
        {bio && (
          <p className="mx-auto mt-4 max-w-[440px] font-body text-[16px] text-foreground/80 leading-relaxed">
            {bio}
          </p>
        )}
      </header>

      {aberta && avatarUrl && (
        <Lupa alt={nome} onFechar={() => setAberta(false)} src={avatarUrl} />
      )}
    </>
  );
}
