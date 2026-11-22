import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cadeira-jantar";
export const modelHeight = 92;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, coneAt, roundedBoxAt } = shared;
  function chair(g: G, p: Palette): void {
    const { w, d, h, main, accent, dark } = p;
    const a = w / 2;
    const b = d / 2;
    const seatY = 45;
  
    for (const sx of [-1, 1]) {
      coneAt(g, 2.0, 2.5, h - 6, sx * (a - 3.5), -b + 4, 0, main, 1, 'wood', 10);
      coneAt(g, 1.6, 2.1, seatY - 4, sx * (a - 3.5), b - 4, 0, main, 1, 'wood', 10);
    }
  
    roundedBoxAt(g, w - 2, d - 4, 5, 0, 1, seatY - 5, main, 1.4, 'wood');
    roundedBoxAt(g, w - 10, d - 12, 4, 0, 1, seatY, accent, 1.8, 'fabric');
    boxAt(g, w - 14, 3, 5, 0, -b + 8, seatY - 10, dark, 1, 0, 'wood');
  
    for (const sx of [-1, 1]) {
      boxAt(g, 3.4, 4, h - seatY - 2, sx * (a - 3.5), -b + 4, seatY - 2, main, 1, 0, 'wood');
    }
    roundedBoxAt(g, w - 8, 3.6, 10, 0, -b + 4.4, h - 16, main, 1.2, 'wood');
    for (let i = 0; i < 3; i++) {
      const x = -a + 11 + ((w - 22) * i) / 2;
      boxAt(g, 2.2, 2.2, h - seatY - 21, x, -b + 4, seatY + 6, main, 1, 0, 'wood');
    }
  }

  chair(body, palette);
}
