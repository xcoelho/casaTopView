import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "jardineira";
export const modelHeight = 55;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, shade, sphereAt } = shared;
  function planterBox(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = 4;
    const bodyH = h - 6;
  
    boxAt(g, w, t, bodyH, 0, -d / 2 + t / 2, 0, main, 1, 0, 'stone');
    boxAt(g, w, t, bodyH, 0, d / 2 - t / 2, 0, main, 1, 0, 'stone');
    boxAt(g, t, d - t * 2, bodyH, -w / 2 + t / 2, 0, 0, main, 1, 0, 'stone');
    boxAt(g, t, d - t * 2, bodyH, w / 2 - t / 2, 0, 0, main, 1, 0, 'stone');
    boxAt(g, w - t * 2, d - t * 2, 2, 0, 0, bodyH - 4, '#3d3128', 1, 0, 'matte');
  
    const count = Math.max(3, Math.round(w / 34));
    for (let i = 0; i < count; i++) {
      const x = -w / 2 + 18 + ((w - 36) * i) / Math.max(count - 1, 1);
      const r = 6 + (i % 3) * 2;
      cylinderAt(g, 1, 12, x, 0, bodyH - 8, shade(accent, -0.42), 1, 'matte');
      sphereAt(g, r, x, bodyH + 2, 0, accent, [1, 0.82, 1], 'matte');
      sphereAt(g, r * 0.72, x + r * 0.7, bodyH + 8, r * 0.4, shade(accent, 0.12), [1, 0.85, 1], 'matte');
      sphereAt(g, r * 0.6, x - r * 0.6, bodyH + 7, -r * 0.35, shade(accent, -0.1), [1, 0.9, 1], 'matte');
    }
  }

  planterBox(body, palette);
}
