import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "tv";
export const modelHeight = 72;
export const modelBase = 88;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, cylinderAt, roundedBoxAt } = shared;
  function tv(g: G, p: Palette): void {
    const { w, d, h } = p;
  
    roundedBoxAt(g, w, d, h, 0, 0, 0, '#22262b', 1.2, 'metal');
    roundedBoxAt(g, w - 5, 1.4, h - 5, 0, d / 2 + 0.5, 2.5, '#0b0e12', 1, 'screenGlow');
    boxAt(g, w * 0.3, 2, 2, 0, d / 2 + 1, 1, '#3a4048', 1, 0, 'metal');
    cylinderAt(g, 0.9, 0.4, w / 2 - 8, d / 2 + 1.2, 3, '#5c6167', 1, 'emissive');
  }

  tv(body, palette);
}
