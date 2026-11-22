import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "ilha-closet";
export const modelHeight = 92;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt, shade } = shared;
  function closetIsland(g: G, p: Palette): void {
    const { w, d, h, main, accent, metal } = p;
    const plinth = 7;
  
    boxAt(g, w - 12, d - 14, plinth, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');
    roundedBoxAt(g, w, d, h - plinth - 5, 0, 0, plinth, main, 1.4, 'paint');
  
    // Gavetas nas duas faces longitudinais.
    const dw = (w - 10) / 3;
    for (let i = 0; i < 3; i++) {
      const x = -w / 2 + 5 + dw / 2 + i * dw;
      for (const sz of [-1, 1]) {
        roundedBoxAt(g, dw - 3, 2.4, (h - plinth) * 0.6, x, sz * (d / 2 - 1), plinth + 4, shade(main, sz < 0 ? 0.02 : -0.02), 1, 'paint');
        boxAt(g, Math.min(dw * 0.42, 24), 2.6, 2, x, sz * (d / 2 + 0.4), plinth + (h - plinth) * 0.32, metal, 1, 0, 'metal');
      }
    }
  
    // Tampo de pedra com bandeja de vidro para acessórios.
    roundedBoxAt(g, w + 6, d + 6, 5, 0, 0, h - 5, accent, 1.4, 'stone');
    boxAt(g, w * 0.32, d * 0.44, 1.4, 0, 0, h + 0.4, '#dfeef2', 0.45, 0, 'glass');
  }

  closetIsland(body, palette);
}
