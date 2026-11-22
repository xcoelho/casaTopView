import * as THREE from 'three';
import * as shared from '../../view3d/modelShared';
import type { ModelBuildContext } from '../../view3d/modelApi';
import type { Palette, G, MaterialKind } from '../../view3d/modelShared';
import type { Item } from '../../core/document';
import type { CategoryId } from '../../catalog/types';

export const modelId = "vaso";
export const modelHeight = 42;
export const modelBase = 0;

export function build({ body, palette, item, main, height }: ModelBuildContext): void {
  const { CHROME, boxAt, cylinderAt, latheAt, roundedBoxAt, shade, torusAt } = shared;
  function toilet(g: G, p: Palette): void {
    const { w, d, main } = p;
    const b = d / 2;
    const bowlZ = 8;
    const rimY = 40;
    const cisternZ = -b + 8;
    const cisternD = 17;
  
    // Base estreita sob a bacia, apoiada no piso.
    latheAt(
      g,
      [[0, 0], [10, 0], [11, 2], [9, 6], [0, 6]],
      0,
      bowlZ,
      0,
      shade(main, -0.06),
      'ceramic',
      26,
      0.86,
      1,
    );
  
    // Bacia oval, mais estreita na base e aberta no aro.
    latheAt(
      g,
      [
        [0, 4], [10, 4], [13, 9], [16.5, 20], [18.5, 31], [19, rimY],
        [17.5, rimY], [17, 31], [15.5, 21], [12, 12], [0, 11],
      ],
      0,
      bowlZ,
      0,
      main,
      'ceramic',
      32,
      0.82,
      1.02,
    );
  
    // Aro do assento + tampa fechada.
    const ring = torusAt(g, 17.6, 1.5, 0, bowlZ, rimY, shade(main, 0.05), 'ceramic');
    ring.scale.set(0.84, 1, 1.02);
    latheAt(
      g,
      [[0, 0], [17.4, 0], [17.4, 2], [16, 3.4], [0, 3.4]],
      0,
      bowlZ,
      rimY + 1.2,
      shade(main, 0.02),
      'ceramic',
      32,
      0.84,
      1.02,
    );
    cylinderAt(g, 2.4, 0.6, 0, bowlZ - 12, rimY + 3.4, shade(main, -0.12), 1, 'ceramic');
  
    // Caixa acoplada encostada na bacia.
    roundedBoxAt(g, w - 4, cisternD, 42, 0, cisternZ, 34, main, 3, 'ceramic');
    roundedBoxAt(g, w - 6, cisternD - 1.5, 3.4, 0, cisternZ, 75.4, shade(main, -0.04), 2, 'ceramic');
    cylinderAt(g, 3.4, 1.4, 0, cisternZ, 78.6, CHROME, 1, 'chrome');
  
    // Ligação bacia-caixa e rodapé.
    roundedBoxAt(g, w - 14, cisternD + 8, 30, 0, cisternZ + 4, 4, shade(main, -0.04), 2, 'ceramic');
    boxAt(g, w - 8, cisternD + 6, 4, 0, cisternZ + 3, 0, shade(main, -0.12), 1, 0, 'ceramic');
  }

  toilet(body, palette);
}
