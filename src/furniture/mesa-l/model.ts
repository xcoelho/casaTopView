import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-l";
export const modelHeight = 75;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, coneAt, roundedBoxAt, shade } = shared;
  function lDesk(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = Math.min(64, d * 0.44);
    const legH = h - 4;
  
    roundedBoxAt(g, w, t, 4, 0, -d / 2 + t / 2, legH, main, 1, 'wood');
    roundedBoxAt(g, t + 8, d - t, 4, -w / 2 + (t + 8) / 2, -d / 2 + t + (d - t) / 2, legH, main, 1, 'wood');
  
    const pts: Array<[number, number]> = [
      [-w / 2 + 9, -d / 2 + 9],
      [w / 2 - 9, -d / 2 + 9],
      [w / 2 - 9, -d / 2 + t - 9],
      [-w / 2 + 9, d / 2 - 9],
      [-w / 2 + t - 1, d / 2 - 9],
    ];
    for (const [x, z] of pts) coneAt(g, 2.4, 2.0, legH, x, z, 0, accent, 1, 'metal', 12);
  
    boxAt(g, w - 26, 1.6, h * 0.4, 0, -d / 2 + t - 2.5, legH - h * 0.4, shade(main, -0.08), 1, 0, 'wood');
    boxAt(g, w - 60, 2, 10, w / 2 - 40, -d / 2 + t - 4, legH - 26, accent, 1, 0, 'metal');
  }

  lDesk(body, palette);
}
