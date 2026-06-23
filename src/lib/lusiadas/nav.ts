// Navegação d'Os Lusíadas, partilhada entre o leitor, o hub e as páginas.
// No domínio dedicado oslusiadas.pt a raiz "/" é o Início (hub) e o leitor
// vive em /canto/N. Na alusiada.pt tudo vive sob /os-lusiadas.

export function isLusiadasHost(): boolean {
  return (
    typeof window !== "undefined" &&
    /(^|\.)oslusiadas\.pt$/i.test(window.location.hostname)
  );
}

/** Prefixo das rotas: "" no domínio dedicado, "/os-lusiadas" na alusiada.pt. */
export function lusiadasBase(): string {
  return isLusiadasHost() ? "" : "/os-lusiadas";
}

/** Caminho do leitor de um canto. */
export function cantoHref(base: string, n: number): string {
  if (base === "") {
    return `/canto/${n}`; // oslusiadas.pt — a raiz é o hub
  }
  return n === 1 ? base : `${base}/canto/${n}`;
}

/** Liga um target de anotação ("c5:e40:v2") à estrofe no leitor. */
export function targetHref(base: string, target: string): string {
  const c = Number(target.match(/^c(\d+)/)?.[1] ?? 0);
  const e = target.match(/:e(\d+)/)?.[1];
  if (!c) {
    return cantoHref(base, 1);
  }
  return `${cantoHref(base, c)}${e ? `#estrofe-${e}` : ""}`;
}

/* Última leitura (para "Continuar a leitura" no hub). */

export function setLastRead(canto: number) {
  try {
    localStorage.setItem("lus-last", String(canto));
  } catch {
    // ignora
  }
}

export function getLastRead(): number | null {
  try {
    const v = localStorage.getItem("lus-last");
    const n = v ? Number(v) : null;
    return n && n >= 1 && n <= 10 ? n : null;
  } catch {
    return null;
  }
}
