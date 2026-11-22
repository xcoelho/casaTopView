import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "box";
export const modelHeight = 205;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, roundedBoxAt, shade, tubeAt } = shared;
  function shower(g: G, p: Palette): void {
    const { w, d, main, accent, metal } = p;
  
    roundedBoxAt(g, w, d, 7, 0, 0, 0, main, 2, 'ceramic');
    cylinderAt(g, 4, 0.8, 0, 0, 7, '#aeb8bd', 1, 'metal');
    boxAt(g, w - 10, d - 10, 0.6, 0, 0, 7, shade(main, 0.06), 1, 0, 'ceramic');
  
    boxAt(g, 1.2, d - 4, 190, -w / 2 + 2, 0, 8, accent, 0.24, 0, 'glass');
    boxAt(g, w - 4, 1.2, 190, 0, -d / 2 + 2, 8, accent, 0.24, 0, 'glass');
    boxAt(g, 2.6, 2.6, 196, -w / 2 + 2, 0, 6, metal, 1, 0, 'metal');
    boxAt(g, 2.6, 2.6, 196, 0, -d / 2 + 2, 6, metal, 1, 0, 'metal');
    boxAt(g, w - 4, 2.4, 2.4, 0, -d / 2 + 2, 200, metal, 1, 0, 'metal');
    boxAt(g, 2.4, d - 4, 2.4, -w / 2 + 2, 0, 200, metal, 1, 0, 'metal');
  
    const colX = w / 2 - 6;
    const colZ = d / 2 - 6;
    boxAt(g, 3, 3, 190, colX, colZ, 7, metal, 1, 0, 'metal');
    tubeAt(g, [[0, 0, 0], [0, 0, -d * 0.36]], 1.3, colX, colZ, 194, metal, 'chrome');
    cylinderAt(g, 11, 2, colX, colZ - d * 0.36, 192, metal, 1, 'chrome');
    cylinderAt(g, 4.2, 2.4, colX, colZ, 110, metal, 1, 'chrome');
    cylinderAt(g, 1.4, 12, colX, colZ, 96, metal, 1, 'chrome');
  }

  shower(body, palette);
}
