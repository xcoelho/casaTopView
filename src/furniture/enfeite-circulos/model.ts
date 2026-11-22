import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "enfeite-circulos";
export const modelHeight = 112;
export const modelBase = 108;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, torusAt } = shared;
  function wallCircles(g: G, p: Palette): void {
    const { w, h, main } = p;
    for (const fx of [-0.22, 0.22]) {
      const x = w * fx;
      boxAt(g, 2.2, 1.6, h * 0.9, x, 0, h * 0.05, main, 1, 0, 'metal');
      torusAt(g, h * 0.16, 1.8, x, 0, h * 0.42, main, 'metal', 0, 0);
      torusAt(g, h * 0.1, 1.5, x, 0, h * 0.62, main, 'metal', 0, 0);
    }
    boxAt(g, 9, 1.4, 1.4, -w * 0.22, 0, h * 0.78, main, 1, 0, 'metal');
  }

  wallCircles(body, palette);
}
