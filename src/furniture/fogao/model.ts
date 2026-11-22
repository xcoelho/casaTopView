import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "fogao";
export const modelHeight = 90;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, PORCELAIN, boxAt, cylinderAt, roundedBoxAt, torusAt } = shared;
  function stove(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
  
    boxAt(g, w - 6, d - 6, 8, 0, 0, 0, DARK_METAL, 1, 0, 'metal');
    roundedBoxAt(g, w, d, h - 8, 0, 0, 8, PORCELAIN, 1.2, 'paint');
  
    roundedBoxAt(g, w - 8, 2.4, h * 0.5, 0, d / 2 + 0.6, 12, '#3c4046', 1, 'metal');
    roundedBoxAt(g, w - 20, 1.4, h * 0.3, 0, d / 2 + 2.2, 20, '#1b1f24', 2, 'screen');
    boxAt(g, w - 16, 3.6, 3.6, 0, d / 2 + 4.4, h * 0.52, CHROME, 1, 0, 'chrome');
  
    boxAt(g, w - 8, 2, 9, 0, d / 2 + 1, h - 13, '#dcdad5', 1, 0, 'paint');
    for (let i = 0; i < 3; i++) {
      const knob = cylinderAt(g, 2.2, 2.6, -w * 0.28 + i * w * 0.16, d / 2 + 2.6, h - 11, DARK_METAL, 1, 'metal');
      knob.rotation.x = Math.PI / 2;
    }
  
    roundedBoxAt(g, w, d - 2, 3, 0, 0, h, '#25292e', 1, 'screen');
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const bx = sx * w * 0.22;
        const bz = sz * d * 0.2;
        torusAt(g, Math.min(w, d) * 0.13, 0.9, bx, bz, h + 3, '#15181b', 'metal');
        cylinderAt(g, Math.min(w, d) * 0.075, 1, bx, bz, h + 3, '#2f3338', 1, 'metal');
      }
    }
  
    boxAt(g, w, 2, 28, 0, -d / 2 + 1, h + 3, '#dcdad5', 1, 0, 'paint');
    boxAt(g, w, 2, 2.5, 0, -d / 2 + 1, h + 31, accent, 1, 0, 'metal');
  }

  stove(body, palette);
}
