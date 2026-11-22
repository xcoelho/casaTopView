import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "pilar";
export const modelHeight = 262;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, shade } = shared;
  function pillar(g: G, p: Palette): void {
    const { w, d, h, main } = p;
  
    boxAt(g, w + 10, d + 10, 10, 0, 0, 0, shade(main, -0.1), 1, 0, 'stone');
    boxAt(g, w, d, h - 20, 0, 0, 10, main, 1, 0, 'stone');
    boxAt(g, w + 8, d + 8, 10, 0, 0, h - 10, shade(main, -0.06), 1, 0, 'stone');
    boxAt(g, w + 2, d + 2, 2, 0, 0, 9, shade(main, 0.06), 1, 0, 'stone');
    boxAt(g, w + 2, d + 2, 2, 0, 0, h - 12, shade(main, 0.06), 1, 0, 'stone');
  }

  pillar(body, palette);
}
