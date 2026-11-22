import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "prateleira-quarto";
export const modelHeight = 18;
export const modelBase = 138;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { PORCELAIN, boxAt, cylinderAt, hash, sphereAt } = shared;
  /** Prateleira suspensa para quarto, com mãos-francesas e livros. */
  function wallShelf(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = 3.2;
  
    boxAt(g, w, d, t, 0, 0, h - t, main, 1, 0, 'wood');
    for (const sx of [-1, 1]) {
      const x = sx * (w / 2 - 10);
      boxAt(g, 2.2, 2.2, h - t, x, -d / 2 + 2.2, 0, accent, 1, 0, 'metal');
      boxAt(g, 2.2, d * 0.7, 2.2, x, -d / 2 + 2.2 + d * 0.35, h - t, accent, 1, 0, 'metal');
    }
  
    const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a'];
    for (let i = 0; i < 5; i++) {
      const bw = 2.4 + hash(i + 11) * 1.2;
      const bh = 14 + hash(i + 17) * 8;
      boxAt(g, bw, d * 0.55, bh, -w * 0.24 + i * 4.6, -d * 0.08, h, bookColors[i], 1, 0, 'matte');
    }
    cylinderAt(g, 3.2, 12, w * 0.3, 0, h, PORCELAIN, 1, 'ceramic');
    sphereAt(g, 3.4, w * 0.3, h + 14, 0, '#7d8a63', [1, 0.8, 1], 'foliage');
  }

  wallShelf(body, palette);
}
