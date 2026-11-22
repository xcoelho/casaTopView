import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "sofa-modular-l";
export const modelHeight = 76;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { DARK_METAL, cylinderAt, roundedBoxAt, shade } = shared;
  /** Sofá modular em L: base baixa, chaise à direita e almofadas soltas. */
  function sectionalSofa(g: G, p: Palette): void {
    const { w, d, h, main, light, dark, accent } = p;
    const arm = 16;
    const backD = 20;
    const plinth = 10;
    const mainD = Math.max(88, d * 0.56);
    const extD = d - mainD;
    const chaiseW = Math.min(w * 0.38, 130);
    const cz = -d / 2 + mainD / 2;
    const seatY = plinth + 22;
  
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        cylinderAt(g, 2, plinth, sx * (w / 2 - 10), sz * (d / 2 - 10), 0, DARK_METAL, 1, 'metal');
      }
    }
    roundedBoxAt(g, w, mainD, 22, 0, cz, plinth, dark, 3, 'fabric');
    roundedBoxAt(g, chaiseW, extD + 2, 22, w / 2 - chaiseW / 2, -d / 2 + mainD + extD / 2 - 1, plinth, dark, 3, 'fabric');
    roundedBoxAt(g, w, backD, h - seatY, 0, -d / 2 + backD / 2, seatY, main, 5, 'fabric');
    roundedBoxAt(g, arm, mainD, 24, -w / 2 + arm / 2, cz, seatY - 4, main, 6, 'fabric');
    roundedBoxAt(g, arm, d, 24, w / 2 - arm / 2, 0, seatY - 4, main, 6, 'fabric');
  
    const zStart = -d / 2 + backD + 2;
    const seatL = -w / 2 + arm;
    const seatR = w / 2 - chaiseW;
    const cw = (seatR - seatL - 4) / 2;
    for (let i = 0; i < 2; i++) {
      const x = seatL + 2 + cw * (i + 0.5);
      const dep = mainD - backD - 8;
      roundedBoxAt(g, cw - 3, dep, 14, x, zStart + dep / 2, seatY, light, 4, 'fabric');
      roundedBoxAt(g, cw - 6, 14, 30, x, -d / 2 + backD + 8, seatY + 6, light, 5, 'fabric', 1, 0, -0.16);
    }
    const chW = chaiseW - arm - 2;
    const chX = w / 2 - arm - chW / 2;
    const chDep = d / 2 - 4 - zStart;
    roundedBoxAt(g, chW, chDep, 14, chX, zStart + chDep / 2, seatY, light, 4, 'fabric');
    roundedBoxAt(g, chW - 6, 14, 30, chX, -d / 2 + backD + 8, seatY + 6, light, 5, 'fabric', 1, 0, -0.16);
    // Almofadas decorativas e manta sobre a chaise.
    roundedBoxAt(g, 34, 10, 34, seatL + 26, -d / 2 + backD + 18, seatY + 12, accent, 5, 'fabric', 1, 0.3, -0.28);
    roundedBoxAt(g, 30, 10, 30, seatR - 22, -d / 2 + backD + 18, seatY + 12, shade(accent, 0.16), 5, 'fabric', 1, -0.26, -0.28);
    roundedBoxAt(g, chW - 10, 46, 3, chX, d / 2 - 32, seatY + 14, shade(accent, -0.18), 2, 'fabric', 1, 0.06);
  }

  sectionalSofa(body, palette);
}
