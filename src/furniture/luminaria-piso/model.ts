import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "luminaria-piso";
export const modelHeight = 165;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { coneAt, cylinderAt, latheAt, sphereAt } = shared;
  function floorLamp(g: G, p: Palette): void {
    const { main, metal } = p;
  
    latheAt(g, [[0, 0], [12, 0], [13.4, 2.4], [13.4, 3.6], [0, 3.6]], 0, 0, 0, metal, 'metal', 28);
    cylinderAt(g, 1.4, 132, 0, 0, 3, metal, 1, 'metal');
    cylinderAt(g, 3.4, 2, 0, 0, 133, metal, 1, 'metal');
    coneAt(g, 9, 16, 24, 0, 0, 135, main, 1, 'fabric', 28, true);
    sphereAt(g, 5.6, 0, 143, 0, '#fff3cf', [1, 1, 1], 'emissive');
  }

  floorLamp(body, palette);
}
