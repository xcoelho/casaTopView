import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "espelho";
export const modelHeight = 72;
export const modelBase = 108;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt } = shared;
  function mirror(g: G, p: Palette): void {
    const { w, d, h, main } = p;
  
    roundedBoxAt(g, w, d, h, 0, 0, 0, '#d9d6ce', 1, 'metal');
    boxAt(g, w - 4, 1.2, h - 4, 0, d / 2 + 0.7, 2, main, 1, 0, 'screen');
    boxAt(g, w - 8, 0.6, 1.6, 0, d / 2 + 1.4, h * 0.72, '#ffffff', 0.55, 0, 'screen');
    boxAt(g, w - 12, 0.6, 1.2, -w * 0.12, d / 2 + 1.4, h * 0.28, '#ffffff', 0.32, 0, 'screen');
  }

  mirror(body, palette);
}
