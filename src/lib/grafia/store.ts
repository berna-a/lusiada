// Store leve da grafia de leitura escolhida pelo utilizador.
//
// O dicionário (~300 KB) só é carregado quando o utilizador escolhe uma grafia
// diferente de Portuguez — `import()` dinâmico = chunk separado, fora do bundle
// principal. A conversão é apenas de LEITURA (client-side); o conteúdo canónico
// indexado pelo Google continua a ser Portuguez.

import { useSyncExternalStore } from "react";
import type { Grafia } from "./lexicon";

type Converter = (text: string, to: Grafia, from?: Grafia) => string;

const STORAGE_KEY = "lusopedia-grafia";

function initialGrafia(): Grafia {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ao" || saved === "pre" || saved === "pz") {
      return saved;
    }
  } catch {
    // localStorage indisponível — ignora
  }
  return "pz";
}

let grafia: Grafia = initialGrafia();
let converter: Converter | null = null;
let loading = false;

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) {
    l();
  }
}

async function ensureConverter() {
  if (converter || loading) {
    return;
  }
  loading = true;
  try {
    const mod = await import("./convert");
    converter = mod.convertGrafia;
  } finally {
    loading = false;
    emit();
  }
}

// Se a preferência guardada já não é Portuguez, começa a carregar o dicionário.
if (grafia !== "pz") {
  ensureConverter();
}

export function setGrafia(next: Grafia) {
  grafia = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignora
  }
  if (next !== "pz") {
    ensureConverter();
  }
  emit();
}

/** Converte um texto da forma canónica (Portuguez) para a grafia escolhida. */
export function convert(text: string): string {
  if (grafia === "pz" || !converter) {
    return text;
  }
  return converter(text, grafia);
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

// Muda quando a grafia muda OU quando o dicionário acaba de carregar.
function getSnapshot() {
  return `${grafia}${converter ? "+" : "-"}`;
}

/** Hook React: grafia atual, setter e função de conversão reactiva. */
export function useGrafia() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { grafia, setGrafia, convert, ready: !!converter };
}
