import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "banqueta-industrial";
export const modelHeight = 92;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, bar, boxAt, roundedBoxAt, shade, sphereAt } = shared;
  /** Banqueta industrial: assento estampado, pernas abertas e travessas tubulares. */
  function industrialStool(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const seatY = h * 0.72;
    const footX = w / 2 - 2;
    const footZ = d / 2 - 2;
    const topX = w / 2 - 9;
    const topZ = d / 2 - 9;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        bar(g, [sx * footX, 0, sz * footZ], [sx * topX, seatY, sz * topZ], 1.7, accent, 'metal');
        sphereAt(g, 1.9, sx * footX, 1.2, sz * footZ, DARK_METAL, [1, 0.6, 1], 'metal');
      }
    }
    const braceY = h * 0.3;
    const t = braceY / seatY;
    const bx = footX + (topX - footX) * t;
    const bz = footZ + (topZ - footZ) * t;
    for (const sz of [-1, 1]) bar(g, [-bx, braceY, sz * bz], [bx, braceY, sz * bz], 1.3, accent, 'metal');
    for (const sx of [-1, 1]) bar(g, [sx * bx, braceY, -bz], [sx * bx, braceY, bz], 1.3, accent, 'metal');
  
    roundedBoxAt(g, w - 12, d - 12, 3.4, 0, 0, seatY, main, 1.4, 'metal');
    boxAt(g, w - 18, d - 18, 1, 0, 0, seatY + 3.4, shade(main, 0.08), 1, 0, 'metal');
    for (const sx of [-1, 1]) {
      boxAt(g, 2, d - 14, 3, sx * (w / 2 - 7), 0, seatY - 2, shade(main, -0.12), 1, 0, 'metal');
      bar(g, [sx * topX, seatY, -topZ], [sx * (topX - 2), h - 6, -topZ + 3], 1.6, accent, 'metal');
    }
    roundedBoxAt(g, w - 16, 3, 14, 0, -topZ + 3, h - 16, main, 1.4, 'metal');
  }

  industrialStool(body, palette);
}
