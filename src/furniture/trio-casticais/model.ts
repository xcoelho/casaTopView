import type { ModelBuildContext } from '../../view3d/modelApi';
import { coneAt, cylinderAt, sphereAt } from '../../view3d/modelApi';
import { shade } from '../../catalog/draw';

export const modelId = 'trio-casticais';
export const modelHeight = 30;
export const modelBase = 76;

export function build({ body, palette }: ModelBuildContext): void {
  const { main, accent } = palette;

  // alturas escalonadas da haste
  const items = [
    { x: -10, z: -0.8, s: 6 },
    { x: 0, z: 1.2, s: 11 },
    { x: 10, z: -0.6, s: 16 },
  ];

  for (const { x, z, s } of items) {
    // base cônica, haste com nó e copo do castiçal
    coneAt(body, 2.2, 4.2, 1.6, x, z, 0, accent, 1, 'metal', 32);
    cylinderAt(body, 0.8, s - 3.8, x, z, 1.6, accent, 1, 'metal');
    sphereAt(body, 1.3, x, (1.6 + s - 2.2) / 2, z, shade(accent, -0.1), [1, 0.7, 1], 'metal', 1);
    coneAt(body, 2.4, 1, 2.2, x, z, s - 2.2, accent, 1, 'metal', 32);

    // vela levemente afunilada, encaixada no copo
    coneAt(body, 0.95, 1.15, 12, x, z, s - 0.6, main, 1, 'matte', 24);
    const top = s + 11.4;

    // pavio + chama em duas camadas + halo quente
    cylinderAt(body, 0.12, 0.7, x, z, top, '#3a2f22', 1, 'matte');
    sphereAt(body, 1.2, x, top + 1.15, z, '#ff9a3d', [1, 1.1, 1], 'emissive', 0.16);
    sphereAt(body, 0.55, x, top + 1.15, z, '#ffb84d', [0.7, 1.6, 0.7], 'emissive', 1);
    sphereAt(body, 0.28, x, top + 1, z, '#fff6cf', [0.7, 1.5, 0.7], 'emissive', 1);
  }
}