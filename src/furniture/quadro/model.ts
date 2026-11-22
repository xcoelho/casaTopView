import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "quadro";
export const modelHeight = 80;
export const modelBase = 140;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, shade } = shared;
  function picture(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const t = 5;
  
    boxAt(g, w, d, t, 0, 0, h - t, main, 1, 0, 'wood');
    boxAt(g, w, d, t, 0, 0, 0, main, 1, 0, 'wood');
    boxAt(g, t, d, h - 2 * t, -w / 2 + t / 2, 0, t, main, 1, 0, 'wood');
    boxAt(g, t, d, h - 2 * t, w / 2 - t / 2, 0, t, main, 1, 0, 'wood');
    boxAt(g, w - 2 * t, 1.5, h - 2 * t, 0, d / 2 - 0.8, t, accent, 1, 0, 'paint');
    boxAt(g, w - 2 * t - 9, 1, h - 2 * t - 9, 0, d / 2 + 0.2, t + 4.5, shade(accent, 0.12), 1, 0, 'paint');
    boxAt(g, w - 2 * t - 18, 0.6, 1.4, 0, d / 2 + 0.9, t + 14, '#ffffff', 0.35, 0, 'paint');
  }

  picture(body, palette);
}
