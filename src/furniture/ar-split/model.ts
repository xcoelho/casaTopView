import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "ar-split";
export const modelHeight = 30;
export const modelBase = 208;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt } = shared;
  function airSplit(g: G, p: Palette): void {
    const { w, d, h } = p;
  
    roundedBoxAt(g, w, d, h, 0, 0, 0, '#f7f6f2', 2.6, 'paint');
    roundedBoxAt(g, w - 3, 2.5, h * 0.62, 0, d / 2 + 0.6, h * 0.22, '#fbfaf6', 1.4, 'paint');
    for (let i = 0; i < 6; i++) {
      boxAt(g, w - 16, 1, 1, 0, d / 2 + 1.6, h * 0.3 + i * 2.2, '#dcdad3', 1, 0, 'paint');
    }
    boxAt(g, 11, 0.8, 2.6, w / 2 - 15, d / 2 + 1.7, h * 0.72, '#8fd3c2', 1, 0, 'emissive');
    boxAt(g, w * 0.5, 1.2, 1.6, 0, -d / 2 - 0.5, h * 0.3, '#e2e0d9', 1, 0, 'paint');
  }

  airSplit(body, palette);
}
