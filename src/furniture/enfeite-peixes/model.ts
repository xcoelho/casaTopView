import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "enfeite-peixes";
export const modelHeight = 42;
export const modelBase = 140;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { coneAt, shade, sphereAt } = shared;
  /** Enfeites de parede: peixes de madeira e círculos de metal. */
  function wallFish(g: G, p: Palette): void {
    const { w, h, main } = p;
    const sizes = [44, 30, 34];
    const flips = [false, true, false];
    const heights = [0.34, 0.66, 0.32];
    const tailLen = 6;
    for (let i = 0; i < 3; i++) {
      const x = -w / 2 + w * (0.32 + i * 0.2);
      const y = h * heights[i];
      const len = sizes[i];
      const side = flips[i] ? 1 : -1;
      const tailR = len * 0.085;
      sphereAt(g, len / 2, x, y, 1.6, main, [1, 0.22, 0.12], 'wood');
      const fin = coneAt(
        g,
        tailR,
        tailR * 0.3,
        tailLen,
        x + side * (len / 2 + tailLen / 2 - 1.5),
        1.6,
        y - tailLen / 2,
        shade(main, -0.12),
        1,
        'wood',
        12,
      );
      fin.rotation.z = side < 0 ? Math.PI / 2 : -Math.PI / 2;
      fin.scale.z = 0.3;
      sphereAt(g, len * 0.045, x - side * len * 0.3, y + 1, 3.2, '#2a2118', [1, 1, 0.4], 'matte');
    }
  }

  wallFish(body, palette);
}
