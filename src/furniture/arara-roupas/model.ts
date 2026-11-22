import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "arara-roupas";
export const modelHeight = 170;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, clothColors, cylinderAt } = shared;
  /** Arara de roupas: estrutura tubular com barra e peças penduradas. */
  function garmentRack(g: G, p: Palette): void {
    const { w, d, h, accent, metal } = p;
  
    for (const sz of [-1, 1]) boxAt(g, w, 3, 4, 0, sz * (d / 2 - 3), 0, metal, 1, 0, 'metal');
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        cylinderAt(g, 1.5, h, sx * (w / 2 - 4), sz * (d / 2 - 4), 0, metal, 1, 'metal');
      }
    }
    boxAt(g, w - 4, 2.4, 2.4, 0, 0, h - 3, metal, 1, 0, 'metal');
  
    const count = 5;
    const step = (w - 28) / (count - 1);
    const cloth = clothColors(accent);
    for (let i = 0; i < count; i++) {
      const x = -w / 2 + 14 + i * step;
      const height = h * (0.42 + (i % 3) * 0.06);
      boxAt(g, step * 0.66, 2.2, height, x, 0, h - 12 - height, cloth[i % cloth.length], 1, (i % 2 ? 1 : -1) * 0.05, 'fabric');
      boxAt(g, 1.6, 1.6, 6, x, 0, h - 7, metal, 1, 0, 'metal');
      boxAt(g, step * 0.5, 1.6, 1.6, x, 0, h - 9, metal, 1, 0, 'metal');
    }
  }

  garmentRack(body, palette);
}
