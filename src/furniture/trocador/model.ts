import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "trocador";
export const modelHeight = 95;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, fourLegs, roundedBoxAt, shade } = shared;
  function changingTable(g: G, p: Palette): void {
    const { w, d, h, main, accent, metal } = p;
    const legH = 9;
  
    fourLegs(g, w, d, legH, 6, 1.8, 2.2, shade(main, -0.32), 'wood');
    roundedBoxAt(g, w, d - 4, h - legH - 18, 0, 0, legH, main, 1.6, 'wood');
  
    const dh = (h - legH - 26) / 3;
    for (let i = 0; i < 3; i++) {
      const y = legH + 6 + i * dh;
      roundedBoxAt(g, w - 10, 2.2, dh - 3, 0, d / 2 - 1.6, y, shade(main, -0.03), 1, 'wood');
      boxAt(g, 9, 2.4, 2, w / 2 - 12, d / 2 - 0.2, y + dh * 0.4, metal, 1, 0, 'metal');
    }
  
    // Prateleira inferior, tampo e colchonete.
    boxAt(g, w - 8, d - 10, 2, 0, 0, legH + 2, shade(main, -0.08), 1, 0, 'wood');
    roundedBoxAt(g, w + 2, d, 4, 0, 0, h - 18, shade(main, 0.06), 1.2, 'wood');
    roundedBoxAt(g, w - 14, d - 12, 8, 0, 1, h - 14, accent, 3, 'fabric');
  
    // Bordas de segurança nas laterais do colchonete.
    for (const sx of [-1, 1]) {
      boxAt(g, 2.4, d - 8, 13, sx * (w / 2 - 9), 0, h - 13, shade(main, -0.1), 1, 0, 'wood');
    }
  }

  changingTable(body, palette);
}
