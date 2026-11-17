/** Conversões e formatação de medidas. Tudo internamente em centímetros. */

export const CM_PER_M = 100;

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function roundTo(value: number, step: number): number {
  if (!step) return value;
  return Math.round(value / step) * step;
}

export function toMeters(cm: number): number {
  return cm / CM_PER_M;
}

function trimNumber(value: number, digits: number): string {
  const fixed = value.toFixed(digits);
  const trimmed = fixed.includes('.') ? fixed.replace(/0+$/, '').replace(/\.$/, '') : fixed;
  return trimmed.replace('.', ',');
}

/** "1,25 m" para medidas grandes, "35 cm" para pequenas. */
export function fmtLength(cm: number, digits = 2): string {
  const abs = Math.abs(cm);
  if (abs >= CM_PER_M) return `${(cm / CM_PER_M).toFixed(digits).replace('.', ',')} m`;
  return `${trimNumber(cm, 1)} cm`;
}

/** Sempre em metros, com 2 casas: "3,20 m". */
export function fmtMeters(cm: number): string {
  return `${(cm / CM_PER_M).toFixed(2).replace('.', ',')} m`;
}

/** Área em m² a partir de cm². */
export function fmtArea(cm2: number, digits = 2): string {
  return `${(cm2 / 10000).toFixed(digits).replace('.', ',')} m²`;
}

/** Números de campos de formulário em pt-BR. */
export function parseNumber(raw: string, fallback: number): number {
  const cleaned = raw.replace(/\s/g, '').replace(',', '.');
  const value = Number.parseFloat(cleaned);
  return Number.isFinite(value) ? value : fallback;
}

export function fmtNumber(value: number, digits = 0): string {
  return Number.isFinite(value) ? trimNumber(Number(value.toFixed(digits)), digits) : '0';
}
