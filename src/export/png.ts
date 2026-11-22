/** Exportação da planta em PNG. */
import type { Plan } from '../core/document';
import { planBounds } from '../core/document';
import { paintPlan } from '../render/renderer';

export function planFileSlug(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'planta'
  );
}

/** Desenha a planta baixa em um canvas próprio, na resolução de exportação. */
export function planImageCanvas(plan: Plan, transparent = false): HTMLCanvasElement | null {
  const bounds = planBounds(plan);
  if (!bounds) return null;

  const padding = 70;
  const maxSide = 2600;
  const zoom = Math.min(2.6, maxSide / Math.max(bounds.w + padding * 2, 1200));
  const width = Math.max(320, Math.ceil((bounds.w + padding * 2) * zoom));
  const height = Math.max(240, Math.ceil((bounds.h + padding * 2) * zoom));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  paintPlan(
    ctx,
    plan,
    {
      x: (padding - bounds.x) * zoom,
      y: (padding - bounds.y) * zoom,
      zoom,
    },
    {
      width,
      height,
      dpr: 1,
      grid: false,
      dims: plan.settings.showDims,
      areas: true,
      roomNames: true,
      background: transparent ? null : plan.settings.background,
    },
  );

  return canvas;
}

export function exportPlanPNG(plan: Plan, transparent = false): boolean {
  const canvas = planImageCanvas(plan, transparent);
  if (!canvas) return false;

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `${planFileSlug(plan.name)}-planta.png`;
  document.body.append(link);
  link.click();
  link.remove();
  return true;
}
