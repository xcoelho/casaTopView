/** Regra única para saber se a planta tem algo visível na vista 3D. */
import type { Plan } from '../core/document';

export function hasPlanContent(plan: Plan): boolean {
  return plan.walls.length > 0 || plan.rooms.length > 0 || plan.items.some((item) => !item.hidden);
}
