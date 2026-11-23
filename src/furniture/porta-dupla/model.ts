import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { addDoubleSwingLeaves } from '../shared/porta-3d';

export const modelId = 'porta-dupla';

export function buildOpening({ group, opening, width, height, color }: OpeningBuildContext): void {
  addDoubleSwingLeaves(group, opening, width, (leaf, leafWidth, side) => {
    boxAt(leaf, leafWidth - 1, 4, height - 2, (side * leafWidth) / 2, 0, 1, color, 1, 0, 'wood');
    boxAt(leaf, 2, 6, 6, side * (leafWidth - 10), 0, 100, '#8a867d');
  });
}
