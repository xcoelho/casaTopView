/** Geometria 2D do editor: vetores, retângulos, OBB, polígonos e interseções. */

export interface Vec2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const DEG = Math.PI / 180;

export function vec(x = 0, y = 0): Vec2 {
  return { x, y };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function mul(a: Vec2, k: number): Vec2 {
  return { x: a.x * k, y: a.y * k };
}

export function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function lengthOf(a: Vec2): number {
  return Math.hypot(a.x, a.y);
}

export function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function rotateVec(p: Vec2, degrees: number): Vec2 {
  if (!degrees) return { x: p.x, y: p.y };
  const rad = degrees * DEG;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}

export function angleDeg(from: Vec2, to: Vec2): number {
  return Math.atan2(to.y - from.y, to.x - from.x) / DEG;
}

export function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a < 0) a += 360;
  return a;
}

export function snapAngle(deg: number, step = 15): number {
  return Math.round(deg / step) * step;
}

export function snapValue(value: number, step: number): number {
  if (!step) return value;
  return Math.round(value / step) * step;
}

export function rectFromPoints(a: Vec2, b: Vec2): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  };
}

export function rectContains(rect: Rect, p: Vec2): boolean {
  return p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
}

export function rectContainsRect(outer: Rect, inner: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.w <= outer.x + outer.w &&
    inner.y + inner.h <= outer.y + outer.h
  );
}

export function inflate(rect: Rect, amount: number): Rect {
  return { x: rect.x - amount, y: rect.y - amount, w: rect.w + amount * 2, h: rect.h + amount * 2 };
}

export interface SegmentHit {
  point: Vec2;
  t: number;
  dist: number;
}

export function closestPointOnSegment(p: Vec2, a: Vec2, b: Vec2): SegmentHit {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lenSq = abx * abx + aby * aby;
  let t = lenSq > 0 ? ((p.x - a.x) * abx + (p.y - a.y) * aby) / lenSq : 0;
  t = clamp01(t);
  const point = { x: a.x + abx * t, y: a.y + aby * t };
  return { point, t, dist: dist(p, point) };
}

export function distToSegment(p: Vec2, a: Vec2, b: Vec2): number {
  return closestPointOnSegment(p, a, b).dist;
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/** Cantos de uma caixa orientada (centro + largura/profundidade + rotação em graus). */
export function obbCorners(center: Vec2, width: number, depth: number, rotation: number): Vec2[] {
  const hw = width / 2;
  const hd = depth / 2;
  const local: Vec2[] = [
    { x: -hw, y: -hd },
    { x: hw, y: -hd },
    { x: hw, y: hd },
    { x: -hw, y: hd },
  ];
  return local.map((p) => add(center, rotateVec(p, rotation)));
}

export function pointInObb(
  p: Vec2,
  center: Vec2,
  width: number,
  depth: number,
  rotation: number,
): boolean {
  const local = rotateVec(sub(p, center), -rotation);
  return Math.abs(local.x) <= width / 2 && Math.abs(local.y) <= depth / 2;
}

export function boundsOfPoints(points: Vec2[]): Rect {
  if (!points.length) return { x: 0, y: 0, w: 0, h: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export function unionRect(a: Rect | null, b: Rect): Rect {
  if (!a) return { ...b };
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const maxX = Math.max(a.x + a.w, b.x + b.w);
  const maxY = Math.max(a.y + a.h, b.y + b.h);
  return { x, y, w: maxX - x, h: maxY - y };
}

export function rectCenter(rect: Rect): Vec2 {
  return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}

export function polygonArea(points: Vec2[]): number {
  if (points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

export function polygonCentroid(points: Vec2[]): Vec2 {
  if (!points.length) return { x: 0, y: 0 };
  if (points.length < 3) return boundsOfPoints(points) && rectCenter(boundsOfPoints(points));
  let cx = 0;
  let cy = 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const cross = a.x * b.y - b.x * a.y;
    area += cross;
    cx += (a.x + b.x) * cross;
    cy += (a.y + b.y) * cross;
  }
  if (Math.abs(area) < 1e-6) return rectCenter(boundsOfPoints(points));
  return { x: cx / (3 * area), y: cy / (3 * area) };
}

export function pointInPolygon(p: Vec2, points: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i];
    const b = points[j];
    const intersects =
      a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y || 1e-9) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}
