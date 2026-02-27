export function pct(v: number) {
  const n = Math.round(v * 1000) / 10;
  return `${n}%`;
}
