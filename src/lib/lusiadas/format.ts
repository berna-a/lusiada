/** Tempo relativo em PT-PT: "agora", "há 3 min", "há 2 h", "há 5 dias". */
export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) {
    return "agora";
  }
  const m = Math.round(s / 60);
  if (m < 60) {
    return `há ${m} min`;
  }
  const h = Math.round(m / 60);
  if (h < 24) {
    return `há ${h} h`;
  }
  const d = Math.round(h / 24);
  if (d < 30) {
    return `há ${d} ${d === 1 ? "dia" : "dias"}`;
  }
  const mo = Math.round(d / 30);
  return `há ${mo} ${mo === 1 ? "mês" : "meses"}`;
}
