// Motor do hábito diário d'Os Lusíadas: estrofe do dia + plano de 30 dias.
// Determinístico (sem backend); o progresso do plano guarda-se em localStorage.

/** Nº de estrofes por canto (I..X) — total 1102. */
export const STANZA_COUNTS = [106, 113, 143, 104, 100, 99, 87, 99, 95, 156];
export const TOTAL_STANZAS = STANZA_COUNTS.reduce((a, b) => a + b, 0);
export const PLAN_DAYS = 30;

export type Ref = { canto: number; stanza: number };

/** Índice global (0..1101) → { canto (1-10), estrofe (1-N) }. */
export function globalToRef(idx: number): Ref {
  let i = ((idx % TOTAL_STANZAS) + TOTAL_STANZAS) % TOTAL_STANZAS;
  for (let c = 0; c < STANZA_COUNTS.length; c += 1) {
    if (i < STANZA_COUNTS[c]) {
      return { canto: c + 1, stanza: i + 1 };
    }
    i -= STANZA_COUNTS[c];
  }
  return { canto: 1, stanza: 1 };
}

/** A estrofe do dia (roda por toda a obra, uma por dia). */
export function refDoDia(now = new Date()): Ref {
  const day = Math.floor(now.getTime() / 86_400_000);
  return globalToRef(day);
}

/** Intervalo de leitura do dia d (1..30) do plano. */
export function planoDia(d: number): { start: Ref; end: Ref; count: number } {
  const per = Math.ceil(TOTAL_STANZAS / PLAN_DAYS);
  const startIdx = (d - 1) * per;
  const endIdx = Math.min(d * per - 1, TOTAL_STANZAS - 1);
  return {
    start: globalToRef(startIdx),
    end: globalToRef(endIdx),
    count: endIdx - startIdx + 1,
  };
}

/* ── Progresso do plano (localStorage) ── */

const KEY = "lus-plano";
export type PlanoState = { startedAt: string | null; done: number[] };

export function loadPlano(): PlanoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p.done)) {
        return { startedAt: p.startedAt ?? null, done: p.done };
      }
    }
  } catch {
    // ignora
  }
  return { startedAt: null, done: [] };
}

export function savePlano(state: PlanoState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignora
  }
}
