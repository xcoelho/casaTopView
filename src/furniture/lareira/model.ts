import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "lareira";
export const modelHeight = 118;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, roundedBoxAt, shade } = shared;
  function fireplace(g: G, p: Palette): void {
    const { w, d, h, main } = p;
    const side = w * 0.22;
  
    boxAt(g, side, d, h, -w / 2 + side / 2, 0, 0, main, 1, 0, 'stone');
    boxAt(g, side, d, h, w / 2 - side / 2, 0, 0, main, 1, 0, 'stone');
    boxAt(g, w, d, h * 0.44, 0, 0, h * 0.56, main, 1, 0, 'stone');
    boxAt(g, w * 0.56, 3, h * 0.56, 0, -d / 2 + 1.5, 0, '#2b2724', 1, 0, 'matte');
    boxAt(g, w * 0.56, d - 3, 2, 0, 0, 0, '#38322d', 1, 0, 'matte');
  
    for (let i = 0; i < 3; i++) {
      const log = cylinderAt(g, 3.4, w * 0.26, 0, d / 2 - d * 0.34 + i * 5.5, 10 + i * 3, '#6b4a30', 1, 'wood');
      log.rotation.z = Math.PI / 2;
      log.rotation.y = -0.28 + i * 0.26;
    }
    boxAt(g, w * 0.3, 7, 1.8, 0, d / 2 - d * 0.24, 8, '#ff9a4a', 1, 0, 'emissive');
    boxAt(g, w * 0.12, 3.4, 1.2, -w * 0.11, d / 2 - d * 0.2, 9, '#ffd08a', 1, 0, 'emissive');
  
    roundedBoxAt(g, w + 10, d + 6, 5, 0, 0, h - 5, shade(main, 0.08), 1.6, 'stone');
    boxAt(g, w + 14, d + 12, 3, 0, 0, 0, '#cfc8ba', 1, 0, 'stone');
    boxAt(g, w * 0.6, 2, 2, 0, d / 2 + 3.2, h - 9, shade(main, -0.18), 1, 0, 'stone');
  }

  fireplace(body, palette);
}
