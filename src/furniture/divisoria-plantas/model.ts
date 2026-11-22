import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "divisoria-plantas";
export const modelHeight = 190;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, shade, sphereAt } = shared;
  /** Divisória vazada de metal com vasos e orquídeas. */
  function plantDivider(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const cols = 4;
    const cw = w / cols;
    for (const sx of [-1, 1]) {
      boxAt(g, 3, d, h, sx * (w / 2 - 1.5), 0, 0, main, 1, 0, 'metal');
    }
    boxAt(g, w, d, 3, 0, 0, 0, main, 1, 0, 'metal');
    boxAt(g, w, d, 3, 0, 0, h - 3, main, 1, 0, 'metal');
    for (let i = 1; i < cols; i++) {
      boxAt(g, 2.4, d, h, -w / 2 + cw * i, 0, 0, main, 1, 0, 'metal');
    }
    const rows = 3;
    for (let r = 0; r < rows; r++) {
      const y = 24 + (r * (h - 60)) / Math.max(rows - 1, 1);
      for (let c = 0; c < cols; c++) {
        if ((r + c) % 2 === 0) continue;
        const x = -w / 2 + cw * (c + 0.5);
        boxAt(g, cw - 10, d - 6, 2.4, x, 0, y, main, 1, 0, 'metal');
        cylinderAt(g, 5.5, 10, x, 0, y + 2.4, '#8a6142', 1, 'ceramic');
        sphereAt(g, 5, x, y + 16, 0, accent, [1, 0.75, 1], 'foliage');
        sphereAt(g, 3.4, x + 4, y + 19, 2, '#f1efe8', [1, 0.9, 1], 'foliage');
        sphereAt(g, 3, x - 4, y + 18, -2, shade(accent, 0.14), [1, 0.85, 1], 'foliage');
      }
    }
  }

  plantDivider(body, palette);
}
