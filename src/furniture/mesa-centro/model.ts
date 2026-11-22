import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-centro";
export const modelHeight = 42;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, fourLegs, roundedBoxAt, shade } = shared;
  function coffeeTable(g: G, p: Palette): void {
    const { w, d, h, main, dark } = p;
    fourLegs(g, w, d, h - 4, 6, 1.9, 1.9, dark, 'metal');
    roundedBoxAt(g, w, d, 4, 0, 0, h - 4, main, 1.4, 'wood');
    roundedBoxAt(g, w - 4, d - 4, 1.2, 0, 0, h - 5.2, shade(main, 0.08), 1, 'wood');
    boxAt(g, w - 14, d - 14, 2.5, 0, 0, 12, shade(main, -0.1), 1, 0, 'wood');
    for (const sx of [-1, 1]) {
      boxAt(g, 2, d - 14, 1.5, sx * (w / 2 - 7), 0, 11, dark, 1, 0, 'metal');
    }
  }

  coffeeTable(body, palette);
}
