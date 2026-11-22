import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "criado-mudo";
export const modelHeight = 52;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, fourLegs, roundedBoxAt, shade } = shared;
  function nightstand(g: G, p: Palette): void {
    const { w, d, h, main, dark, accent } = p;
    const legH = 8;
  
    fourLegs(g, w, d, legH, 5, 1.5, 1.9, dark, 'wood');
    roundedBoxAt(g, w, d - 3, h - legH - 4, 0, 0, legH, main, 1.6, 'wood');
    roundedBoxAt(g, w + 2, d, 4, 0, 0, h - 4, shade(main, 0.06), 1.2, 'wood');
  
    const gap = 2;
    const dh = (h - legH - 12 - gap) / 2;
    for (let i = 0; i < 2; i++) {
      const y = legH + 4 + i * (dh + gap);
      roundedBoxAt(g, w - 8, 2.5, dh, 0, d / 2 - 1.2, y, shade(main, i === 0 ? -0.03 : -0.06), 1, 'wood');
      boxAt(g, 13, 2.6, 2.2, 0, d / 2 + 0.8, y + dh / 2 - 1.1, accent, 1, 0, 'metal');
    }
  }

  nightstand(body, palette);
}
