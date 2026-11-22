import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, cylinderAt, roundedBoxAt } from '../../view3d/modelApi';

export const modelId = 'arandela-led-tubular';
export const modelHeight = 40;
export const modelBase = 160;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent } = palette;
  const b = d / 2;
  const tubeZ = b - 3.5;
  const tubeR = Math.min(w / 2 - 2, 2.4);

  roundedBoxAt(body, w - 4, 1.6, h - 10, 0, -b + 0.8, 5, main, 0.7, 'metal');
  for (const y of [8, h - 10]) {
    boxAt(body, 2.2, 3.4, 2.4, 0, -b + 2.9, y, main, 1, 0, 'metal');
  }

  cylinderAt(body, tubeR, h - 6, 0, tubeZ, 3, accent, 0.95, 'emissive');
  cylinderAt(body, tubeR + 0.5, 2, 0, tubeZ, 1, main, 1, 'metal');
  cylinderAt(body, tubeR + 0.5, 2, 0, tubeZ, h - 3, main, 1, 'metal');
}
