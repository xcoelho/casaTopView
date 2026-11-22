import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "tapete-redondo";
export const modelHeight = 2;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { latheAt, shade } = shared;
  function rugRound(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    const r = Math.min(w, d) / 2;
    latheAt(g, [[0, 0], [r - 1.5, 0], [r, 1.2], [r, 2], [0, 2]], 0, 0, 0, main, 'fabric', 44);
    latheAt(g, [[0, 0], [r - 10, 0], [r - 9, 0.8], [r - 9, 2.2], [0, 2.2]], 0, 0, 0, accent, 'fabric', 44);
    latheAt(g, [[0, 0], [r - 18, 0], [r - 17, 0.5], [r - 17, 2.4], [0, 2.4]], 0, 0, 0, shade(main, 0.06), 'fabric', 40);
  }

  rugRound(body, palette);
}
