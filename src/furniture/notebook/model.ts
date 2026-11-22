import { shade } from '../../catalog/draw';
import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, roundedBoxAt, sphereAt } from '../../view3d/modelApi';

export const modelId = 'notebook';
export const modelHeight = 25;
export const modelBase = 75;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, main, accent } = palette;
  const b = d / 2;
  const hingeZ = -b + 7.6;
  const baseDepth = Math.min(22, d - 8);
  const baseZ = hingeZ + baseDepth / 2;
  const deck = shade(main, 0.08);

  roundedBoxAt(body, w - 0.8, baseDepth, 1.55, 0, baseZ, 0, main, 0.4, 'metal');
  roundedBoxAt(body, w - 4.2, baseDepth * 0.62, 0.22, 0, baseZ - baseDepth * 0.12, 1.55, accent, 0.1, 'matte');
  roundedBoxAt(body, 9.2, 6.1, 0.16, 0, baseZ + baseDepth * 0.3, 1.55, deck, 0.25, 'metal');
  boxAt(body, w - 3, 1.15, 1.15, 0, hingeZ, 0.7, shade(main, -0.28), 1, 0, 'metal');

  const screenH = 20.5;
  const lean = 0.32;
  const hingeY = 1.7;
  const centerY = hingeY + (screenH / 2) * Math.cos(lean);
  const centerZ = hingeZ - (screenH / 2) * Math.sin(lean);
  const baseY = centerY - screenH / 2;

  roundedBoxAt(body, w - 0.8, 0.72, screenH, 0, centerZ, baseY, main, 0.22, 'metal', 1, 0, -lean);

  const panelH = screenH - 2.3;
  const face = 0.5;
  const panelY = centerY + Math.sin(lean) * face - panelH / 2;
  const panelZ = centerZ + Math.cos(lean) * face;
  roundedBoxAt(body, w - 3.2, 0.12, panelH, 0, panelZ, panelY, accent, 0.05, 'screen', 1, 0, -lean);
  sphereAt(body, 0.22, 0, panelY + panelH - 0.15, panelZ, shade(main, 0.2), [1, 1, 1], 'matte');
}
