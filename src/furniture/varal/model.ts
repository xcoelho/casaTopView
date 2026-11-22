import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "varal";
export const modelHeight = 175;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, clothColors } = shared;
  /** Varal de parede: braços laterais, ripas e roupas penduradas. */
  function dryingRack(g: G, p: Palette): void {
    const { w, d, h, accent, metal } = p;
    const rails = 3;
    const step = (d - 14) / (rails - 1);
    const cloth = clothColors(accent);
  
    // Braços e chapas de fixação na parede.
    for (const sx of [-1, 1]) {
      boxAt(g, 3, d - 8, 3, sx * (w / 2 - 6), 0, h - 3, metal, 1, 0, 'metal');
      boxAt(g, 5, 3, 22, sx * (w / 2 - 6), -d / 2 + 2, h - 22, metal, 1, 0, 'metal');
    }
  
    for (let r = 0; r < rails; r++) {
      const z = -d / 2 + 7 + r * step;
      boxAt(g, w - 6, 1.8, 1.8, 0, z, h - 3 - r * 3, metal, 1, 0, 'metal');
      for (let i = 0; i < 2; i++) {
        const height = h * (0.34 + ((r + i) % 3) * 0.04);
        const x = (i ? 1 : -1) * w * 0.26;
        boxAt(g, w * 0.24, 2.2, height, x, z + (i ? 2 : -2), h - 6 - r * 3 - height, cloth[(r * 2 + i) % cloth.length], 1, i ? 0.08 : -0.06, 'fabric');
      }
    }
  }

  dryingRack(body, palette);
}
