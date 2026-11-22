import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "coifa";
export const modelHeight = 46;
export const modelBase = 152;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, boxAt, cylinderAt, roundedBoxAt, shade } = shared;
  function hood(g: G, p: Palette): void {
    const { w, d, h, main, ceil } = p;
  
    boxAt(g, w * 0.36, d * 0.36, Math.max(ceil - h, 4), 0, 0, h, shade(main, -0.12), 1, 0, 'metal');
    roundedBoxAt(g, w, d, h * 0.36, 0, 0, 0, main, 2.2, 'metal');
    boxAt(g, w + 2, d + 2, 2.5, 0, 0, 0, CHROME, 1, 0, 'chrome');
    boxAt(g, w - 16, d - 16, 1.6, 0, 0, 1.5, '#8f969c', 1, 0, 'metal');
    for (const sx of [-1, 1]) {
      cylinderAt(g, 2.2, 1, sx * w * 0.24, 0, 0.6, '#fff3cf', 1, 'emissive');
    }
    boxAt(g, w * 0.5, 1.6, 6, 0, d / 2 - 0.5, h * 0.06, '#b9bec4', 1, 0, 'metal');
  }

  hood(body, palette);
}
