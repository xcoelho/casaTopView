import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "nicho-quarto";
export const modelHeight = 76;
export const modelBase = 92;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { PORCELAIN, boxAt, cylinderAt, hash, shade, sphereAt } = shared;
  /** Nicho de parede para quarto: fundo fechado, três módulos e objetos. */
  function wallNiche(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = 2.6;
    const shelfY = h * 0.52;
  
    boxAt(g, w - 1, 1.4, h, 0, -d / 2 + 0.7, 0, shade(main, -0.16), 1, 0, 'paint');
    for (const sx of [-1, 1]) {
      boxAt(g, t, d, h, sx * (w / 2 - t / 2), 0, 0, main, 1, 0, 'paint');
      boxAt(g, 2, d - 2, h - 2 * t, sx * (w / 6), 0, t, accent, 1, 0, 'wood');
    }
    boxAt(g, w, d, t, 0, 0, 0, shade(main, -0.06), 1, 0, 'paint');
    boxAt(g, w, d, t, 0, 0, h - t, shade(main, 0.04), 1, 0, 'paint');
    boxAt(g, w - 2 * t, d - 2, 2.2, 0, 0, shelfY, accent, 1, 0, 'wood');
  
    const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469'];
    for (let i = 0; i < 4; i++) {
      const bw = 2.4 + hash(i) * 1.3;
      const bh = 14 + hash(i + 5) * 9;
      boxAt(g, bw, d * 0.5, bh, -w / 3 - 14 + i * 5, -d * 0.1, t, bookColors[i], 1, 0, 'matte');
    }
    boxAt(g, 15, d - 9, 12, 0, 0, t, shade(accent, -0.28), 1, 0, 'matte');
    cylinderAt(g, 3.4, 15, w / 3 + 4, 0, t, PORCELAIN, 1, 'ceramic');
    sphereAt(g, 3.6, w / 3 + 4, t + 18, 0, '#7d8a63', [1, 0.82, 1], 'foliage');
  }

  wallNiche(body, palette);
}
