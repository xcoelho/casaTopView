import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-jantar-cavalete";
export const modelHeight = 76;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, rakedLeg, roundedBoxAt, shade } = shared;
  /** Mesa de jantar cavalete: tampo ripado grosso, pés em A e barra com cunhas. */
  function trestleTable(g: G, p: Palette): void {
    const { w, d, h, main, dark } = p;
    const topT = 6;
    const topY = h - topT;
    roundedBoxAt(g, w, d, topT, 0, 0, topY, main, 1.4, 'wood');
    const planks = Math.max(3, Math.round(d / 26));
    for (let i = 1; i < planks; i++) {
      boxAt(g, w - 6, 0.9, 0.7, 0, -d / 2 + (i * d) / planks, h - 0.7, shade(main, -0.16), 1, 0, 'wood');
    }
    boxAt(g, w - 60, 5, 8, 0, -d / 2 + 12, topY - 8, dark, 1, 0, 'wood');
    boxAt(g, w - 60, 5, 8, 0, d / 2 - 12, topY - 8, dark, 1, 0, 'wood');
  
    const legX = w / 2 - Math.min(52, w * 0.22);
    const spread = d / 2 - 14;
    const apex = topY - 6;
    const braceY = apex * 0.34;
    for (const sx of [-1, 1]) {
      const x = sx * legX;
      for (const sz of [-1, 1]) rakedLeg(g, 8, 8, x, sz * spread, apex, dark, 'wood');
      boxAt(g, 9, spread * 1.34 + 8, 7, x, 0, braceY, dark, 1, 0, 'wood');
      boxAt(g, 12, spread * 2 + 10, 5, x, 0, 0, shade(dark, -0.1), 1, 0, 'wood');
    }
    boxAt(g, legX * 2, 7, 9, 0, 0, braceY, dark, 1, 0, 'wood');
    for (const sx of [-1, 1]) {
      boxAt(g, 5, 9, 15, sx * (legX - 9), 0, braceY - 2, shade(main, -0.24), 1, 0, 'wood');
    }
  }

  trestleTable(body, palette);
}
