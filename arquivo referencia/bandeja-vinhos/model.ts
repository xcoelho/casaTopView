import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, cylinderAt, latheAt, roundedBoxAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';

export const modelId = 'bandeja-vinhos';
export const modelHeight = 33;
export const modelBase = 76;

// perfil real de garrafa Bordeaux: corpo reto, ombro, gargalo e anel da boca
const BOTTLE: Array<[number, number]> = [
  [0, 0], [3.55, 0], [3.8, 0.7], [3.8, 16], [3.5, 18.5], [2.5, 21],
  [1.5, 23], [1.15, 24.5], [1.1, 28.6], [1.35, 28.9], [1.35, 30], [0.95, 30],
];

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, main, accent } = palette;
  const rim = shade(main, -0.12);

  // bandeja: base, fundo e bordas
  roundedBoxAt(body, w, d, 1.6, 0, 0, 0, main, 1.2, 'wood');
  boxAt(body, w - 3.2, d - 3.2, 0.5, 0, 0, 1.6, shade(main, 0.08), 1, 0, 'wood');
  roundedBoxAt(body, w, 1.5, 3.4, 0, -(d / 2 - 0.75), 0, rim, 0.6, 'wood');
  roundedBoxAt(body, w, 1.5, 3.4, 0, d / 2 - 0.75, 0, rim, 0.6, 'wood');
  roundedBoxAt(body, 1.5, d - 3, 3.4, -(w / 2 - 0.75), 0, 0, rim, 0.6, 'wood');
  roundedBoxAt(body, 1.5, d - 3, 3.4, w / 2 - 0.75, 0, 0, rim, 0.6, 'wood');

  // três garrafas em vidros diferentes, levemente desencontradas
  const bottles = [
    { x: -12, z: -1.5, c: accent },
    { x: 0, z: 1.2, c: shade(accent, -0.35) },
    { x: 12, z: -0.8, c: shade(accent, 0.25) },
  ];
  for (const b of bottles) {
    latheAt(body, BOTTLE, b.x, b.z, 2, b.c, 'glass', 36, 1, 1, 0.96);
    // rótulo creme com duas faixas bordô
    cylinderAt(body, 3.92, 7.5, b.x, b.z, 7, '#ece5d3', 1, 'matte');
    cylinderAt(body, 3.98, 0.4, b.x, b.z, 13, '#7a2f3a', 1, 'matte');
    cylinderAt(body, 3.98, 0.25, b.x, b.z, 8, '#7a2f3a', 1, 'matte');
    // cápsula metálica sobre a boca
    cylinderAt(body, 1.42, 3.6, b.x, b.z, 28.6, '#2e2a26', 1, 'metal');
    cylinderAt(body, 1.42, 0.25, b.x, b.z, 32.2, shade('#2e2a26', 0.2), 1, 'metal');
  }
}