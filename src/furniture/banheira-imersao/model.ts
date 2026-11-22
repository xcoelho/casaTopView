import type { ModelBuildContext } from '../../view3d/modelApi';
import { cylinderAt, latheAt, torusAt, tubeAt } from '../../view3d/modelApi';

export const modelId = 'banheira-imersao';
export const modelHeight = 72;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent, metal } = palette;
  const a = w / 2;
  const b = d / 2;
  const tubH = h - 12;

  const P = (r: number, y: number): [number, number] => [r, (y / 60) * tubH];
  latheAt(
    body,
    [
      P(0, 0), P(0.55, 0), P(0.8, 3), P(0.96, 16), P(1, 38),
      P(0.98, 54), P(0.95, 60), P(0.88, 60), P(0.86, 52),
      P(0.82, 30), P(0.66, 16), P(0.35, 13), P(0, 13),
    ],
    0,
    0,
    0,
    main,
    'ceramic',
    40,
    a,
    b,
  );

  latheAt(body, [[0, 0], [0.78, 0], [0.78, 1.2], [0, 1.2]], 0, 0, tubH * 0.66, accent, 'water', 32, a, b, 0.9);

  const fx = -(a - 7);
  tubeAt(
    body,
    [
      [fx, tubH - 1, 0], [fx, tubH + 8, 0],
      [fx + 5, tubH + 11, 0], [fx + 10, tubH + 9, 0], [fx + 10, tubH + 6, 0],
    ],
    1.3,
    0,
    0,
    0,
    metal,
    'chrome',
  );

  for (const sz of [-1, 1]) {
    cylinderAt(body, 1.7, 3, fx + 0.5, sz * 7.5, tubH - 0.5, metal, 1, 'chrome');
    torusAt(body, 2.1, 0.55, fx + 0.5, sz * 7.5, tubH + 3.2, metal, 'chrome');
  }
}
