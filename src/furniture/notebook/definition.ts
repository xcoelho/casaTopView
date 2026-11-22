import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, shade } from '../../catalog/draw';

const INK = '#1b1e24';

export default {
  id: 'notebook',
  name: 'Notebook aberto',
  category: 'eletro',
  w: 34,
  d: 32,
  keywords: ['notebook', 'laptop', 'portatil', 'computador', 'tela'],
  colors: { main: '#e3e6ee', accent: '#171b22' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'metal' },
    { key: 'accent', label: 'Tela', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const body = colors.main ?? '#e3e6ee';
    const screen = colors.accent ?? '#171b22';
    const edge = alpha(INK, 0.42);
    const lidD = Math.min(6.4, d * 0.22);

    box(ctx, 0.9, 0.7, w - 1.8, lidD, 0.7, shade(body, -0.06), edge, 0.9);
    box(ctx, 2, 1.35, w - 4, lidD - 1.5, 0.35, screen, null);
    box(ctx, w / 2 - 0.45, 1.15, 0.9, 0.55, 0.2, shade(body, 0.35), null);
    box(ctx, 1.6, lidD + 0.55, w - 3.2, 1.05, 0.25, shade(body, -0.38), null);

    const baseY = lidD + 1.7;
    const baseH = d - baseY - 0.7;
    box(ctx, 0.6, baseY, w - 1.2, baseH, 1.05, body, edge, 0.95);

    const keysX = 2.1;
    const keysY = baseY + 1.3;
    const keysW = w - 4.2;
    const keysH = Math.max(4, baseH - 8.2);
    const cols = 10;
    const rows = 4;
    const gx = 0.28;
    const gy = 0.26;
    const cw = (keysW - gx * (cols - 1)) / cols;
    const ch = (keysH - gy * (rows - 1)) / rows;
    if (cw > 0.35 && ch > 0.35) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          box(ctx, keysX + c * (cw + gx), keysY + r * (ch + gy), cw, ch, 0.15, shade(screen, 0.2), null);
        }
      }
    }

    const padW = Math.min(9.2, w * 0.28);
    const padH = Math.min(5.6, baseH * 0.28);
    box(ctx, (w - padW) / 2, d - padH - 1.8, padW, padH, 0.7, shade(body, 0.06), alpha(INK, 0.28), 0.6);
  },
} satisfies FurnitureDef;
