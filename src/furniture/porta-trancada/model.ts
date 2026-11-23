import type { OpeningBuildContext } from '../../view3d/modelApi';
import { boxAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';
import { addSwingLeaf } from '../shared/porta-3d';

export const modelId = 'porta-trancada';

// Faixas trançadas superior e inferior e ripas no miolo.
const BAND_HEIGHT = 38;
const BAND_MARGIN = 10;
const INNER_MARGIN = 5;

export function buildOpening({ group, opening, width, height, color }: OpeningBuildContext): void {
  addSwingLeaf(group, opening, width, (leaf, leafWidth, side) => {
    const center = (side * leafWidth) / 2;
    const innerWidth = leafWidth - INNER_MARGIN * 2;
    const groove = shade(color, -0.42);
    const weaveBack = shade(color, -0.2);
    const trim = shade(color, 0.06);
    const chrome = '#c3c7cb';
    const steel = '#8f959a';

    boxAt(leaf, leafWidth - 1, 4, height - 2, center, 0, 1, color, 1, 0, 'wood');

    // Aro de madeira que emoldura as faixas e o miolo.
    boxAt(leaf, 4.5, 4.4, height - 2, side * 2.75, 0, 1, trim, 1, 0, 'wood');
    boxAt(leaf, 4.5, 4.4, height - 2, side * (leafWidth - 2.75), 0, 1, trim, 1, 0, 'wood');
    boxAt(leaf, leafWidth - 1, 4.4, 4.5, center, 0, 1, trim, 1, 0, 'wood');
    boxAt(leaf, leafWidth - 1, 4.4, 4.5, center, 0, height - 5.5, trim, 1, 0, 'wood');

    /** Uma faixa de 2 linhas x 5 colunas com tramas alternadas. */
    const weaveBand = (base: number): void => {
      const columns = 5;
      const rows = 3;
      const cellW = innerWidth / columns;
      const cellH = BAND_HEIGHT / rows;
      const inset = 0.9;
      const gap = 0.45;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const cellX = side * (INNER_MARGIN + cellW * (col + 0.5));
          const cellBase = base + cellH * row;
          // Fundo escuro da célula, que vira junta entre as tramas.
          boxAt(leaf, cellW - 0.5, 4.16, cellH - 0.5, cellX, 0, cellBase + 0.25, weaveBack, 1, 0, 'wood');

          if ((row + col) % 2 === 0) {
            const slat = (cellH - inset * 2 - gap * 2) / 3;
            for (let i = 0; i < 3; i++) {
              const tone = shade(color, (row + col + i) % 2 === 0 ? 0.13 : 0.04);
              boxAt(leaf, cellW - inset * 2, 4.45, slat, cellX, 0, cellBase + inset + i * (slat + gap), tone, 1, 0, 'wood');
            }
          } else {
            const slat = (cellW - inset * 2 - gap * 2) / 3;
            for (let i = 0; i < 3; i++) {
              const tone = shade(color, (row + col + i) % 2 === 0 ? 0.13 : 0.04);
              const slatX = cellX + side * (-cellW / 2 + inset + slat / 2 + i * (slat + gap));
              boxAt(leaf, slat, 4.45, cellH - inset * 2, slatX, 0, cellBase + inset, tone, 1, 0, 'wood');
            }
          }
        }
      }

      // Juntas horizontais entre as linhas e verticais entre as colunas.
      for (let row = 1; row < rows; row++) {
        boxAt(leaf, innerWidth, 4.34, 0.55, center, 0, base + cellH * row - 0.275, groove, 1, 0, 'wood');
      }
      for (let col = 1; col < columns; col++) {
        boxAt(leaf, 0.55, 4.34, BAND_HEIGHT - 0.8, side * (INNER_MARGIN + cellW * col), 0, base + 0.4, groove, 1, 0, 'wood');
      }
      // Fio escuro separando a faixa do restante da folha.
      boxAt(leaf, innerWidth, 4.3, 0.8, center, 0, base - 0.8, groove, 1, 0, 'wood');
      boxAt(leaf, innerWidth, 4.3, 0.8, center, 0, base + BAND_HEIGHT, groove, 1, 0, 'wood');
    };

    const topBand = height - BAND_MARGIN - BAND_HEIGHT;
    weaveBand(BAND_MARGIN);
    weaveBand(topBand);

    // Miolo com cinco sulcos horizontais, lendo como tábuas largas.
    const middleTop = BAND_MARGIN + BAND_HEIGHT;
    const middleBottom = topBand;
    for (let i = 1; i <= 5; i++) {
      const y = middleTop + ((middleBottom - middleTop) / 6) * i;
      boxAt(leaf, innerWidth, 4.12, 0.9, center, 0, y, groove, 1, 0, 'wood');
    }

    // Puxador vertical comprido, preso por dois suportes em cada face.
    const handleX = side * (leafWidth - 11);
    for (const face of [1, -1]) {
      boxAt(leaf, 3.2, 2.4, 104, handleX, face * 3.9, 54, chrome, 1, 0, 'chrome');
      boxAt(leaf, 6.2, 2, 2.4, handleX, face * 2.95, 64, steel, 1, 0, 'metal');
      boxAt(leaf, 6.2, 2, 2.4, handleX, face * 2.95, 148, steel, 1, 0, 'metal');
      boxAt(leaf, 1.2, 1.2, 2.4, handleX, face * 2.3, 50, shade(steel, -0.2), 1, 0, 'metal');
    }
  });
}
