/** Seleção, hover e alças de redimensionamento/rotação. */
import type { Item, Opening, Wall } from '../../core/document';
import type { Store } from '../../core/store';
import type { Vec2 } from '../../core/geometry';
import { obbCorners, rectFromPoints } from '../../core/geometry';
import type { Camera } from '../viewport';
import { worldToScreen } from '../viewport';
import { THEME } from '../theme';
import { wallFrame } from './walls';

export const HANDLE_SIZE = 9;
export const HANDLE_HIT = 11;
export const WALL_HANDLE_HIT = 12;
export const WALL_HANDLE_RADIUS = 5.5;

export type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rotate';

export interface Handle {
  id: HandleId;
  pos: Vec2;
}

export interface WallHandle {
  end: 'a' | 'b';
  pos: Vec2;
}

/** Alças nas extremidades de uma parede (arraste para mudar o comprimento). */
export function getWallHandles(wall: Wall, cam: Camera): WallHandle[] {
  return [
    { end: 'a', pos: worldToScreen(cam, wall.a) },
    { end: 'b', pos: worldToScreen(cam, wall.b) },
  ];
}

export function getItemHandles(item: Item, cam: Camera): Handle[] {
  const rad = (item.rot * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const hw = item.w / 2;
  const hd = item.d / 2;
  const local: [HandleId, number, number][] = [
    ['nw', -hw, -hd],
    ['n', 0, -hd],
    ['ne', hw, -hd],
    ['e', hw, 0],
    ['se', hw, hd],
    ['s', 0, hd],
    ['sw', -hw, hd],
    ['w', -hw, 0],
  ];
  const handles: Handle[] = local.map(([id, lx, ly]) => ({
    id,
    pos: worldToScreen(cam, {
      x: item.x + lx * cos - ly * sin,
      y: item.y + lx * sin + ly * cos,
    }),
  }));
  const offset = 28 / cam.zoom;
  handles.push({
    id: 'rotate',
    pos: worldToScreen(cam, {
      x: item.x + hd + offset * sin,
      y: item.y - (hd + offset) * cos,
    }),
  });
  return handles;
}

export function openingCorners(opening: Opening, wall: Wall): Vec2[] {
  const frame = wallFrame(wall);
  const cos = Math.cos(frame.angle);
  const sin = Math.sin(frame.angle);
  const start = opening.offset - opening.width / 2;
  const half = wall.thickness / 2;
  return [
    { x: start, y: -half },
    { x: start + opening.width, y: -half },
    { x: start + opening.width, y: half },
    { x: start, y: half },
  ].map((p) => ({
    x: wall.a.x + p.x * cos - p.y * sin,
    y: wall.a.y + p.x * sin + p.y * cos,
  }));
}

function strokePolygon(
  ctx: CanvasRenderingContext2D,
  points: Vec2[],
  cam: Camera,
  color: string,
  width: number,
  dash: number[] = [],
): void {
  if (!points.length) return;
  ctx.save();
  ctx.setLineDash(dash);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  const first = worldToScreen(cam, points[0]);
  ctx.moveTo(first.x, first.y);
  for (let i = 1; i < points.length; i++) {
    const p = worldToScreen(cam, points[i]);
    ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function drawHandleSquare(
  ctx: CanvasRenderingContext2D,
  pos: Vec2,
  filled = true,
): void {
  const half = HANDLE_SIZE / 2;
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(pos.x - half, pos.y - half, HANDLE_SIZE, HANDLE_SIZE, 2.5);
  } else {
    ctx.rect(pos.x - half, pos.y - half, HANDLE_SIZE, HANDLE_SIZE);
  }
  ctx.fillStyle = filled ? THEME.handle : 'rgba(255,255,255,0.7)';
  ctx.fill();
  ctx.strokeStyle = THEME.accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

export function drawSelection(
  ctx: CanvasRenderingContext2D,
  store: Store,
  cam: Camera,
  dpr: number,
): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const selected = new Set(store.selection);

  // hover
  if (store.hover && !selected.has(store.hover)) {
    const item = store.findItem(store.hover);
    if (item) {
      strokePolygon(ctx, obbCorners({ x: item.x, y: item.y }, item.w, item.d, item.rot), cam, 'rgba(15, 118, 110, 0.45)', 1.5);
    }
    const wall = store.findWall(store.hover);
    if (wall) {
      strokePolygon(
        ctx,
        [
          wall.a,
          wall.b,
        ],
        cam,
        'rgba(15, 118, 110, 0.4)',
        6,
      );
    }
    const room = store.findRoom(store.hover);
    if (room) {
      strokePolygon(ctx, room.points, cam, 'rgba(15, 118, 110, 0.35)', 1.5, [4, 4]);
    }
    const opening = store.findOpening(store.hover);
    if (opening) {
      const wall = store.findWall(opening.wallId);
      if (wall) strokePolygon(ctx, openingCorners(opening, wall), cam, 'rgba(15, 118, 110, 0.55)', 1.5);
    }
  }

  const items = store.selectedItems();
  const single = items.length === 1 && store.selection.length === 1 ? items[0] : null;

  for (const item of items) {
    strokePolygon(
      ctx,
      obbCorners({ x: item.x, y: item.y }, item.w, item.d, item.rot),
      cam,
      THEME.accent,
      single ? 1.6 : 1.3,
    );
  }

  if (single) {
    const handles = getItemHandles(single, cam);
    const top = handles.find((h) => h.id === 'rotate');
    const north = handles.find((h) => h.id === 'n');
    if (top && north && !single.locked) {
      ctx.save();
      ctx.strokeStyle = 'rgba(15, 118, 110, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(north.pos.x, north.pos.y);
      ctx.lineTo(top.pos.x, top.pos.y);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(top.pos.x, top.pos.y, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    }
    if (!single.locked) {
      for (const handle of handles) {
        if (handle.id === 'rotate') continue;
        drawHandleSquare(ctx, handle.pos);
      }
    }
  } else if (items.length > 1) {
    const bounds = store.selectionBounds();
    if (bounds) {
      const a = worldToScreen(cam, { x: bounds.x, y: bounds.y });
      const b = worldToScreen(cam, { x: bounds.x + bounds.w, y: bounds.y + bounds.h });
      const rect = rectFromPoints(a, b);
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'rgba(15, 118, 110, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      ctx.restore();
    }
  }

  for (const wall of store.selectedWalls()) {
    const a = worldToScreen(cam, wall.a);
    const b = worldToScreen(cam, wall.b);
    ctx.save();
    ctx.strokeStyle = THEME.accent;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    for (const handle of getWallHandles(wall, cam)) {
      const p = handle.pos;
      ctx.beginPath();
      ctx.arc(p.x, p.y, WALL_HANDLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const room of store.selectedRooms()) {
    strokePolygon(ctx, room.points, cam, THEME.accent, 1.6, [6, 4]);
    for (const point of room.points) {
      const p = worldToScreen(cam, point);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = THEME.accent;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  for (const opening of store.selectedOpenings()) {
    const wall = store.findWall(opening.wallId);
    if (!wall) continue;
    strokePolygon(ctx, openingCorners(opening, wall), cam, THEME.accent, 2);
    const frame = wallFrame(wall);
    const mid = {
      x: wall.a.x + Math.cos(frame.angle) * opening.offset,
      y: wall.a.y + Math.sin(frame.angle) * opening.offset,
    };
    const p = worldToScreen(cam, mid);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = THEME.accent;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
}
