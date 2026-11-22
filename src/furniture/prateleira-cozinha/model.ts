import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "prateleira-cozinha";
export const modelHeight = 20;
export const modelBase = 146;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, shade } = shared;
  /** Prateleira aberta de cozinha com potes e tábua. */
  function kitchenShelf(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = 3.4;
  
    boxAt(g, w, d, t, 0, 0, h - t, main, 1, 0, 'wood');
    for (const sx of [-1, 1]) {
      const x = sx * (w / 2 - 9);
      boxAt(g, 2.2, 2.2, h - t, x, -d / 2 + 2.4, 0, accent, 1, 0, 'metal');
      boxAt(g, 2.2, d * 0.68, 2.2, x, -d / 2 + 2.4 + d * 0.34, h - t, accent, 1, 0, 'metal');
    }
  
    const jarX = [-w * 0.32, -w * 0.11, w * 0.12, w * 0.33];
    const jarH = [14, 18, 12, 16];
    const jarColor = ['#f1efe8', '#dcd2c1', '#c9ccce', '#f1efe8'];
    for (let i = 0; i < jarX.length; i++) {
      cylinderAt(g, 4.2, jarH[i], jarX[i], 0, h, jarColor[i], 1, 'ceramic');
      cylinderAt(g, 4.35, 1.6, jarX[i], 0, h + jarH[i], accent, 1, 'metal');
    }
    boxAt(g, 2.2, d * 0.66, 22, w * 0.23, 0, h, shade(main, 0.08), 1, 0, 'wood');
  }

  kitchenShelf(body, palette);
}
