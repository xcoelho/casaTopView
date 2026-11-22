import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-lateral-tambor";
export const modelHeight = 55;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, latheAt, shade, torusAt } = shared;
  /** Mesa lateral tambor: corpo metálico estriado com tampo de pedra. */
  function drumSideTable(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const r = Math.min(w, d) / 2;
    latheAt(g, [[0, 0], [r * 0.94, 0], [r, 3], [r, h - 6], [r * 0.97, h - 4], [0, h - 4]], 0, 0, 0, main, 'metal', 40);
    const flutes = 22;
    for (let i = 0; i < flutes; i++) {
      const a = (i / flutes) * Math.PI * 2;
      boxAt(g, 2.2, 1.6, h - 14, Math.cos(a) * r, Math.sin(a) * r, 6, shade(main, -0.14), 1, -a, 'metal');
    }
    torusAt(g, r * 0.99, 0.9, 0, 0, 5, shade(main, 0.12), 'metal');
    torusAt(g, r * 0.99, 0.9, 0, 0, h - 8, shade(main, 0.12), 'metal');
    latheAt(g, [[0, 0], [r + 1.2, 0], [r + 2, 1.4], [r + 2, 4], [0, 4]], 0, 0, h - 4, accent, 'stone', 44);
  }

  drumSideTable(body, palette);
}
