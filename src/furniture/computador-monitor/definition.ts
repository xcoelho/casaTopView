import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, shade } from '../../catalog/draw';

const INK = '#1b1e24';

export default {
  id: 'computador-monitor',
  name: 'Computador com monitor',
  category: 'eletro',
  w: 62,
  d: 46,
  keywords: ['computador', 'monitor', 'pc', 'teclado', 'mouse', 'escritorio'],
  colors: { main: '#d5d8de', accent: '#1a1e27' },
  colorKeys: [
    { key: 'main', label: 'Corpo', palette: 'metal' },
    { key: 'accent', label: 'Tela', palette: 'paint' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const body = colors.main ?? '#d5d8de';
    const screen = colors.accent ?? '#1a1e27';
    const edge = alpha(INK, 0.45);
    const screenW = Math.min(54, w - 6);
    const screenX = (w - screenW) / 2;

    box(ctx, screenX, 1.1, screenW, 3.5, 0.45, screen, edge, 0.9);
    box(ctx, screenX + 1.1, 1.7, screenW - 2.2, 2.2, 0.25, shade(screen, 0.22), null);
    box(ctx, w / 2 - 1.7, 4.5, 3.4, 6.4, 0.3, shade(body, -0.12), null);
    box(ctx, w / 2 - 9.5, 10.2, 19, 8.2, 3.6, body, edge, 0.85);

    const mouseW = 7.2;
    const gap = 2.4;
    const margin = 2.2;
    const kbW = Math.max(18, w - margin * 2 - mouseW - gap);
    const kbH = Math.min(14, d * 0.32);
    const kbY = d - kbH - 1.6;
    box(ctx, margin, kbY, kbW, kbH, 1.3, body, edge, 0.85);
    const wellX = margin + 1.3;
    const wellY = kbY + 1.2;
    const wellW = kbW - 2.6;
    const wellH = kbH - 3.4;
    const cols = 11;
    const rows = 4;
    const gx = 0.38;
    const gy = 0.34;
    const cw = (wellW - gx * (cols - 1)) / cols;
    const ch = (wellH - gy * (rows - 1)) / rows;
    if (cw > 0.4 && ch > 0.4) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          box(ctx, wellX + c * (cw + gx), wellY + r * (ch + gy), cw, ch, 0.18, shade(screen, 0.18), null);
        }
      }
    }
    box(ctx, margin + kbW + gap, kbY + 1.4, mouseW, kbH - 2.6, 2.6, body, edge, 0.8);
  },
} satisfies FurnitureDef;
