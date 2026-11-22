import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "poltrona-amamentacao";
export const modelHeight = 100;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { fourLegs, roundedBoxAt, shade } = shared;
  function nursingChair(g: G, p: Palette): void {
    const { w, d, h, main, accent, dark } = p;
    const legH = 9;
    const seatH = 24;
  
    fourLegs(g, w, d, legH, 8, 2, 2.6, dark, 'wood');
    roundedBoxAt(g, w, d * 0.84, seatH, 0, 2, legH, main, 4, 'fabric');
    roundedBoxAt(g, w - 10, d * 0.62, 13, 0, 4, legH + seatH, accent, 4, 'fabric');
  
    // Braços largos e encosto alto, com almofada lombar.
    for (const sx of [-1, 1]) {
      roundedBoxAt(g, 11, d * 0.72, 26, sx * (w / 2 - 5), 2, legH + 8, shade(main, -0.05), 4, 'fabric');
    }
    roundedBoxAt(g, w, 15, h - legH - 6, 0, -d / 2 + 7, legH, main, 5, 'fabric');
    roundedBoxAt(g, w - 24, 9, 30, 0, -d / 2 + 16, legH + 20, accent, 4, 'fabric');
  }

  nursingChair(body, palette);
}
