import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "lavatorio";
export const modelHeight = 86;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { PORCELAIN, boxAt, faucet, latheAt, roundedBoxAt, shade } = shared;
  function vanity(g: G, p: Palette): void {
    const { w, d, h, main, accent, metal } = p;
  
    boxAt(g, w - 12, d - 14, 6, 0, 0, 0, shade(main, -0.4), 1, 0, 'paint');
    roundedBoxAt(g, w, d - 4, h - 24, 0, -2, 8, main, 1.5, 'paint');
  
    for (const sx of [-1, 1]) {
      roundedBoxAt(g, w / 2 - 4, 2, h - 34, sx * (w / 4), d / 2 - 3.6, 12, shade(main, sx < 0 ? 0.02 : -0.02), 1, 'paint');
      boxAt(g, 2.4, 3, 10, sx * 4, d / 2 - 1.8, h * 0.52, metal, 1, 0, 'metal');
    }
  
    roundedBoxAt(g, w + 2, d + 1, 5, 0, 0, h - 5, accent, 1, 'stone');
  
    latheAt(
      g,
      [[0, 0], [16, 0], [18, 4], [18, 12], [16, 14], [15, 12], [15, 4], [0, 3]],
      0,
      0,
      h,
      PORCELAIN,
      'ceramic',
      32,
      1,
      0.72,
    );
  
    faucet(g, 0, -d * 0.3, h, metal, 17, 11);
  }

  vanity(body, palette);
}
