import type { ModelBuildContext } from '../../view3d/modelApi';
import { coneAt, roundedBoxAt, sphereAt, tubeAt } from '../../view3d/modelApi';

export const modelId = 'arandela-classica';
export const modelHeight = 30;
export const modelBase = 150;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, metal } = palette;
  const b = d / 2;
  const rB = Math.min(w, d) / 2 - 2.5;
  const shadeBase = h * 0.43;
  const shadeH = h * 0.5;

  roundedBoxAt(body, 10, 2, h * 0.66, 0, -b + 1, 5, metal, 0.9, 'metal');
  tubeAt(
    body,
    [
      [0, shadeBase, -b + 2],
      [0, shadeBase - 4, -3],
      [0, shadeBase - 3, 0],
      [0, shadeBase, 1],
    ],
    1.1,
    0,
    0,
    0,
    metal,
    'chrome',
  );

  sphereAt(body, 2.6, 0, shadeBase + shadeH * 0.4, 1, '#ffe6b0', [1, 1.25, 1], 'emissive');

  coneAt(body, rB * 0.8, rB, shadeH, 0, 1, shadeBase, main, 0.96, 'fabric', 26, true);
}
