import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, roundedBoxAt } from '../../view3d/modelApi';

export const modelId = 'computador-monitor';
export const modelHeight = 48;
export const modelBase = 75;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent } = palette;
  const a = w / 2;
  const b = d / 2;
  const lean = 0.14;

  const screenW = Math.min(54, w - 4);
  const screenH = Math.min(32, h - 12);
  const thick = 2.15;
  const screenZ = -b + 4.2;
  const screenBottom = 11;

  roundedBoxAt(body, screenW, thick, screenH, 0, screenZ, screenBottom, main, 0.35, 'metal', 1, 0, -lean);
  roundedBoxAt(
    body,
    screenW - 2.2,
    0.18,
    screenH - 2.4,
    0,
    screenZ + 1.05,
    screenBottom + 1.35,
    accent,
    0.08,
    'screen',
    1,
    0,
    -lean,
  );

  boxAt(body, 3.6, 2.6, 9.5, 0, screenZ + 1.2, 2.2, main, 1, 0, 'metal');
  roundedBoxAt(body, Math.min(20, w * 0.36), 11, 1.25, 0, screenZ + 7.2, 0, main, 1.4, 'metal');

  const mouseW = 6.6;
  const gap = 2.6;
  const margin = 2;
  const kbW = Math.max(18, w - margin * 2 - mouseW - gap);
  const kbD = Math.min(14.5, d * 0.34);
  const kbZ = b - kbD / 2 - 1.4;
  const kbX = -a + margin + kbW / 2;
  roundedBoxAt(body, kbW, kbD, 1.45, kbX, kbZ, 0, main, 0.45, 'metal');
  roundedBoxAt(body, kbW - 2.2, kbD - 3.2, 0.28, kbX, kbZ - 0.5, 1.45, accent, 0.12, 'matte');

  const mouseX = kbX + kbW / 2 + gap + mouseW / 2;
  roundedBoxAt(body, mouseW, kbD - 2.4, 2.15, mouseX, kbZ + 0.2, 0, main, 2.1, 'metal');
}
