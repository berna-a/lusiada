import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/** Altura da navbar flutuante; é a esta cota que se decide a cor do texto. */
const NAV_HEIGHT = 80;

/**
 * Diz se a navbar está, neste momento, por cima de uma secção de fundo escuro
 * (marcada com `data-nav-theme="dark"`) — para inverter as cores do texto e
 * não ficar azul sobre azul.
 *
 * Sem nenhuma secção marcada na página, devolve sempre `false`, que é o
 * comportamento normal de fundo claro. (Sincronizar com a posição de scroll =
 * uso legítimo de useEffect.)
 */
export function useOnDarkSection() {
  const location = useLocation();
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const compute = () => {
      const seccoes = document.querySelectorAll<HTMLElement>(
        '[data-nav-theme="dark"]'
      );
      let porCima = false;
      seccoes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= NAV_HEIGHT && rect.bottom >= NAV_HEIGHT) {
          porCima = true;
        }
      });
      setOnDark(porCima);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    // A montagem pode preceder o layout final; recalcular logo a seguir.
    const t = window.setTimeout(compute, 50);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
      window.clearTimeout(t);
    };
  }, [location.pathname]);

  return onDark;
}
