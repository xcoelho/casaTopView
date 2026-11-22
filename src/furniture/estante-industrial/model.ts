import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "estante-industrial";
export const modelHeight = 200;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, PORCELAIN, bar, boxAt, cylinderAt, hash, latheAt, shade, sphereAt } = shared;
  /** Estante industrial: montantes metálicos, X no fundo e prateleiras de madeira. */
  function industrialShelf(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const post = 3.4;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        boxAt(g, post, post, h, sx * (w / 2 - post / 2), sz * (d / 2 - post / 2), 0, accent, 1, 0, 'metal');
        boxAt(g, post + 3, post + 3, 1.6, sx * (w / 2 - post / 2), sz * (d / 2 - post / 2), 0, DARK_METAL, 1, 0, 'metal');
      }
    }
    bar(g, [-w / 2 + 3, 5, -d / 2 + 2], [w / 2 - 3, h - 5, -d / 2 + 2], 1.2, accent, 'metal');
    bar(g, [w / 2 - 3, 5, -d / 2 + 2], [-w / 2 + 3, h - 5, -d / 2 + 2], 1.2, accent, 'metal');
  
    const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a'];
    const rows = 5;
    for (let i = 0; i < rows; i++) {
      const y = 6 + (i * (h - 18)) / (rows - 1);
      boxAt(g, w - 4, d - 2, 3.2, 0, 0, y, main, 1, 0, 'wood');
      boxAt(g, w - 4, 1.4, 1.4, 0, d / 2 - 1, y + 3.2, shade(main, -0.18), 1, 0, 'wood');
      const top = y + 3.2;
      if (i % 3 === 0) {
        for (let b = 0; b < 6; b++) {
          const bh = 16 + hash(i * 9 + b) * 10;
          boxAt(g, 3.4, d * 0.6, bh, -w / 2 + 12 + b * 4.6, -d * 0.06, top, bookColors[(i + b) % bookColors.length], 1, 0, 'matte');
        }
        boxAt(g, 26, d * 0.62, 18, w * 0.26, 0, top, shade(main, -0.12), 1, 0, 'wood');
      } else if (i % 3 === 1) {
        boxAt(g, w * 0.3, d * 0.66, 20, -w * 0.24, 0, top, '#d9d2c4', 1, 0, 'fabric');
        boxAt(g, w * 0.3, d * 0.66, 1.6, -w * 0.24, 0, top + 20, shade(accent, -0.1), 1, 0, 'metal');
        cylinderAt(g, 5, 12, w * 0.22, 0, top, '#8a6142', 1, 'ceramic');
        sphereAt(g, 7, w * 0.22, top + 20, 0, '#7d8a63', [1, 0.85, 1], 'foliage');
      } else {
        for (let b = 0; b < 4; b++) {
          boxAt(g, 3, d * 0.55, 20, w * 0.1 + b * 4, 0, top, bookColors[(i + b) % bookColors.length], 1, 0, 'matte');
        }
        latheAt(g, [[0, 0], [6, 0], [7.5, 6], [6, 14], [4, 17], [0, 17]], -w * 0.26, 0, top, PORCELAIN, 'ceramic', 24);
      }
    }
  }

  industrialShelf(body, palette);
}
