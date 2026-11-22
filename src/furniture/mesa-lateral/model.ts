import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-lateral";
export const modelHeight = 56;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { latheAt } = shared;
  function sideTable(g: G, p: Palette): void {
    const { w, d, h, main, dark } = p;
    const r = Math.min(w, d) / 2;
    latheAt(g, [[0, 0], [r * 0.55, 0], [r * 0.55, 2], [r * 0.16, 4], [r * 0.13, h - 5], [0, h - 5]], 0, 0, 0, dark, 'wood', 26);
    latheAt(g, [[0, 0], [r - 1.5, 0], [r - 0.5, 1.2], [r, 2.6], [r, 4], [0, 4]], 0, 0, h - 4, main, 'wood', 36);
  }

  sideTable(body, palette);
}
