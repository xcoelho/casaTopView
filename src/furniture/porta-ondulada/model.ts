import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt, tubeAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';
import { addSwingLeaf } from '../shared/porta-3d';

export const modelId = 'porta-ondulada';

/** Curva do veio em fração da largura, do batente para a ponta da folha. */
function seamX(t: number): number {
  return 0.47 + 0.17 * Math.sin((t - 0.05) * Math.PI * 1.1);
}

export function buildOpening({ group, opening, width, height, color }: OpeningBuildContext): void {
  addSwingLeaf(group, opening, width, (leaf, leafWidth, side) => {
    const center = (side * leafWidth) / 2;
    const seam = shade(color, -0.5);
    const trim = shade(color, 0.07);
    const steel = '#b6bbc0';
    const steelDark = '#70767b';

    boxAt(leaf, leafWidth - 1, 4, height - 2, center, 0, 1, color, 1, 0, 'wood');

    // Bordas levemente salientes, como o aro usinado da referência.
    boxAt(leaf, leafWidth - 1, 4.25, 1.2, center, 0, 1.2, trim, 1, 0, 'wood');
    boxAt(leaf, leafWidth - 1, 4.25, 1.2, center, 0, height - 2.4, trim, 1, 0, 'wood');
    boxAt(leaf, 1.2, 4.25, height - 2, side * 1.4, 0, 1, trim, 1, 0, 'wood');
    boxAt(leaf, 1.2, 4.25, height - 2, side * (leafWidth - 1.4), 0, 1, trim, 1, 0, 'wood');

    // Veio ondulado: tubo fino aplicado nas duas faces da folha.
    const points: Array<[number, number, number]> = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      points.push([side * leafWidth * seamX(t), 7 + t * (height - 14), 0]);
    }
    for (const face of [1, -1]) {
      tubeAt(leaf, points, 0.55, 0, face * 2.08, 0, seam, 'wood');
    }

    // Ripas horizontais somente à direita da curva, cada uma começando no veio.
    for (let i = 1; i <= 7; i++) {
      const t = i / 8;
      const y = 8 + t * (height - 16);
      const from = side * leafWidth * seamX(t);
      const to = side * (leafWidth - 3);
      boxAt(leaf, Math.abs(to - from), 4.14, 1, (from + to) / 2, 0, y, seam, 1, 0, 'wood');
    }

    // Puxador tipo alavanca, dos dois lados, perto da ponta livre.
    const handleX = side * (leafWidth - 9);
    for (const face of [1, -1]) {
      boxAt(leaf, 2.2, 1.5, 7, handleX, face * 2.35, 99, steel, 1, 0, 'chrome');
      boxAt(leaf, 12, 1.4, 1.6, handleX - side * 5.2, face * 2.75, 101, steel, 1, 0, 'chrome');
      boxAt(leaf, 1.1, 1.1, 2.4, handleX, face * 2.3, 90, steelDark, 1, 0, 'metal');
    }
  });
}
