import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "banqueta";
export const modelHeight = 66;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { coneAt, latheAt, torusAt } = shared;
  function stool(g: G, p: Palette): void {
    const { w, d, main, metal } = p;
    const r = Math.min(w, d) / 2 - 2;
    latheAt(g, [[0, 0], [r - 1.6, 0], [r, 2.2], [r, 5], [0, 5]], 0, 0, 60, main, 'wood', 28);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        coneAt(g, 1.5, 1.5, 60, sx * (r - 8), sz * (r - 8), 0, metal, 1, 'metal', 12);
      }
    }
    const ring = (r - 8) * 1.41;
    torusAt(g, ring, 0.9, 0, 0, 20, metal, 'metal');
    torusAt(g, ring, 0.9, 0, 0, 44, metal, 'metal');
  }

  stool(body, palette);
}
