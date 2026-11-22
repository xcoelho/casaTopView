import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "espelho-redondo-pendente";
export const modelHeight = 72;
export const modelBase = 128;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { bar, boxAt, cylinderAt, torusAt } = shared;
  /** Espelho redondo com alça de couro em "V" presa a um pino, como na referência. */
  function strapMirror(g: G, p: Palette): void {
    const { h, main, accent } = p;
    const r = Math.min(31, h * 0.24);
    const centerY = h - r - 18;
  
    // Argola e vidro do espelho.
    torusAt(g, r, 1.8, 0, 0, centerY, accent, 'matte', 0, 0);
    const glass = cylinderAt(g, r - 1.4, 1, 0, 0, centerY - 0.6, main, 1, 'screen');
    glass.rotation.x = Math.PI / 2;
  
    // Pino redondo preso à parede, no topo.
    const knobY = h - 4;
    const knob = cylinderAt(g, 3.4, 2.4, 0, 2.6, knobY - 1.2, accent, 1, 'matte');
    knob.rotation.x = Math.PI / 2;
  
    // Duas tiras de couro partindo do pino até as laterais altas da argola.
    const ax = r * 0.85;
    const ay = centerY + r * 0.53;
    const strap = 2.2;
    for (const side of [-1, 1]) {
      const x1 = side * ax;
      const dx = x1;
      const dy = ay - knobY;
      const len = Math.hypot(dx, dy);
      const bar = boxAt(g, strap, strap, len, x1 / 2, 2.2, (knobY + ay) / 2 - len / 2, accent, 1, 0, 'matte');
      bar.rotation.z = Math.atan2(-dx, dy);
    }
  }

  strapMirror(body, palette);
}
