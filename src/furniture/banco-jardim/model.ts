import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "banco-jardim";
export const modelHeight = 85;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt } = shared;
  function gardenBench(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const seatY = 42;
  
    for (const sx of [-1, 1]) {
      const x = sx * (w / 2 - 6);
      boxAt(g, 4, 4, seatY, x, d * 0.28, 0, accent, 1, 0, 'metal');
      boxAt(g, 4, 4, h, x, -d * 0.32, 0, accent, 1, 0, 'metal');
      boxAt(g, 4, d * 0.62, 4, x, -d * 0.02, seatY - 4, accent, 1, 0, 'metal');
      boxAt(g, 4, d * 0.4, 4, x, -d * 0.12, h - 6, accent, 1, 0, 'metal');
    }
  
    for (let i = 0; i < 4; i++) {
      boxAt(g, w - 10, d * 0.12, 3, 0, d * 0.06 + i * d * 0.14, seatY, main, 1, 0, 'wood');
    }
    for (let i = 0; i < 3; i++) {
      boxAt(g, w - 10, 3, d * 0.1, 0, -d * 0.3, seatY + 14 + i * 11, main, 1, 0, 'wood');
    }
  }

  gardenBench(body, palette);
}
