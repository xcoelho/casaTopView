import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "pergolado";
export const modelHeight = 240;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, shade } = shared;
  /** Pergolado: quatro pilares, vigas perimetrais e ripas de madeira. */
  function pergola(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const post = 14;
    const beam = 14;
    const top = h - beam - 4;
  
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const x = sx * (w / 2 - post / 2);
        const z = sz * (d / 2 - post / 2);
        boxAt(g, post + 8, post + 8, 10, x, z, 0, accent, 1, 0, 'stone');
        boxAt(g, post, post, top - 10, x, z, 10, shade(main, -0.1), 1, 0, 'wood');
      }
    }
  
    for (const sz of [-1, 1]) boxAt(g, w, 9, beam, 0, sz * (d / 2 - 5), top, main, 1, 0, 'wood');
    for (const sx of [-1, 1]) boxAt(g, 9, d - 18, beam, sx * (w / 2 - 5), 0, top, main, 1, 0, 'wood');
  
    const slats = Math.max(4, Math.round(d / 40));
    for (let i = 0; i < slats; i++) {
      const z = -d / 2 + 14 + ((d - 28) * i) / Math.max(slats - 1, 1);
      boxAt(g, w - 12, 3.6, 5, 0, z, top + beam, shade(main, 0.05), 1, 0, 'wood');
    }
  }

  pergola(body, palette);
}
