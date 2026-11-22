import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "gaveteiro";
export const modelHeight = 62;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, drawers, sphereAt } = shared;

  drawers(body, palette, 3, false);
  
  for (const sx of [-1, 1]) {
          for (const sz of [-1, 1]) {
            sphereAt(body, 2.6, sx * (item.w / 2 - 5), 3, sz * (item.d / 2 - 5), DARK_METAL, [1, 1, 1], 'metal');
          }
        }
}
