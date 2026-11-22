import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "pendente";
export const modelHeight = 26;
export const modelBase = 192;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { coneAt, cylinderAt, sphereAt } = shared;
  function pendant(g: G, p: Palette): void {
    const { w, d, h, main, ceil } = p;
    const r = Math.min(w, d) / 2;
  
    const cordTop = ceil - 2;
    if (cordTop > h + 2) {
      cylinderAt(g, 0.5, cordTop - h, 0, 0, h, '#3a3a3a', 1, 'matte');
      cylinderAt(g, 4.6, 2, 0, 0, cordTop, '#3a3a3a', 1, 'metal');
    }
    coneAt(g, r * 0.5, r, 22, 0, 0, h, main, 1, 'metal', 30, true);
    cylinderAt(g, r * 0.52, 1.4, 0, 0, h + 20, main, 1, 'metal');
    sphereAt(g, 4.4, 0, h + 5, 0, '#fff3cf', [1, 1, 1], 'emissive');
  }

  pendant(body, palette);
}
