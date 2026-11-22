import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "estante";
export const modelHeight = 196;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, hash, shade } = shared;
  function shelf(g: G, p: Palette): void {
    const { w, d, h, main, dark } = p;
    const t = 2.4;
  
    boxAt(g, w, 1.6, h, 0, -d / 2 + 0.8, 0, shade(main, -0.2), 1, 0, 'wood');
    boxAt(g, 3, d, h, -w / 2 + 1.5, 0, 0, main, 1, 0, 'wood');
    boxAt(g, 3, d, h, w / 2 - 1.5, 0, 0, main, 1, 0, 'wood');
    boxAt(g, w, d, 3, 0, 0, h - 3, shade(main, 0.05), 1, 0, 'wood');
    boxAt(g, w - 6, d - 2, 3, 0, 0, 0, shade(main, -0.1), 1, 0, 'wood');
  
    const shelves = 4;
    for (let i = 1; i < shelves; i++) {
      boxAt(g, w - 6, d - 2, t, 0, 0, (i * (h - 6)) / shelves, main, 1, 0, 'wood');
    }
  
    const bookColors = ['#a8583f', '#4f6d7a', '#7d8a63', '#c2a469', '#6f5f7a', '#8a6142', '#3f4d5c'];
    const slots = 7;
    for (let s = 0; s < shelves; s++) {
      const baseY = s === 0 ? 3 : (s * (h - 6)) / shelves + t;
      const topY = s === shelves - 1 ? h - 6 : ((s + 1) * (h - 6)) / shelves;
      const room = topY - baseY - 3;
      if (room < 8) continue;
      for (let i = 0; i < slots; i++) {
        const seed = s * 17 + i;
        const bw = 3.2 + hash(seed) * 2.6;
        const bh = Math.min(room, 12 + hash(seed + 3) * (room - 10));
        const x = -w / 2 + 9 + (i + 0.5) * ((w - 18) / slots);
        boxAt(g, bw, d * 0.62, bh, x, -d * 0.12, baseY, bookColors[(s * 3 + i) % bookColors.length], 1, 0, 'matte');
      }
    }
    boxAt(g, w - 6, 2, 2, 0, d / 2 - 2, h - 5, dark, 1, 0, 'wood');
  }

  shelf(body, palette);
}
