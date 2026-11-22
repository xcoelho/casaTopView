import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "lava-loucas";
export const modelHeight = 85;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, boxAt, roundedBoxAt, shade } = shared;
  function dishwasher(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
  
    boxAt(g, w - 6, d - 6, 6, 0, 0, 0, DARK_METAL, 1, 0, 'metal');
    roundedBoxAt(g, w, d, h - 6, 0, 0, 6, main, 1.6, 'metal');
    roundedBoxAt(g, w - 6, 2.4, h - 18, 0, d / 2 + 0.6, 8, shade(main, 0.04), 1.2, 'metal');
    boxAt(g, w - 8, 1.4, 8, 0, d / 2 + 2, h - 18, accent, 1, 0, 'metal');
    boxAt(g, w - 18, 3.4, 3.4, 0, d / 2 + 3.6, h - 13, CHROME, 1, 0, 'chrome');
    boxAt(g, 14, 1, 3, -w / 2 + 14, d / 2 + 2.1, h - 17, '#8fd3c2', 1, 0, 'emissive');
    boxAt(g, 10, 1, 1.6, w / 2 - 14, d / 2 + 2.1, h - 16, '#5c6167', 1, 0, 'metal');
  }

  dishwasher(body, palette);
}
