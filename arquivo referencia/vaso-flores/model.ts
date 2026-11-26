import type { ModelBuildContext } from '../../view3d/modelApi';
import { cylinderAt, latheAt, sphereAt, tubeAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';

export const modelId = 'vaso-flores';
export const modelHeight = 48;
export const modelBase = 76;

const GREEN = '#5f8049';
const GREEN_DARK = '#4c6b3f';
const LEAF = '#6b8f52';
const BREATH = '#f3efe4';

export function build({ body, palette }: ModelBuildContext): void {
  const { main, accent } = palette;

  // vaso cerâmico bojudo com gargalo e lábio (perfil [raio, y])
  latheAt(
    body,
    [[0, 0], [5.2, 0], [6.6, 0.8], [8, 3.5], [8.6, 8], [8.2, 12.5],
     [6.4, 17], [4.6, 20.5], [4.1, 22.5], [4.3, 24.2], [4.9, 25.4], [5.1, 26]],
    0, 0, 0, main, 'ceramic', 40,
  );
  // fundo escuro da boca
  cylinderAt(body, 4.35, 0.6, 0, 0, 25, shade(main, -0.45), 1, 'matte');

  const stem = (pts: Array<[number, number, number]>, r = 0.32) =>
    tubeAt(body, pts, r, 0, 0, 0, GREEN_DARK, 'matte', 1);

  // rosa: anel de pétalas + 3 camadas concêntricas
  const rose = (x: number, y: number, z: number) => {
    for (let k = 0; k < 6; k++) {
      const t = (k * Math.PI) / 3;
      sphereAt(body, 1.25, x + Math.cos(t) * 2.1, y - 0.35, z + Math.sin(t) * 2.1,
        shade(accent, 0.06), [1, 0.5, 1], 'matte', 1);
    }
    sphereAt(body, 2.5, x, y, z, accent, [1, 0.72, 1], 'matte', 1);
    sphereAt(body, 1.8, x, y + 0.75, z, shade(accent, -0.12), [1, 0.78, 1], 'matte', 1);
    sphereAt(body, 1.05, x, y + 1.35, z, shade(accent, -0.3), [1, 0.85, 1], 'matte', 1);
  };

  // tulipa: taça torneada + miolo
  const tulip = (x: number, y: number, z: number) => {
    latheAt(body, [[0, 0], [1.2, 0], [2.1, 1], [2.5, 3], [2.2, 4.8], [2.4, 5.4]],
      x, z, y, shade(accent, 0.18), 'matte', 24);
    sphereAt(body, 1.6, x, y + 4.6, z, shade(accent, -0.15), [1, 0.5, 1], 'matte', 1);
  };

  // caules das rosas
  stem([[-0.8, 25, -0.3], [-2.4, 31, -1], [-3.8, 36, -1.6], [-4.5, 38.6, -2]]);
  stem([[0.9, 25, 0.5], [2.8, 30, 1.4], [4.3, 34, 2], [5, 36.2, 2.5]]);
  stem([[0.2, 25, -0.8], [0.4, 32, -2.2], [0.5, 38, -3.6], [0.5, 42.6, -5]]);
  rose(-4.5, 40, -2);
  rose(5, 37.5, 2.5);
  rose(0.5, 44, -5);

  // caules das tulipas
  stem([[-1, 25, 0.6], [-3.6, 27, 2], [-5.8, 28.5, 3.2], [-7.5, 30.4, 4]]);
  stem([[1, 25, -0.6], [3.8, 28, -1.8], [6, 31, -3], [7.5, 34.4, -4]]);
  stem([[0.5, 25, 1], [1.4, 26.5, 3.4], [2.2, 27.5, 5.2], [2.5, 29, 6.5]]);
  tulip(-7.5, 30, 4);
  tulip(7.5, 34, -4);
  tulip(2.5, 28.5, 6.5);

  // folhagem de preenchimento
  const filler: Array<[number, number, number]> =
    [[-6, 31, -6], [6.5, 30.5, 5.5], [-2, 29.5, 7], [8, 32, -1]];
  stem([[-0.9, 25, -0.9], [-3.5, 28, -3.5], [-6, 30.4, -6]]);
  stem([[0.9, 25, 0.9], [3.6, 28, 3.2], [6.5, 30, 5.5]]);
  stem([[-0.3, 25, 1], [-1.2, 27, 4], [-2, 29, 7]]);
  stem([[1, 25, -0.2], [4.5, 28.5, -0.6], [8, 31.5, -1]]);
  for (const [x, y, z] of filler) {
    sphereAt(body, 2.2, x, y, z, GREEN, [1, 0.6, 1], 'foliage', 1);
    sphereAt(body, 1.4, x + 0.8, y + 0.8, z + 0.6, LEAF, [1, 0.6, 1], 'foliage', 1);
  }

  // folhas achatadas ao longo dos caules
  const leaves: Array<[number, number, number]> =
    [[-3, 30, -1.2], [3.2, 29, 1.6], [-5, 27.5, 2.8], [5.5, 30, -2.4], [0.8, 27, 4.5]];
  for (const [x, y, z] of leaves) {
    sphereAt(body, 1.5, x, y, z, LEAF, [1.7, 0.22, 0.75], 'foliage', 1);
  }

  // mosquitinhos: caule fino + cacho de 3 bolinhas
  const breath = (pts: Array<[number, number, number]>) => {
    stem(pts, 0.18);
    const [x, y, z] = pts[pts.length - 1];
    sphereAt(body, 0.55, x, y + 0.5, z, BREATH, [1, 1, 1], 'matte', 1);
    sphereAt(body, 0.45, x + 0.7, y + 0.2, z + 0.5, BREATH, [1, 1, 1], 'matte', 1);
    sphereAt(body, 0.45, x - 0.6, y + 0.7, z - 0.4, BREATH, [1, 1, 1], 'matte', 1);
  };
  breath([[-1.2, 25, 0.2], [-4.5, 32, 0.8], [-7.5, 38, 1.2], [-9, 41.5, 1.5]]);
  breath([[1.2, 25, 0.4], [5, 33, 1.6], [7.8, 39, 2.4], [9, 43, 3]]);
  breath([[-0.4, 25, -1], [-1.6, 33, -4], [-2.6, 40, -6.6], [-3, 44.5, -8.5]]);
  breath([[0.6, 25, -0.9], [2, 34, -3.4], [3.2, 41, -5.8], [4, 45.5, -7.5]]);
}