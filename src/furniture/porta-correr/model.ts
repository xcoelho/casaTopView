import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';

export const modelId = 'porta-correr';

export function buildOpening({ group, width, height, color }: OpeningBuildContext): void {
  boxAt(group, width / 2, 3, height - 4, -width / 4, 2.5, 2, color, 1, 0, 'wood');
  boxAt(group, width / 2, 3, height - 4, width / 4, -2.5, 2, shade(color, -0.1), 1, 0, 'wood');
  boxAt(group, width / 2, 4, 3, width / 4, -2.5, 120, '#8a867d');
}
