import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "puff";
export const modelHeight = 42;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { fourLegs, latheAt, shade, torusAt } = shared;

  {
        const r = Math.min(item.w, item.d) / 2 - 2;
        latheAt(
          body,
          [[0, 0], [r * 0.84, 0], [r * 0.96, 5], [r, 14], [r, 30], [r * 0.96, 37], [r * 0.82, 42], [0, 42]],
          0,
          0,
          0,
          main,
          'fabric',
          30,
        );
        torusAt(body, r * 0.985, 0.9, 0, 0, 22, shade(main, -0.16), 'fabric');
        fourLegs(body, item.w, item.d, 6, 8, 1.2, 1.6, shade(main, -0.35), 'wood');
      }
}
