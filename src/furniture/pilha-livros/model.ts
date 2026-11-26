import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, cylinderAt, latheAt, roundedBoxAt, sphereAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';

export const modelId = 'pilha-livros';
export const modelHeight = 17;
export const modelBase = 76;

const PAGES = '#ece5d2';
const GOLD = '#c9a86a';

export function build({ body, palette }: ModelBuildContext): void {
  const { main, accent } = palette;

  const books = [
    { w: 27, d: 20, h: 3.4, x: 0, z: 0, c: main },
    { w: 25, d: 18.5, h: 3, x: 0.9, z: -0.6, c: shade(main, -0.25) },
    { w: 23.5, d: 17, h: 2.8, x: -0.8, z: 0.5, c: shade(main, 0.2) },
    { w: 21, d: 15.5, h: 2.6, x: 0.4, z: 0.9, c: shade(main, -0.45) },
  ];

  let y = 0;
  for (const b of books) {
    // capa dura
    roundedBoxAt(body, b.w, b.d, b.h, b.x, b.z, y, b.c, 0.7, 'fabric');
    // miolo de páginas: recuado nas capas, saltando no corte (+x) e na frente (+z)
    boxAt(body, b.w - 1, b.d - 0.6, b.h - 0.9, b.x + 0.7, b.z + 0.45, y + 0.45, PAGES, 1, 0, 'matte');
    // nervuras douradas na lombada (-x)
    boxAt(body, 0.3, b.d - 5, 0.45, b.x - b.w / 2, b.z, y + b.h * 0.28, GOLD, 1, 0, 'metal');
    boxAt(body, 0.3, b.d - 5, 0.45, b.x - b.w / 2, b.z, y + b.h * 0.62, GOLD, 1, 0, 'metal');
    y += b.h;
  }

  // tigela cerâmica torneada, com lábio dobrado para dentro
  latheAt(
    body,
    [[0, 0], [2.4, 0], [4.4, 0.8], [5.8, 2.4], [6.2, 4.2], [6, 4.6], [5.4, 4.3], [4.8, 3.7]],
    0.4, 0.9, y, accent, 'ceramic', 36,
  );
  cylinderAt(body, 4, 0.5, 0.4, 0.9, y + 0.5, shade(accent, -0.25), 1, 'matte');

  // bolas de ratã dentro da tigela
  sphereAt(body, 1.15, -0.9, y + 2, 0.3, '#a8845c', [1, 0.95, 1], 'wood', 1);
  sphereAt(body, 1.15, 1.6, y + 2, 0.7, '#8f6d48', [1, 0.95, 1], 'wood', 1);
  sphereAt(body, 1.15, 0.3, y + 2, 2.3, '#b99a72', [1, 0.95, 1], 'wood', 1);
}