/** Gerador de identificadores curtos e únicos. */
let counter = 0;

export function uid(prefix = 'id'): string {
  counter = (counter + 1) % 1_000_000;
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${time}${counter.toString(36)}${rand}`;
}
