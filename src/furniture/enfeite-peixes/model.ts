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
    for (let i = 0; i < 3; i++) {
      const x = -w / 2 + w * (0.28 + i * 0.22);
      const y = h * (0.5 + (i % 2 ? 0.14 : -0.06));
      const len = sizes[i];
      const fish = sphereAt(g, len / 2, x, y, 1.6, main, [1, 0.22, 0.12], 'wood');
      fish.rotation.z = i === 1 ? Math.PI : 0;
      coneAt(g, 4, 1.4, 7, x + (i === 1 ? -len / 2 : len / 2), y, 0, shade(main, -0.1), 1, 'wood', 12);
    }
  }

  wallFish(body, palette);
}
