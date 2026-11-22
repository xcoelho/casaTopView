import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cadeira-escritorio";
export const modelHeight = 112;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, DARK_METAL, boxAt, cylinderAt, roundedBoxAt, sphereAt } = shared;
  function officeChair(g: G, p: Palette, baseColor: string): void {
    const { w, d, main, accent } = p;
    const r = Math.min(w, d) / 2 - 4;
  
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2;
      boxAt(g, r, 3.6, 3, (Math.cos(ang) * r) / 2, (Math.sin(ang) * r) / 2, 6, baseColor, 1, -ang, 'metal');
      sphereAt(g, 2.7, Math.cos(ang) * r, 4, Math.sin(ang) * r, DARK_METAL, [1, 1, 1], 'metal');
    }
  
    cylinderAt(g, 4.4, 26, 0, 0, 6, CHROME, 1, 'chrome');
    cylinderAt(g, 6, 4, 0, 0, 30, DARK_METAL, 1, 'metal');
    roundedBoxAt(g, w - 8, d - 12, 9, 0, 0, 34, main, 3.5, 'fabric');
    roundedBoxAt(g, w - 12, 8, 40, 0, -d * 0.36, 44, main, 3.5, 'fabric', 1, 0, -0.14);
    roundedBoxAt(g, w - 24, 5, 12, 0, -d * 0.31, 52, accent, 2.5, 'fabric');
    roundedBoxAt(g, w - 20, 6, 9, 0, -d * 0.38, 86, main, 3, 'fabric');
  
    for (const sx of [-1, 1]) {
      boxAt(g, 3.4, 10, 16, sx * (w / 2 - 4), -d * 0.1, 30, baseColor, 1, 0, 'metal');
      roundedBoxAt(g, 6, 22, 4, sx * (w / 2 - 4), -d * 0.08, 46, baseColor, 1.5, 'metal');
    }
  }

  officeChair(body, palette, item.colors.accent ?? '#b8bcc1');
}
