import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "cesto-roupas";
export const modelHeight = 58;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { boxAt, latheAt, shade, torusAt } = shared;
  function laundryBasket(g: G, p: Palette): void {
    const { w, d, h, main, accent } = p;
    const top = Math.min(w, d) / 2 - 1;
    const bottom = top * 0.76;
  
    // Cesto afunilado com aro de reforço.
    latheAt(
      g,
      [[0, 0], [bottom, 0], [bottom * 1.06, 6], [top * 0.96, h - 5], [top, h - 1], [0, h - 1]],
      0,
      0,
      0,
      main,
      'wood',
      26,
    );
    torusAt(g, top, 1.5, 0, 0, h - 1, shade(main, -0.16), 'wood');
  
    // Roupas dobradas na boca do cesto.
    boxAt(g, top * 1.5, top * 1.2, 9, 0, 0, h - 6, accent, 1, 0.12, 'fabric');
    boxAt(g, top * 1.2, top, 7, 0, 0, h - 1, shade(accent, 0.12), 1, -0.2, 'fabric');
  }

  laundryBasket(body, palette);
}
