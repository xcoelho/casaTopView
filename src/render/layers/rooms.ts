/** Pisos, nomes e áreas dos cômodos. */
import type { Plan } from '../../core/document';
import { roomAreaCm2 } from '../../core/document';
import { polygonCentroid } from '../../core/geometry';
import { fmtArea } from '../../core/units';
import { FONT, THEME, paintFloor } from '../theme';
import type { Camera } from '../viewport';
import { worldToScreen } from '../viewport';

export interface RoomLayerOptions {
  showNames?: boolean;
  showAreas?: boolean;
}

export function drawRooms(
  ctx: CanvasRenderingContext2D,
  plan: Plan,
  cam: Camera,
  dpr: number,
  opts: RoomLayerOptions = {},
): void {
  if (!plan.rooms.length) return;

  ctx.setTransform(dpr * cam.zoom, 0, 0, dpr * cam.zoom, dpr * cam.x, dpr * cam.y);
  for (const room of plan.rooms) {
    paintFloor(ctx, room.points, room.floor, cam.zoom);
    ctx.beginPath();
    ctx.moveTo(room.points[0].x, room.points[0].y);
    for (let i = 1; i < room.points.length; i++) ctx.lineTo(room.points[i].x, room.points[i].y);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(90, 84, 70, 0.22)';
    ctx.lineWidth = Math.max(0.6, 1 / cam.zoom);
    ctx.stroke();
  }

  if (opts.showNames === false && opts.showAreas === false) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const room of plan.rooms) {
    const center = worldToScreen(cam, polygonCentroid(room.points));
    const areaCm2 = roomAreaCm2(room);
    if (areaCm2 < 400) continue;
    const showName = opts.showNames !== false;
    const showArea = opts.showAreas !== false;

    ctx.save();
    if (showName) {
      ctx.font = `600 11px ${FONT}`;
      ctx.fillStyle = THEME.inkSoft;
      const name = room.name.toUpperCase();
      const letters = name.split('');
      const spacing = 0.9;
      let total = 0;
      for (const ch of letters) total += ctx.measureText(ch).width + spacing;
      let x = center.x - total / 2;
      const y = center.y - (showArea ? 7 : 0);
      for (const ch of letters) {
        const width = ctx.measureText(ch).width;
        ctx.fillText(ch, x + width / 2, y);
        x += width + spacing;
      }
    }
    if (showArea) {
      ctx.font = `500 10px ${FONT}`;
      ctx.fillStyle = THEME.inkFaint;
      ctx.fillText(fmtArea(areaCm2), center.x, center.y + (showName ? 8 : 0));
    }
    ctx.restore();
  }
}
