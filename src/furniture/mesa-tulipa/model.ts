import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "mesa-tulipa";
export const modelHeight = 76;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, hash, latheAt, shade } = shared;
  /** Mesa tulipa: pedestal único torneado e tampo redondo de mármore. */
  function tulipTable(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const r = Math.min(w, d) / 2;
    const baseR = r * 0.44;
    latheAt(
      g,
      [[0, 0], [baseR, 0], [baseR, 2], [baseR * 0.92, 5], [r * 0.16, h * 0.5], [r * 0.11, h - 5], [0, h - 5]],
      0,
      0,
      0,
      main,
      'paint',
      40,
    );
    latheAt(g, [[0, 0], [r - 1, 0], [r, 1.6], [r, 4], [0, 4]], 0, 0, h - 4, accent, 'stone', 48);
    // Veios do mármore.
    for (let i = 0; i < 4; i++) {
      const a = hash(i + 3) * Math.PI;
      const len = r * (0.7 + hash(i) * 0.8);
      boxAt(g, len, 1.1 + hash(i + 7), 0.5, (hash(i + 2) - 0.5) * r * 0.5, (hash(i + 5) - 0.5) * r * 0.5, h - 0.5, shade(accent, -0.16), 0.55, a, 'stone');
    }
  }

  tulipTable(body, palette);
}
