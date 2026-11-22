import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cristaleira";
export const modelHeight = 195;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { GLASS, PORCELAIN, bottle, boxAt, cylinderAt, latheAt, shade } = shared;
  /** Cristaleira: portas de vidro com caixilho, prateleiras de vidro, louças e LED. */
  function displayCabinet(g: G, p: Palette): void {
    const { w, d, h, main, dark, accent } = p;
    const plinth = 10;
    const t = 3;
    boxAt(g, w - 8, d - 8, plinth, 0, 0, 0, shade(main, -0.3), 1, 0, 'wood');
    for (const sx of [-1, 1]) boxAt(g, t, d, h - plinth, sx * (w / 2 - t / 2), 0, plinth, main, 1, 0, 'wood');
    boxAt(g, w - 2 * t, 1.6, h - plinth, 0, -d / 2 + 0.8, plinth, shade(main, -0.22), 1, 0, 'wood');
    boxAt(g, w, d, t, 0, 0, plinth, shade(main, -0.08), 1, 0, 'wood');
    boxAt(g, w + 6, d + 4, 5, 0, 0, h - 5, shade(main, 0.05), 1, 0, 'wood');
    boxAt(g, w + 2, d + 2, 3, 0, 0, h - 8, dark, 1, 0, 'wood');
  
    const rows = 3;
    const innerH = h - plinth - 14;
    for (let i = 1; i <= rows; i++) {
      const y = plinth + (i * innerH) / (rows + 1);
      boxAt(g, w - 2 * t - 2, d - 6, 1.6, 0, 0, y, GLASS, 0.4, 0, 'glass');
      for (let k = 0; k < 3; k++) {
        const plate = cylinderAt(g, 9, 1.2, -w * 0.26 + k * 3.2, -d * 0.05, y + 10.4, PORCELAIN, 1, 'ceramic');
        plate.rotation.x = Math.PI / 2;
      }
      for (let k = 0; k < 3; k++) {
        cylinderAt(g, 3, 11, w * 0.1 + k * 8, d * 0.05, y + 1.6, '#dfeef2', 0.55, 'glass');
      }
      latheAt(g, [[0, 0], [6, 0], [8, 5], [8.6, 8], [7.4, 8], [6.6, 5], [0, 2]], w * 0.32, -d * 0.12, y + 1.6, accent, 'ceramic', 24);
    }
    bottle(g, -w * 0.3, d * 0.12, plinth + t, 26, 4, shade(accent, -0.3));
  
    const dw = (w - 4) / 2;
    const dh = h - plinth - 14;
    const y0 = plinth + 5;
    for (let i = 0; i < 2; i++) {
      const x = -w / 2 + 2 + dw / 2 + i * dw;
      boxAt(g, dw - 4, 1.2, dh - 8, x, d / 2 - 0.6, y0 + 4, GLASS, 0.26, 0, 'glass');
      for (const sx of [-1, 1]) boxAt(g, 4, 2.4, dh, x + sx * (dw / 2 - 2), d / 2 - 0.6, y0, main, 1, 0, 'wood');
      boxAt(g, dw, 2.4, 4, x, d / 2 - 0.6, y0, main, 1, 0, 'wood');
      boxAt(g, dw, 2.4, 4, x, d / 2 - 0.6, y0 + dh - 4, main, 1, 0, 'wood');
      boxAt(g, dw - 6, 2, 2, x, d / 2 - 0.6, y0 + dh * 0.5, main, 1, 0, 'wood');
      boxAt(g, 2, 2.6, 14, x + (i ? -dw / 2 + 5 : dw / 2 - 5), d / 2 + 0.8, y0 + dh * 0.42, accent, 1, 0, 'metal');
    }
    boxAt(g, w - 14, 1.2, 1.2, 0, d / 2 - 6, h - 12, '#fff3cf', 1, 0, 'emissive');
  }

  displayCabinet(body, palette);
}
