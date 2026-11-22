import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "banheira";
export const modelHeight = 58;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, roundedBoxAt, shade, tubeAt } = shared;
  function bathtub(g: G, p: Palette): void {
    const { w, d, main, accent, metal } = p;
    const wall = 8;
    const h = 56;
  
    roundedBoxAt(g, w, d, 8, 0, 0, 0, main, 3, 'ceramic');
    boxAt(g, w, wall, h, 0, -d / 2 + wall / 2, 0, main, 1, 0, 'ceramic');
    boxAt(g, w, wall, h, 0, d / 2 - wall / 2, 0, main, 1, 0, 'ceramic');
    boxAt(g, wall, d - wall * 2, h, -w / 2 + wall / 2, 0, 0, main, 1, 0, 'ceramic');
    boxAt(g, wall, d - wall * 2, h, w / 2 - wall / 2, 0, 0, main, 1, 0, 'ceramic');
  
    for (const sz of [-1, 1]) {
      roundedBoxAt(g, w, wall, 4, 0, sz * (d / 2 - wall / 2), h - 4, shade(main, 0.04), 3, 'ceramic');
    }
    for (const sx of [-1, 1]) {
      roundedBoxAt(g, wall, d - wall * 2, 4, sx * (w / 2 - wall / 2), 0, h - 4, shade(main, 0.04), 3, 'ceramic');
    }
  
    boxAt(g, w - wall * 2, d - wall * 2, 1.5, 0, 0, h - 9, accent, 0.72, 0, 'water');
  
    cylinderAt(g, 2.2, 14, w / 2 - 12, -d / 2 + 14, h - 4, metal, 1, 'chrome');
    tubeAt(g, [[0, 0, 0], [0, 12, 0], [-6, 15, 0], [-12, 14, 0]], 1.4, w / 2 - 12, -d / 2 + 14, h + 10, metal, 'chrome');
    cylinderAt(g, 2.2, 6, w / 2 - 12, -d / 2 + 14, 20, metal, 1, 'chrome');
  }

  bathtub(body, palette);
}
