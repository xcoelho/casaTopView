import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, cylinderAt, roundedBoxAt } from '../../view3d/modelApi';

export const modelId = 'microondas';
export const modelHeight = 30;
export const modelBase = 90;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent, metal, dark } = palette;
  const b = d / 2;

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      cylinderAt(body, 1.4, 2, sx * (w / 2 - 4), sz * (b - 4), 0, dark, 1, 'matte');
    }
  }
  roundedBoxAt(body, w, d, h - 2, 0, 0, 2, main, 1.2, 'metal');

  const front = b;

  const doorW = w * 0.66;
  const doorX = -w / 2 + doorW / 2 + 1.5;
  roundedBoxAt(body, doorW, 1.8, h - 7, doorX, front + 0.9, 3.5, accent, 0.8, 'paint');
  boxAt(body, doorW - 10, 0.6, h - 15, doorX - 1, b + 2, 7.5, '#10151c', 0.95, 0, 'glass');

  boxAt(body, 2.4, 2.6, h - 11, doorX + doorW / 2 - 3, b + 1.6, 5.5, metal, 1, 0, 'chrome');

  const panelX = w / 2 - w * 0.14 - 1;
  roundedBoxAt(body, w * 0.26, 1.6, h - 7, panelX, front + 0.8, 3.5, dark, 0.8, 'paint');
  boxAt(body, w * 0.18, 0.5, 4, panelX, b + 1.9, h - 9.5, '#79d989', 1, 0, 'screenGlow');
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      boxAt(body, 4.2, 0.5, 2.6, panelX - 3 + c * 6, b + 1.9, h - 14 - r * 3.6, '#3a3f46', 1, 0, 'matte');
    }
  }
  boxAt(body, 10.4, 0.5, 2.8, panelX, b + 1.9, 4.5, metal, 1, 0, 'metal');

  for (let i = 0; i < 6; i++) {
    boxAt(body, 3.2, 12, 0.4, -w / 2 + 9 + i * 6, -b + 12, h - 0.4, dark, 1, 0, 'matte');
  }
}
