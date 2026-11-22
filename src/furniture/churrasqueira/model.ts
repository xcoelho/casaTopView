import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "churrasqueira";
export const modelHeight = 110;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, shade } = shared;
  function grill(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const bodyH = h * 0.62;
  
    boxAt(g, w * 0.72, d, bodyH, -w * 0.14, 0, 0, main, 1, 0, 'stone');
    boxAt(g, w * 0.64, d - 12, bodyH * 0.55, -w * 0.14, 2, bodyH * 0.4, '#2f2b28', 1, 0, 'matte');
  
    for (let i = 0; i < 7; i++) {
      boxAt(g, 1.6, d - 18, 2, -w * 0.14 - w * 0.24 + i * (w * 0.08), 0, bodyH * 0.52, accent, 1, 0, 'metal');
    }
  
    boxAt(g, w * 0.78, d + 4, 4, -w * 0.14, 0, bodyH, '#4a4d51', 1, 0, 'metal');
    boxAt(g, w * 0.34, d * 0.7, 2.6, -w * 0.14, -d * 0.15, bodyH + 4, '#3b3f45', 1, 0, 'metal');
    for (let i = 0; i < 6; i++) {
      boxAt(g, 1.4, d * 0.62, 1.2, -w * 0.14 - w * 0.13 + i * (w * 0.052), -d * 0.15, bodyH + 7, '#6b7075', 1, 0, 'metal');
    }
  
    boxAt(g, w * 0.2, d, 4, w * 0.36, 0, h * 0.62, '#b9bec4', 1, 0, 'metal');
    boxAt(g, w * 0.2, d * 0.8, 2, w * 0.36, 0, h * 0.62 + 4, '#8f969c', 1, 0, 'metal');
  
    const chimneyH = Math.max(10, p.ceil - h);
    boxAt(g, w * 0.18, d * 0.32, chimneyH, -w * 0.14, -d * 0.2, h, shade(main, -0.08), 1, 0, 'stone');
  }

  grill(body, palette);
}
