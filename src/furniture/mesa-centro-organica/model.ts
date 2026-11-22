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
  const { cylinderAt, roundedBoxAt, shade } = shared;
  /** Mesa de centro orgânica: tampo oval de vidro sobre blocos de madeira cruzados. */
  function organicCoffeeTable(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const r = Math.min(w, d) / 2;
    const topT = 2.4;
    const topY = h - topT;
    // base: duas travessas cruzadas, ambas encostando no tampo
    roundedBoxAt(g, w * 0.5, 16, topY, 0, 0, 0, shade(accent, -0.14), 4, 'wood', 1, 0.42);
    roundedBoxAt(g, w * 0.42, 14, topY, 0, 0, 0, accent, 4, 'wood', 1, -0.62);
    cylinderAt(g, 3.2, topY, 0, 0, 0, shade(accent, -0.3), 1, 'wood');
    // tampo oval de vidro: o cilindro ja traz o raio na escala, so a profundidade e comprimida
    const top = cylinderAt(g, r, topT, 0, 0, topY, main, 0.42, 'glass');
    top.scale.z *= 0.76;
    const shine = cylinderAt(g, r * 0.94, 0.6, 0, 0, topY + topT - 0.8, '#eaf6fa', 0.45, 'glass');
    shine.scale.z *= 0.76;
  }

  organicCoffeeTable(body, palette);
}
