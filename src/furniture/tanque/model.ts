import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "tanque";
export const modelHeight = 90;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { basin, boxAt, faucet, roundedBoxAt, shade, slabWithHole } = shared;
  function laundrySink(g: G, p: Palette): void {
    const { w, d, h, main, accent, metal } = p;
    const plinth = 8;
    const tubW = w - 24;
    const tubD = d - 28;
  
    boxAt(g, w - 8, d - 10, plinth, 0, 0, 0, shade(main, -0.38), 1, 0, 'paint');
    roundedBoxAt(g, w, d, h - plinth - 4, 0, 0, plinth, main, 1.4, 'paint');
  
    // Duas portas com puxadores verticais.
    const dw = (w - 8) / 2;
    for (let i = 0; i < 2; i++) {
      const x = -w / 2 + 4 + dw / 2 + i * dw;
      roundedBoxAt(g, dw - 3, 2.2, h - plinth - 14, x, d / 2 - 1, plinth + 4, shade(main, i ? -0.02 : 0.02), 1, 'paint');
      boxAt(g, 2, 2.4, 10, x, d / 2 + 0.4, plinth + (h - plinth) * 0.5, metal, 1, 0, 'metal');
    }
  
    // Bancada de pedra com cuba rebaixada, espelho e torneira.
    slabWithHole(g, w + 2, d + 2, 4, h - 4, accent, { x: 0, z: -4, w: tubW, d: tubD }, 'stone');
    basin(g, tubW, tubD, 18, h - 4, accent);
    boxAt(g, w + 2, 4, 12, 0, -d / 2, h, shade(accent, -0.06), 1, 0, 'stone');
    faucet(g, 0, -d / 2 + 8, h, metal, 20, 14);
  }

  laundrySink(body, palette);
}
