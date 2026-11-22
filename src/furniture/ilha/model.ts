import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "ilha";
export const modelHeight = 92;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt, shade } = shared;
  function island(g: G, p: Palette): void {
    const { w, d, h, main, accent, metal } = p;
    const plinth = 7;
  
    boxAt(g, w - 16, d - 16, plinth, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');
    roundedBoxAt(g, w, d, h - plinth - 4, 0, 0, plinth, main, 1.2, 'paint');
  
    const doors = Math.max(2, Math.round(w / 70));
    const dw = (w - 6 - (doors - 1) * 2) / doors;
    for (let i = 0; i < doors; i++) {
      const x = -w / 2 + 3 + dw / 2 + i * (dw + 2);
      roundedBoxAt(g, dw, 2, h - plinth - 14, x, d / 2 + 1, plinth + 4, shade(main, i % 2 ? -0.04 : 0), 1, 'paint');
      boxAt(g, 18, 2.6, 2, x, d / 2 + 2.4, h - plinth - 14, metal, 1, 0, 'metal');
    }
  
    roundedBoxAt(g, w + 14, d + 10, 4, 0, 0, h - 4, accent, 1, 'stone');
    boxAt(g, w + 14, 1.6, 5, 0, -d / 2 - 3.8, h - 4, accent, 1, 0, 'stone');
    boxAt(g, w + 14, 1.6, 5, 0, d / 2 + 3.8, h - 4, accent, 1, 0, 'stone');
  }

  island(body, palette);
}
