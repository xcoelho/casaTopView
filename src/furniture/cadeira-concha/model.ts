import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cadeira-concha";
export const modelHeight = 82;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, coneAt, roundedBoxAt, shade } = shared;
  /** Cadeira concha com pés palito de madeira, inspirada na referência. */
  function shellChair(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const a = w / 2;
    const b = d / 2;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        coneAt(g, 1.7, 2.3, 45, sx * (a - 5), sz * (b - 5), 0, accent, 1, 'wood', 10);
      }
    }
    roundedBoxAt(g, w - 6, d - 6, 7, 0, 0, 44, shade(main, 0.1), 3, 'matte');
    roundedBoxAt(g, w, 4, h - 45, 0, -b + 2, 45, main, 2, 'matte');
    for (const sx of [-1, 1]) {
      roundedBoxAt(g, 4, d - 8, h - 52, sx * (a - 2), 0, 48, main, 2, 'matte');
    }
    boxAt(g, w - 22, 1.6, h - 62, 0, 1, 52, shade(main, 0.22), 0.5, 0, 'matte');
    boxAt(g, w - 26, 1.6, h - 62, -2, 1, 52, shade(main, 0.22), 0.35, 0, 'matte');
    boxAt(g, w - 26, 1.6, h - 62, 2, 1, 52, shade(main, 0.22), 0.35, 0, 'matte');
  }

  shellChair(body, palette);
}
