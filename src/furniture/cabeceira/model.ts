import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cabeceira";
export const modelHeight = 110;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, roundedBoxAt, shade } = shared;

  {
        roundedBoxAt(body, item.w, item.d, height, 0, 0, 0, main, 3, 'fabric');
        const channels = Math.max(3, Math.round(item.w / 40));
        const cw = item.w / channels;
        for (let i = 1; i < channels; i++) {
          boxAt(body, 1.2, 2, height - 12, -item.w / 2 + cw * i, item.d / 2 - 0.6, 6, shade(main, -0.16), 1, 0, 'fabric');
        }
        boxAt(body, item.w, 2.4, 4, 0, item.d / 2 - 0.4, height - 5, shade(main, 0.08), 1, 0, 'wood');
      }
}
