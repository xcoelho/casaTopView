import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "piscina";
export const modelHeight = 10;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, boxAt, cylinderAt, shade } = shared;
  function pool(g: G, p: Palette): void {
    const { w, d, main, accent } = p;
    const cop = 15;
  
    boxAt(g, w, cop, 10, 0, -d / 2 + cop / 2, 0, accent, 1, 0, 'stone');
    boxAt(g, w, cop, 10, 0, d / 2 - cop / 2, 0, accent, 1, 0, 'stone');
    boxAt(g, cop, d - cop * 2, 10, -w / 2 + cop / 2, 0, 0, accent, 1, 0, 'stone');
    boxAt(g, cop, d - cop * 2, 10, w / 2 - cop / 2, 0, 0, accent, 1, 0, 'stone');
  
    const iw = w - cop * 2;
    const id = d - cop * 2;
    const tile = shade(main, -0.24);
    boxAt(g, iw, 2, 10, 0, -d / 2 + cop + 1, 0, tile, 1, 0, 'ceramic');
    boxAt(g, iw, 2, 10, 0, d / 2 - cop - 1, 0, tile, 1, 0, 'ceramic');
    boxAt(g, 2, id, 10, -w / 2 + cop + 1, 0, 0, tile, 1, 0, 'ceramic');
    boxAt(g, 2, id, 10, w / 2 - cop - 1, 0, 0, tile, 1, 0, 'ceramic');
  
    boxAt(g, iw, id, 6, 0, 0, 1, shade(main, -0.48), 1, 0, 'ceramic');
    boxAt(g, iw - 2, id - 2, 2.6, 0, 0, 6.4, main, 0.6, 0, 'water');
  
    const lx = w / 2 - cop - 12;
    for (let i = 0; i < 3; i++) {
      cylinderAt(g, 1.4, 12, lx, d / 2 - cop - 2, 10 + i * 12, CHROME, 1, 'chrome');
    }
    boxAt(g, 2.6, 2.6, 3, lx, d / 2 - cop - 2, 34, CHROME, 1, 0, 'chrome');
    boxAt(g, 22, 26, 1.6, -w / 2 + cop + 26, -d / 2 + cop + 20, 10, '#ffffff', 0.45, 0, 'paint');
  }

  pool(body, palette);
}
