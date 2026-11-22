import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "tapete-listrado";
export const modelHeight = 2;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt, shade } = shared;
  function rugStriped(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    roundedBoxAt(g, w, d, 1.8, 0, 0, 0, main, 1.6, 'fabric');
    const stripes = 7;
    for (let i = 0; i < stripes; i++) {
      const z = -d / 2 + 12 + (i * (d - 24)) / (stripes - 1);
      boxAt(g, w - 8, i % 2 ? 4.5 : 2.2, 0.8, 0, z, 1.8, i % 2 ? accent : shade(accent, -0.2), 1, 0, 'fabric');
    }
    roundedBoxAt(g, w - 16, d - 16, 0.6, 0, 0, 1.8, shade(main, 0.04), 1, 'fabric');
  }

  rugStriped(body, palette);
}
