import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-centro-organica";
export const modelHeight = 40;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { GLASS, cylinderAt, roundedBoxAt, shade } = shared;
  /** Mesa de centro orgânica: tampo oval de vidro sobre blocos de madeira cruzados. */
  function organicCoffeeTable(g: G, p: Palette): void {
    const { w, d, h, main, dark } = p;
    const r = Math.min(w, d) / 2;
    roundedBoxAt(g, w * 0.52, 16, h - 4, -w * 0.06, -d * 0.05, 0, dark, 4, 'wood', 1, 0.42);
    roundedBoxAt(g, w * 0.4, 14, h - 6, w * 0.14, d * 0.1, 0, shade(main, -0.1), 4, 'wood', 1, -0.62);
    cylinderAt(g, 3.2, h - 4, w * 0.02, 0, 0, shade(main, -0.22), 1, 'wood');
    const top = cylinderAt(g, r, 3, 0, 0, h - 3, GLASS, 0.42, 'glass');
    top.scale.set(1, 1, 0.76);
    const shine = cylinderAt(g, r * 0.94, 0.6, 0, 0, h - 0.6, '#eaf6fa', 0.4, 'glass');
    shine.scale.set(1, 1, 0.76);
  }

  organicCoffeeTable(body, palette);
}
