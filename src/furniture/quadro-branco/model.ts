import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "quadro-branco";
export const modelHeight = 100;
export const modelBase = 90;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, shade } = shared;
  function whiteboard(g: G, p: Palette): void {
    const { w, d, h, metal } = p;
    const frame = shade(metal, -0.12);
  
    boxAt(g, w, d, h, 0, 0, 0, frame, 1, 0, 'metal');
    boxAt(g, w - 4, 1.4, h - 4, 0, d / 2 - 0.2, 2, '#fbfcfd', 1, 0, 'paint');
    boxAt(g, w * 0.62, 6, 2.2, 0, d / 2 + 1.8, 1, frame, 1, 0, 'metal');
  
    const pens = ['#c07f63', '#43626b', '#3b3f45'];
    for (let i = 0; i < pens.length; i++) {
      boxAt(g, 10, 1.6, 1.6, -w * 0.2 + i * 13, d / 2 + 2, 3.2, pens[i], 1, 0, 'paint');
    }
  }

  whiteboard(body, palette);
}
