import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "carrinho-bar";
export const modelHeight = 88;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, GLASS, bar, bottle, boxAt, cylinderAt, latheAt, sphereAt, tubeAt } = shared;
  /** Carrinho de bar: tubular dourado com rodízios, vidros, garrafas e balde de gelo. */
  function barCart(g: G, p: Palette): void {
    const { w, d, h, accent } = p;
    const low = 18;
    const top = h - 14;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        bar(g, [sx * (w / 2 - 4), 6, sz * (d / 2 - 4)], [sx * (w / 2 - 4), top + 4, sz * (d / 2 - 4)], 2, accent, 'metal');
        const wheel = cylinderAt(g, 3.2, 2, sx * (w / 2 - 4), sz * (d / 2 - 4), 3, DARK_METAL, 1, 'metal');
        wheel.rotation.z = Math.PI / 2;
      }
    }
    tubeAt(
      g,
      [[-w / 2 + 4, top + 4, -d / 2 + 4], [-w / 2 + 4, h, -d / 2 + 4], [w / 2 - 4, h, -d / 2 + 4], [w / 2 - 4, top + 4, -d / 2 + 4]],
      2,
      0,
      0,
      0,
      accent,
      'metal',
    );
    for (const y of [low, top]) {
      boxAt(g, w - 8, d - 8, 1.6, 0, 0, y, GLASS, 0.4, 0, 'glass');
      for (const sz of [-1, 1]) bar(g, [-w / 2 + 4, y + 1.6, sz * (d / 2 - 4)], [w / 2 - 4, y + 1.6, sz * (d / 2 - 4)], 1.4, accent, 'metal');
      for (const sx of [-1, 1]) bar(g, [sx * (w / 2 - 4), y + 1.6, -d / 2 + 4], [sx * (w / 2 - 4), y + 1.6, d / 2 - 4], 1.4, accent, 'metal');
    }
    bottle(g, -w * 0.3, -d * 0.1, top + 1.6, 30, 4.2, '#3f5d43');
    bottle(g, -w * 0.14, d * 0.12, top + 1.6, 24, 4.6, '#8a4a2c');
    bottle(g, w * 0.02, -d * 0.14, top + 1.6, 27, 4, '#2f3f52');
    for (let i = 0; i < 3; i++) {
      cylinderAt(g, 3.2, 9, w * 0.2 + i * 8, d * 0.14, top + 1.6, '#dfeef2', 0.5, 'glass');
    }
    latheAt(g, [[0, 0], [8, 0], [9.5, 4], [10, 16], [9, 16], [8.6, 4], [0, 2]], w * 0.26, -d * 0.12, low + 1.6, CHROME, 'chrome', 26);
    sphereAt(g, 3, w * 0.26, low + 17, -d * 0.12, '#eaf6fa', [1, 0.8, 1], 'glass');
    for (let i = 0; i < 4; i++) {
      bottle(g, -w * 0.3 + i * 11, d * 0.08, low + 1.6, 22, 3.6, i % 2 ? '#4a5d3a' : '#6b3f2a');
    }
  }

  barCart(body, palette);
}
