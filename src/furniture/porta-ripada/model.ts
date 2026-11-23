import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';
import { addSwingLeaf } from '../shared/porta-3d';

export const modelId = 'porta-ripada';

const FRAME_METAL = '#3b4044';
const HANDLE_METAL = '#5a6064';

export function buildOpening({ group, opening, width, height, color }: OpeningBuildContext): void {
  addSwingLeaf(group, opening, width, (leaf, leafWidth, side) => {
    const center = (side * leafWidth) / 2;
    const innerWidth = leafWidth - 12;
    const innerHeight = height - 12;

    // Fundo escuro recessado: aparece nas frestas entre as ripas.
    boxAt(leaf, innerWidth, 3.6, innerHeight, center, 0, 6, shade(color, -0.48), 1, 0, 'wood');

    // Moldura metálica perimetral, mais espessa que as ripas.
    boxAt(leaf, 6, 5, height, side * 3, 0, 0, FRAME_METAL, 1, 0, 'metal');
    boxAt(leaf, 6, 5, height, side * (leafWidth - 3), 0, 0, FRAME_METAL, 1, 0, 'metal');
    boxAt(leaf, leafWidth, 5, 6, center, 0, 0, FRAME_METAL, 1, 0, 'metal');
    boxAt(leaf, leafWidth, 5, 6, center, 0, height - 6, FRAME_METAL, 1, 0, 'metal');

    // Ripas horizontais de madeira com pequenas frestas.
    const slats = 13;
    const gap = 1.1;
    const slatHeight = (innerHeight - gap * (slats - 1)) / slats;
    for (let i = 0; i < slats; i++) {
      const base = 6 + i * (slatHeight + gap);
      const tone = shade(color, i % 2 === 0 ? 0.045 : -0.035);
      boxAt(leaf, innerWidth, 4.4, slatHeight, center, 0, base, tone, 1, 0, 'wood');
    }

    // Puxador barra vertical, afastado da face por dois suportes.
    const handleX = side * (leafWidth - 16);
    for (const face of [1, -1]) {
      boxAt(leaf, 3.2, 2.4, 94, handleX, face * 4.2, 60, HANDLE_METAL, 1, 0, 'metal');
      boxAt(leaf, 6.5, 1.8, 2.8, handleX, face * 3.2, 70, shade(FRAME_METAL, -0.1), 1, 0, 'metal');
      boxAt(leaf, 6.5, 1.8, 2.8, handleX, face * 3.2, 144, shade(FRAME_METAL, -0.1), 1, 0, 'metal');
    }
  });
}
