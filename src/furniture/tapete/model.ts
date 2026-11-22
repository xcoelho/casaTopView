import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "tapete";
export const modelHeight = 2;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt, shade } = shared;
  function rug(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
  
    roundedBoxAt(g, w, d, 1.6, 0, 0, 0, main, 1.6, 'fabric');
    roundedBoxAt(g, w - 18, d - 18, 0.9, 0, 0, 1.6, accent, 1.2, 'fabric');
    roundedBoxAt(g, w - 34, d - 34, 0.5, 0, 0, 2.4, shade(main, 0.06), 1, 'fabric');
  
    const fringes = Math.max(10, Math.round(w / 14));
    for (const sz of [-1, 1]) {
      for (let i = 0; i < fringes; i++) {
        const x = -w / 2 + 8 + (i * (w - 16)) / (fringes - 1);
        boxAt(g, 1.2, 3.4, 0.9, x, sz * (d / 2 + 2.2), 0, shade(main, -0.2), 1, 0, 'fabric');
      }
    }
  }

  rug(body, palette);
}
