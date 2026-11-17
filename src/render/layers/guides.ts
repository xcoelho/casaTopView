/** Overlays: guias de alinhamento, prévias de ferramentas e fantasmas. */
import { getDef } from '../../catalog/registry';
import { rr } from '../../catalog/draw';
import type { Wall } from '../../core/document';
import type { Store } from '../../core/store';
import type { Vec2 } from '../../core/geometry';
import { obbCorners } from '../../core/geometry';
import { fmtLength } from '../../core/units';
import { FONT, THEME } from '../theme';
import { createItem } from '../../catalog/registry';
import type { Camera } from '../viewport';
import { worldToScreen } from '../viewport';
import { paintItem } from './furniture';
import { wallFrame } from './walls';

export function drawPill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  options: { bg?: string; color?: string; size?: number } = {},
): void {
  const size = options.size ?? 10.5;
  ctx.save();
  ctx.font = `600 ${size}px ${FONT}`;
  const textWidth = ctx.measureText(label).width;
  const w = textWidth + 14;
  const h = size + 9;
  rr(ctx, Math.round(x - w / 2), Math.round(y - h / 2), w, h, 5);
  ctx.fillStyle = options.bg ?? THEME.measureBg;
  ctx.fill();
  ctx.fillStyle = options.color ?? '#f7f5f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x, y + 0.5);
  ctx.restore();
}

export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  store: Store,
  cam: Camera,
  dpr: number,
): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // guias de alinhamento
  if (store.guides.length) {
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = THEME.guide;
    ctx.lineWidth = 1;
    for (const guide of store.guides) {
      const a = worldToScreen(cam, guide.a);
      const b = worldToScreen(cam, guide.b);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.restore();
    for (const guide of store.guides) {
      if (!guide.label) continue;
      const mid = worldToScreen(cam, {
        x: (guide.a.x + guide.b.x) / 2,
        y: (guide.a.y + guide.b.y) / 2,
      });
      drawPill(ctx, mid.x, mid.y, guide.label, { bg: THEME.guide, size: 10 });
    }
  }

  const overlay = store.overlay;
  if (!overlay) return;

  if (overlay.type === 'marquee') {
    const a = worldToScreen(cam, { x: overlay.rect.x, y: overlay.rect.y });
    const b = worldToScreen(cam, {
      x: overlay.rect.x + overlay.rect.w,
      y: overlay.rect.y + overlay.rect.h,
    });
    ctx.save();
    ctx.fillStyle = 'rgba(15, 118, 110, 0.09)';
    ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = THEME.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(a.x + 0.5, a.y + 0.5, b.x - a.x, b.y - a.y);
    ctx.restore();
    return;
  }

  if (overlay.type === 'wall') {
    const a = worldToScreen(cam, overlay.a);
    const b = worldToScreen(cam, overlay.b);
    ctx.save();
    ctx.strokeStyle = overlay.valid ? 'rgba(15, 118, 110, 0.75)' : 'rgba(177, 56, 44, 0.75)';
    ctx.lineWidth = Math.max(6, 15 * cam.zoom);
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
    for (const p of [a, b]) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    if (overlay.length > 1) {
      drawPill(
        ctx,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2 - 18,
        `${fmtLength(overlay.length)} · ${Math.round(overlay.angle)}°`,
      );
    }
    return;
  }

  if (overlay.type === 'room') {
    const points = [...overlay.points];
    if (overlay.cursor) points.push(overlay.cursor);
    if (points.length >= 2) {
      ctx.save();
      ctx.beginPath();
      const first = worldToScreen(cam, points[0]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const p = worldToScreen(cam, points[i]);
        ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(15, 118, 110, 0.08)';
      ctx.fill();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      for (const point of overlay.points) {
        const p = worldToScreen(cam, point);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = THEME.accent;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    return;
  }

  if (overlay.type === 'measure') {
    const a = worldToScreen(cam, overlay.a);
    const b = worldToScreen(cam, overlay.b);
    const len = Math.hypot(overlay.b.x - overlay.a.x, overlay.b.y - overlay.a.y);
    ctx.save();
    ctx.strokeStyle = THEME.guide;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(a.x, a.y, 3, 0, Math.PI * 2);
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = THEME.guide;
    ctx.fill();
    ctx.restore();
    if (len > 1) {
      drawPill(ctx, (a.x + b.x) / 2, (a.y + b.y) / 2 - 16, fmtLength(len), {
        bg: THEME.guide,
      });
    }
    return;
  }

  if (overlay.type === 'ghost') {
    const def = getDef(overlay.defId);
    if (!def) return;
    const item = createItem(overlay.defId, overlay.x, overlay.y, {
      rot: overlay.rot,
      w: overlay.w,
      d: overlay.d,
    });
    if (!item) return;
    ctx.save();
    ctx.globalAlpha = 0.72;
    ctx.setTransform(dpr * cam.zoom, 0, 0, dpr * cam.zoom, dpr * cam.x, dpr * cam.y);
    paintItem(ctx, item, def, cam.zoom);
    ctx.restore();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const corners = obbCorners({ x: item.x, y: item.y }, item.w, item.d, item.rot).map((p) =>
      worldToScreen(cam, p),
    );
    ctx.save();
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = THEME.accent;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (overlay.type === 'wallTarget') {
    const wall = store.findWall(overlay.wallId);
    if (!wall) return;
    const frame = wallFrame(wall);
    const cos = Math.cos(frame.angle);
    const sin = Math.sin(frame.angle);
    const start = overlay.offset - overlay.width / 2;
    const points: Vec2[] = [
      { x: start, y: -wall.thickness / 2 },
      { x: start + overlay.width, y: -wall.thickness / 2 },
      { x: start + overlay.width, y: wall.thickness / 2 },
      { x: start, y: wall.thickness / 2 },
    ].map((p) => ({
      x: wall.a.x + p.x * cos - p.y * sin,
      y: wall.a.y + p.x * sin + p.y * cos,
    }));
    ctx.save();
    ctx.fillStyle = 'rgba(15, 118, 110, 0.3)';
    ctx.strokeStyle = THEME.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const first = worldToScreen(cam, points[0]);
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i++) {
      const p = worldToScreen(cam, points[i]);
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    const mid = worldToScreen(cam, {
      x: wall.a.x + cos * overlay.offset,
      y: wall.a.y + sin * overlay.offset,
    });
    drawPill(ctx, mid.x, mid.y - 20, fmtLength(overlay.width), { size: 10 });
    return;
  }
}

export function wallMidpoint(wall: Wall): Vec2 {
  return { x: (wall.a.x + wall.b.x) / 2, y: (wall.a.y + wall.b.y) / 2 };
}
