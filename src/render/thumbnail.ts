/** Miniaturas renderizadas com o mesmo desenho usado na planta. */
import type { Plan } from '../core/document';
import { planBounds } from '../core/document';
import type { FurnitureDef } from '../catalog/types';
import { defaultColors } from '../catalog/registry';
import { paintPlan } from './renderer';
import { fitCamera } from './viewport';

const itemCache = new Map<string, string>();

export function itemThumb(def: FurnitureDef, cssW = 120, cssH = 76): string {
  const key = `${def.id}:${cssW}x${cssH}`;
  const cached = itemCache.get(key);
  if (cached) return cached;

  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.scale(dpr, dpr);

  const padding = 12;
  const scale = Math.min((cssW - padding * 2) / def.w, (cssH - padding * 2) / def.d);
  ctx.translate(cssW / 2, cssH / 2);
  ctx.scale(scale, scale);
  ctx.translate(-def.w / 2, -def.d / 2);
  def.draw({ ctx, w: def.w, d: def.d, colors: defaultColors(def), px: scale });

  const url = canvas.toDataURL('image/png');
  itemCache.set(key, url);
  return url;
}

export function planThumb(plan: Plan, cssW = 320, cssH = 190): string {
  const bounds = planBounds(plan);
  const dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  if (!bounds) {
    ctx.fillStyle = '#f7f4ed';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
  const cam = fitCamera(bounds, cssW, cssH, 16);
  paintPlan(ctx, plan, cam, {
    width: cssW,
    height: cssH,
    dpr,
    grid: false,
    dims: false,
    areas: false,
    roomNames: false,
    background: '#fbf9f3',
  });
  return canvas.toDataURL('image/png');
}
