// Guardados (estrofes favoritas) e progresso de leitura — locais ao dispositivo
// (sem login). Emitem um evento para que a UI reaja entre componentes/abas.

import { useSyncExternalStore } from "react";

export type SavedStanza = { c: number; e: number; preview: string; ts: number };

const SAVED_KEY = "lus-saved";
const VISITED_KEY = "lus-visited";
const EVT = "lus-saved-change";

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVT));
  } catch {
    // armazenamento indisponível — ignora
  }
}

export function getSaved(): SavedStanza[] {
  return read<SavedStanza[]>(SAVED_KEY, []);
}

export function isSaved(c: number, e: number): boolean {
  return getSaved().some((s) => s.c === c && s.e === e);
}

/** Alterna o estado guardado de uma estrofe. Devolve o novo estado (true = guardada). */
export function toggleSaved(c: number, e: number, preview: string): boolean {
  const list = getSaved();
  const i = list.findIndex((s) => s.c === c && s.e === e);
  if (i >= 0) {
    list.splice(i, 1);
    write(SAVED_KEY, list);
    return false;
  }
  list.push({ c, e, preview, ts: Date.now() });
  write(SAVED_KEY, list);
  return true;
}

export function removeSaved(c: number, e: number) {
  write(
    SAVED_KEY,
    getSaved().filter((s) => !(s.c === c && s.e === e))
  );
}

export function getVisited(): number[] {
  return read<number[]>(VISITED_KEY, []);
}

export function markVisited(c: number) {
  const list = getVisited();
  if (!list.includes(c)) {
    list.push(c);
    write(VISITED_KEY, list);
  }
}

function subscribe(cb: () => void): () => void {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

// Snapshot estável: useSyncExternalStore exige a MESMA referência enquanto os
// dados não mudam (senão entra em loop). Cacheia por conteúdo (JSON bruto).
const EMPTY: SavedStanza[] = [];
let cacheRaw: string | null = null;
let cacheVal: SavedStanza[] = EMPTY;

function savedSnapshot(): SavedStanza[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SAVED_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cacheRaw) {
    return cacheVal;
  }
  cacheRaw = raw;
  try {
    cacheVal = raw ? (JSON.parse(raw) as SavedStanza[]) : EMPTY;
  } catch {
    cacheVal = EMPTY;
  }
  return cacheVal;
}

/** Subscrição reactiva à lista de guardados. */
export function useSaved(): SavedStanza[] {
  return useSyncExternalStore(subscribe, savedSnapshot, () => EMPTY);
}

/** True/false reactivo para uma estrofe concreta. */
export function useIsSaved(c: number, e: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isSaved(c, e),
    () => false
  );
}
