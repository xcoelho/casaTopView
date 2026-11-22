import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "berco";
export const modelHeight = 88;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt } = shared;
  function crib(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    const railH = 80;
  
    roundedBoxAt(g, w, d, 10, 0, 0, 0, main, 2, 'wood');
    roundedBoxAt(g, w - 10, d - 10, 12, 0, 0, 30, accent, 3, 'fabric');
  
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        roundedBoxAt(g, 5, 5, railH + 6, sx * (w / 2 - 3), sz * (d / 2 - 3), 0, main, 1.4, 'wood');
      }
    }
  
    const rails = Math.max(5, Math.round(w / 11));
    for (let i = 0; i < rails; i++) {
      const x = -w / 2 + 7 + ((w - 14) * i) / (rails - 1);
      boxAt(g, 2.4, 3, railH - 10, x, -d / 2 + 3, 8, main, 1, 0, 'wood');
      boxAt(g, 2.4, 3, railH - 10, x, d / 2 - 3, 8, main, 1, 0, 'wood');
    }
    const sideRails = Math.max(4, Math.round(d / 16));
    for (let i = 0; i < sideRails; i++) {
      const z = -d / 2 + 9 + ((d - 18) * i) / (sideRails - 1);
      boxAt(g, 3, 2.4, railH - 10, -w / 2 + 3, z, 8, main, 1, 0, 'wood');
      boxAt(g, 3, 2.4, railH - 10, w / 2 - 3, z, 8, main, 1, 0, 'wood');
    }
  
    boxAt(g, w - 4, 3.4, 4, 0, -d / 2 + 3, railH + 2, main, 1, 0, 'wood');
    boxAt(g, w - 4, 3.4, 4, 0, d / 2 - 3, railH + 2, main, 1, 0, 'wood');
    boxAt(g, 3.4, d - 4, 4, -w / 2 + 3, 0, railH + 2, main, 1, 0, 'wood');
    boxAt(g, 3.4, d - 4, 4, w / 2 - 3, 0, railH + 2, main, 1, 0, 'wood');
  }

  crib(body, palette);
}
