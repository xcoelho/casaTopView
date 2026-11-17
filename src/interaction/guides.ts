/** Guias de alinhamento exibidas durante arrastes. */
import type { Vec2 } from '../core/geometry';

export interface Guide {
  a: Vec2;
  b: Vec2;
  label?: string;
  kind: 'align' | 'measure';
}

export function makeGuide(a: Vec2, b: Vec2, label?: string): Guide {
  return { a, b, label, kind: 'align' };
}
