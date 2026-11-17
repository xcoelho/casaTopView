/** Móveis desenhados vetorialmente em coordenadas de mundo. */
import type { Item, Plan } from '../../core/document';
import type { FurnitureDef } from '../../catalog/types';
import { defaultColors, drawOrder, getDef } from '../../catalog/registry';
import { softShadow } from '../../catalog/draw';
import type { Camera } from '../viewport';

export function paintItem(
  ctx: CanvasRenderingContext2D,
  item: Item,
  def: FurnitureDef,
  px = 1,
): void {
  const colors = { ...defaultColors(def), ...item.colors };
  ctx.save();
  ctx.translate(item.x, item.y);
  if (item.rot) ctx.rotate((item.rot * Math.PI) / 180);
  ctx.translate(-item.w / 2, -item.d / 2);
  if (!def.flat) {
    softShadow(ctx, item.w, item.d, Math.min(9, Math.min(item.w, item.d) * 0.14));
  }
  def.draw({ ctx, w: item.w, d: item.d, colors, px });
  ctx.restore();
}

export function drawItems(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  dpr: number,
): void {
  if (!plan.items.length) return;
  ctx.setTransform(dpr * cam.zoom, 0, 0, dpr * cam.zoom, dpr * cam.x, dpr * cam.y);
  const items = [...plan.items].sort(drawOrder);
  for (const item of items) {
    if (item.hidden) continue;
    const def = getDef(item.defId);
    if (!def) continue;
    paintItem(ctx, item, def, cam.zoom);
  }
}
