import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "geladeira";
export const modelHeight = 186;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, boxAt, roundedBoxAt, shade } = shared;
  function fridge(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const feet = 6;
  
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        boxAt(g, 4, 4, feet, sx * (w / 2 - 7), sz * (d / 2 - 7), 0, DARK_METAL, 1, 0, 'metal');
      }
    }
  
    roundedBoxAt(g, w, d, h - feet, 0, 0, feet, main, 3, 'metal');
  
    const topBase = feet + h * 0.38;
    const topH = h * 0.56;
    roundedBoxAt(g, w - 4, 2.5, topH, 0, d / 2 + 0.7, topBase, shade(main, 0.03), 1.6, 'metal');
    roundedBoxAt(g, w - 4, 2.5, h * 0.34, 0, d / 2 + 0.7, feet + 3, shade(main, -0.02), 1.6, 'metal');
    boxAt(g, w - 6, 1.4, 1.6, 0, d / 2 + 1.4, feet + 3 + h * 0.345, '#8f969c', 1, 0, 'metal');
  
    boxAt(g, 2.8, 5, h * 0.2, w / 2 - 11, d / 2 + 3.4, topBase + h * 0.06, accent, 1, 0, 'metal');
    boxAt(g, 2.8, 5, h * 0.16, w / 2 - 11, d / 2 + 3.4, feet + h * 0.08, accent, 1, 0, 'metal');
    boxAt(g, w * 0.22, 1, 2.4, -w * 0.16, d / 2 + 2.2, topBase + topH - 10, '#7d858c', 1, 0, 'metal');
  }

  fridge(body, palette);
}
