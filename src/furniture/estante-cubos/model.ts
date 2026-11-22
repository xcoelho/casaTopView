import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "estante-cubos";
export const modelHeight = 186;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, hash, shade } = shared;
  /** Estante de cubos para escritório, com nichos abertos. */
  function cubeShelf(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = 2.8;
    const rows = 3;
    const cols = 3;
    const innerW = w - 2 * t;
    const cellW = innerW / cols;
  
    boxAt(g, w - 2, 0.8, h, 0, -d / 2 + 0.4, 0, shade(main, -0.2), 1, 0, 'wood');
    for (const sx of [-1, 1]) {
      boxAt(g, t, d, h, sx * (w / 2 - t / 2), 0, 0, main, 1, 0, 'wood');
    }
    for (let i = 0; i <= rows; i++) {
      const y = (i * (h - 3)) / rows;
      const edge = i === 0 || i === rows;
      boxAt(g, w, d, edge ? 3 : 2.2, 0, 0, y, edge ? shade(main, i ? 0.05 : -0.08) : accent, 1, 0, 'wood');
    }
    for (let i = 1; i < cols; i++) {
      boxAt(g, 2, d, h, -w / 2 + t + cellW * i, 0, 0, accent, 1, 0, 'wood');
    }
  
    const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a'];
    let seed = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r + c) % 2 === 0) continue;
        const cx = -w / 2 + t + cellW * (c + 0.5);
        const baseY = (r * (h - 3)) / rows + 3.4;
        for (let b = 0; b < 4; b++) {
          const bw = 2.2 + hash(seed) * 1.2;
          const bh = 12 + hash(seed + 1) * 8;
          boxAt(g, bw, d * 0.5, bh, cx - 7 + b * 4.2, -d * 0.1, baseY, bookColors[seed % bookColors.length], 1, 0, 'matte');
          seed++;
        }
      }
    }
  }

  cubeShelf(body, palette);
}
