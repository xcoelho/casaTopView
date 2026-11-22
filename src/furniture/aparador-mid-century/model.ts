import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "aparador-mid-century";
export const modelHeight = 85;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { bar, boxAt, roundedBoxAt, shade } = shared;
  /** Aparador mid-century: portas ripadas, pés palito inclinados e puxadores latão. */
  function midCenturySideboard(g: G, p: Palette): void {
    const { w, d, h, main, dark, accent } = p;
    const legH = 22;
    const bodyH = h - legH - 4;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        bar(
          g,
          [sx * (w / 2 - 6), 0, sz * (d / 2 - 6)],
          [sx * (w / 2 - 14), legH, sz * (d / 2 - 12)],
          2.2,
          dark,
          'wood',
        );
      }
    }
    roundedBoxAt(g, w, d, bodyH, 0, 0, legH, main, 1.2, 'wood');
    roundedBoxAt(g, w + 4, d + 3, 4, 0, 0, h - 4, shade(main, 0.06), 1, 'wood');
    const doors = 4;
    const dw = (w - 6 - (doors - 1) * 2) / doors;
    for (let i = 0; i < doors; i++) {
      const x = -w / 2 + 3 + dw / 2 + i * (dw + 2);
      roundedBoxAt(g, dw, 2, bodyH - 8, x, d / 2 + 0.6, legH + 4, shade(main, i % 2 ? -0.03 : 0.02), 0.8, 'wood');
      const slats = Math.max(4, Math.round(dw / 6));
      for (let s = 0; s < slats; s++) {
        const sx2 = x - dw / 2 + 2.5 + (s * (dw - 5)) / Math.max(slats - 1, 1);
        boxAt(g, 1.8, 1.2, bodyH - 14, sx2, d / 2 + 1.8, legH + 7, shade(main, -0.16), 1, 0, 'wood');
      }
      boxAt(g, 2.2, 3, 12, x + (i % 2 ? -dw / 2 + 4 : dw / 2 - 4), d / 2 + 2.4, legH + bodyH * 0.45, accent, 1, 0, 'metal');
    }
    boxAt(g, w - 8, 1.6, 1.6, 0, -d / 2 + 2, legH + 2, shade(main, -0.2), 1, 0, 'wood');
  }

  midCenturySideboard(body, palette);
}
