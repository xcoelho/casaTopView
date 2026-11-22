import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "tapete-peludo";
export const modelHeight = 2;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { hash, roundedBoxAt, shade, sphereAt } = shared;
  function rugFluffy(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    roundedBoxAt(g, w, d, 3.2, 0, 0, 0, main, 4, 'fabric');
    roundedBoxAt(g, w - 20, d - 20, 1.2, 0, 0, 3, accent, 3, 'fabric');
    const tufts = 40;
    for (let i = 0; i < tufts; i++) {
      const x = -w / 2 + 10 + hash(i) * (w - 20);
      const z = -d / 2 + 10 + hash(i + 50) * (d - 20);
      sphereAt(g, 2.4 + hash(i + 20) * 2, x, 3.4, z, i % 2 ? accent : shade(main, 0.1), [1, 0.5, 1], 'fabric');
    }
  }

  rugFluffy(body, palette);
}
