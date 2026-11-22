import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cadeira-executiva";
export const modelHeight = 128;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, boxAt, cylinderAt, roundedBoxAt, shade, sphereAt } = shared;
  /** Cadeira executiva alta com apoio de pés e base de 5 rodízios. */
  function executiveChair(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    const r = Math.min(w, d) / 2 - 4;
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      boxAt(g, r, 3.4, 2.6, (Math.cos(ang) * r) / 2, (Math.sin(ang) * r) / 2, 5, accent, 1, -ang, 'metal');
      sphereAt(g, 2.6, Math.cos(ang) * r, 3, Math.sin(ang) * r, DARK_METAL, [1, 1, 1], 'metal');
    }
    cylinderAt(g, 4.2, 30, 0, 0, 5, CHROME, 1, 'chrome');
    roundedBoxAt(g, w - 10, d - 14, 10, 0, 0, 34, main, 3.5, 'fabric');
    roundedBoxAt(g, w - 14, 8, 52, 0, -d * 0.36, 44, main, 3.5, 'fabric', 1, 0, -0.1);
    roundedBoxAt(g, w - 22, 6, 14, 0, -d * 0.32, 56, shade(main, 0.08), 2.5, 'fabric');
    for (const sx of [-1, 1]) {
      boxAt(g, 3.2, 9, 14, sx * (w / 2 - 4), -d * 0.08, 30, accent, 1, 0, 'metal');
      roundedBoxAt(g, 5.5, 20, 3.5, sx * (w / 2 - 4), -d * 0.06, 44, accent, 1.5, 'metal');
    }
    boxAt(g, w - 24, 4, 3, 0, d * 0.3, 22, accent, 1, 0, 'metal');
    roundedBoxAt(g, w - 24, 12, 4, 0, d * 0.36, 25, shade(main, -0.05), 1.6, 'fabric');
  }

  executiveChair(body, palette);
}
