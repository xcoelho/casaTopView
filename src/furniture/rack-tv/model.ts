import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "rack-tv";
export const modelHeight = 46;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, boxAt, coneAt, roundedBoxAt, shade } = shared;
  function rack(g: G, p: Palette): void {
    const { w, d, h, main, dark, accent } = p;
    const plinth = 7;
    const t = 4;
    const innerY = plinth + t;
    const innerH = h - plinth - t;
  
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        coneAt(g, 1.3, 1.6, plinth, sx * (w / 2 - 9), sz * (d / 2 - 7), 0, DARK_METAL, 1, 'metal', 10);
      }
    }
  
    // Estrutura vazada: base, tampo, laterais e fundo escuro.
    boxAt(g, w, d, t, 0, 0, plinth, shade(main, -0.08), 1, 0, 'wood');
    roundedBoxAt(g, w + 2, d + 1, t, 0, 0, h - t, shade(main, 0.05), 1, 'wood');
    for (const sx of [-1, 1]) {
      boxAt(g, t, d, innerH, sx * (w / 2 - t / 2), 0, innerY, main, 1, 0, 'wood');
    }
    boxAt(g, w - 2 * t, 1.4, innerH, 0, -d / 2 + 0.7, innerY, '#241c15', 1, 0, 'matte');
  
    // Módulo central com gaveta entre dois nichos abertos.
    const centerW = Math.min(46, w * 0.3);
    const dividerT = 3;
    for (const sx of [-1, 1]) {
      boxAt(g, dividerT, d - 2, innerH, sx * (centerW / 2 + dividerT / 2), 0, innerY, main, 1, 0, 'wood');
    }
    const dh = innerH - 8;
    roundedBoxAt(g, centerW, 2.2, dh, 0, d / 2 - 1.1, innerY + 4, shade(main, 0.02), 1, 'wood');
    boxAt(g, centerW * 0.5, 2.4, 2, 0, d / 2 + 0.4, innerY + 4 + dh / 2, accent, 1, 0, 'metal');
  
    const nicheW = (w - centerW - 2 * dividerT - 2 * t) / 2;
    for (const sx of [-1, 1]) {
      const x = sx * (centerW / 2 + dividerT + nicheW / 2);
      boxAt(g, nicheW - 1, d - 5, 2.4, x, 0, innerY + innerH * 0.52, shade(main, -0.05), 1, 0, 'wood');
      boxAt(g, nicheW - 8, 0.8, 1.2, x, d / 2 - 2, innerY + 3, shade(main, -0.3), 1, 0, 'matte');
    }
  
    // Aparelho eletrônico no nicho direito.
    const rx = centerW / 2 + dividerT + nicheW / 2;
    const devY = innerY + innerH * 0.52 + 1.2;
    boxAt(g, nicheW - 12, d * 0.5, 7, rx, 0, devY, '#2b2f34', 1, 0, 'metal');
    boxAt(g, 2.2, 0.8, 1.2, rx + nicheW * 0.3, d * 0.5, devY + 4, '#8fd3c2', 1, 0, 'emissive');
    boxAt(g, 10, 0.8, 0.8, rx - nicheW * 0.22, d * 0.5, devY + 2, '#7d858c', 1, 0, 'metal');
  
    boxAt(g, w - 24, 1.6, 1.6, 0, -d / 2 + 3, plinth + 1.5, dark, 1, 0, 'wood');
  }

  rack(body, palette);
}
