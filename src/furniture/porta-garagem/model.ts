import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';

export const modelId = 'porta-garagem';

export function buildOpening({ group, width, height, color }: OpeningBuildContext): void {
  boxAt(group, width - 4, 4, height - 2, 0, 0, 1, color, 1, 0, 'wood');
  for (let i = 1; i < 8; i++) {
    boxAt(group, width - 8, 1.5, 2, 0, 2.2, (height / 8) * i, shade(color, -0.14), 1, 0, 'wood');
  }
}
