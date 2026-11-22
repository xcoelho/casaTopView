import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, coneAt, roundedBoxAt, tubeAt } from '../../view3d/modelApi';

export const modelId = 'cadeira-balanco';
export const modelHeight = 100;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent, dark } = palette;
  const a = w / 2;
  const b = d / 2;
  const seatY = 42;
  const rockX = a - 6;
  const rockEnd = b - 5;
  const rockY = (z: number): number => 2 + 8 * (z / rockEnd) ** 2;

  for (const sx of [-1, 1]) {
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i <= 10; i++) {
      const z = -rockEnd + (2 * rockEnd * i) / 10;
      pts.push([sx * rockX, rockY(z), z]);
    }
    tubeAt(body, pts, 2, 0, 0, 0, dark, 'wood');
  }

  const zF = b - 16;
  const zB = -b + 15;

  for (const sx of [-1, 1]) {
    coneAt(body, 1.8, 2.4, seatY - 4 - rockY(zF), sx * rockX, zF, rockY(zF) + 1, main, 1, 'wood', 10);
    tubeAt(
      body,
      [
        [sx * rockX, rockY(zB) + 1, zB],
        [sx * rockX, h - 4, zB - 5],
      ],
      2.1,
      0,
      0,
      0,
      main,
      'wood',
    );
  }

  roundedBoxAt(body, w - 6, 46, 5, 0, 4, seatY - 5, main, 1.6, 'wood');
  roundedBoxAt(body, w - 12, 40, 5, 0, 5, seatY, accent, 2.2, 'fabric');

  roundedBoxAt(body, w - 10, 3.4, 9, 0, -b + 10, h - 13, main, 1.2, 'wood');
  boxAt(body, w - 12, 2.6, 5, 0, -b + 12.5, seatY + 8, main, 1, 0, 'wood');
  for (let i = 0; i < 4; i++) {
    const x = -a + 12 + ((w - 24) * i) / 3;
    boxAt(body, 2.6, 2, h - 13 - (seatY + 13), x, -b + 11.5, seatY + 13, main, 1, 0, 'wood');
  }

  for (const sx of [-1, 1]) {
    roundedBoxAt(body, 4.5, 46, 2.6, sx * (a - 4), 0, 62, main, 1.2, 'wood');
    coneAt(body, 1.5, 1.9, 62 - seatY, sx * (a - 4), b - 18, seatY, main, 1, 'wood', 10);
    boxAt(body, 3, 3, 62 - (seatY + 6), sx * (a - 4), -b + 18, seatY + 6, main, 1, 0, 'wood');
  }
}
