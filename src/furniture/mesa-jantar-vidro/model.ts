import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-jantar-vidro";
export const modelHeight = 76;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, GLASS, bar, boxAt, rakedLeg, roundedBoxAt } = shared;
  /** Mesa de jantar de vidro com duas bases em X de madeira e tirante cromado. */
  function glassDiningTable(g: G, p: Palette): void {
    const { w, d, h, main } = p;
    const topT = 3;
    const topY = h - topT;
    const stationX = w / 2 - Math.min(60, w * 0.24);
    const spread = d * 0.34;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        rakedLeg(g, 7, 16, sx * stationX, sz * spread, topY - 2, main, 'wood');
        boxAt(g, 9, 18, 2.5, sx * stationX, sz * spread, 0, DARK_METAL, 1, 0, 'metal');
      }
      boxAt(g, 10, 20, 3, sx * stationX, 0, topY - 3, DARK_METAL, 1, 0, 'metal');
    }
    bar(g, [-stationX, h * 0.34, 0], [stationX, h * 0.34, 0], 2.2, CHROME, 'chrome');
    roundedBoxAt(g, w, d, topT, 0, 0, topY, GLASS, 1.2, 'glass', 0.42);
    boxAt(g, w - 3, d - 3, 0.8, 0, 0, topY + topT - 0.8, '#e8f4f8', 0.5, 0, 'glass');
  }

  glassDiningTable(body, palette);
}
