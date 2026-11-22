import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "espelho-quadrado-led";
export const modelHeight = 90;
export const modelBase = 112;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt } = shared;
  /** Espelho quadrado iluminado com moldura de LED. */
  function ledMirror(g: G, p: Palette): void {
    const { w, h } = p;
    boxAt(g, w, 2, h, 0, 0, 0, '#fff3cf', 1, 0, 'emissive');
    boxAt(g, w - 6, 1.2, h - 6, 0, 0.6, 3, '#cfe3e8', 1, 0, 'screen');
    boxAt(g, w - 14, 0.6, h * 0.6, -w * 0.1, 1.2, h * 0.24, '#ffffff', 0.4, 0, 'screen');
  }

  ledMirror(body, palette);
}
