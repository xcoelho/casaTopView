/** Câmera do editor: transforma centímetros de mundo em pixels de tela. */
import type { Rect, Vec2 } from '../core/geometry';
import { clamp } from '../core/units';

export interface Camera {
  x: number;
  y: number;
  /** pixels por centímetro */
  zoom: number;
}

export const MIN_ZOOM = 0.06;
export const MAX_ZOOM = 4;

export function worldToScreen(cam: Camera, p: Vec2): Vec2 {
  return { x: p.x * cam.zoom + cam.x, y: p.y * cam.zoom + cam.y };
}

export function screenToWorld(cam: Camera, p: Vec2): Vec2 {
  return { x: (p.x - cam.x) / cam.zoom, y: (p.y - cam.y) / cam.zoom };
}

export function zoomAt(cam: Camera, screenPoint: Vec2, factor: number): Camera {
  const nextZoom = clamp(cam.zoom * factor, MIN_ZOOM, MAX_ZOOM);
  if (nextZoom === cam.zoom) return cam;
  const world = screenToWorld(cam, screenPoint);
  return {
    zoom: nextZoom,
    x: screenPoint.x - world.x * nextZoom,
    y: screenPoint.y - world.y * nextZoom,
  };
}

export function panBy(cam: Camera, dx: number, dy: number): Camera {
  return { ...cam, x: cam.x + dx, y: cam.y + dy };
}

export function fitCamera(
  bounds: Rect,
  width: number,
  height: number,
  padding = 80,
): Camera {
  const zoom = clamp(
    Math.min(
      (width - padding * 2) / Math.max(bounds.w, 60),
      (height - padding * 2) / Math.max(bounds.h, 60),
    ),
    MIN_ZOOM,
    MAX_ZOOM,
  );
  return {
    zoom,
    x: (width - bounds.w * zoom) / 2 - bounds.x * zoom,
    y: (height - bounds.h * zoom) / 2 - bounds.y * zoom,
  };
}
