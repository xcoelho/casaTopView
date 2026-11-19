import type { FurnitureDef } from '../types';
import { alpha, box, circle, grain, hatch, line, shade } from '../draw';

function leaves(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  count: number,
  radius: number,
  color: string,
): void {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + 0.4;
    const dist = radius * (0.45 + 0.35 * ((i % 3) / 2));
    const lx = cx + Math.cos(angle) * dist;
    const ly = cy + Math.sin(angle) * dist;
    ctx.beginPath();
    ctx.ellipse(lx, ly, radius * 0.34, radius * 0.17, angle, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? color : shade(color, -0.12);
    ctx.fill();
    ctx.strokeStyle = alpha(shade(color, -0.45), 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export const decoracao: FurnitureDef[] = [
  {
    id: 'tapete',
    name: 'Tapete',
    category: 'decoracao',
    w: 240,
    d: 170,
    keywords: ['tapete', 'sala', 'quarto'],
    flat: true,
    zBias: -4,
    colors: { main: '#dccdb6', accent: '#b99f80' },
    colorKeys: [
      { key: 'main', label: 'Fundo', palette: 'fabric' },
      { key: 'accent', label: 'Borda', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, alpha(colors.main, 0.92), alpha(shade(colors.main, -0.4), 0.55), 1.3);
      box(ctx, 8, 8, w - 16, d - 16, 2, null, alpha(colors.accent, 0.75), 1.4);
      box(ctx, 14, 14, w - 28, d - 28, 2, null, alpha(colors.accent, 0.35), 1);
      for (let i = 1; i < 6; i++) {
        line(ctx, 14, (d / 6) * i, w - 14, (d / 6) * i, alpha(colors.accent, 0.16), 1);
      }
    },
  },
  {
    id: 'tapete-redondo',
    name: 'Tapete redondo',
    category: 'decoracao',
    w: 200,
    d: 200,
    keywords: ['tapete', 'redondo', 'sala', 'quarto'],
    flat: true,
    zBias: -4,
    colors: { main: '#dccdb6', accent: '#b99f80' },
    colorKeys: [
      { key: 'main', label: 'Fundo', palette: 'fabric' },
      { key: 'accent', label: 'Borda', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w, d) / 2 - 1;
      circle(ctx, cx, cy, r, alpha(colors.main, 0.92), alpha(shade(colors.main, -0.4), 0.55), 1.3);
      circle(ctx, cx, cy, r - 8, null, alpha(colors.accent, 0.75), 1.4);
      circle(ctx, cx, cy, r - 14, null, alpha(colors.accent, 0.35), 1);
      for (const rr2 of [r * 0.66, r * 0.44]) {
        circle(ctx, cx, cy, rr2, null, alpha(colors.accent, 0.16), 1);
      }
    },
  },
  {
    id: 'tapete-listrado',
    name: 'Tapete listrado',
    category: 'decoracao',
    w: 240,
    d: 170,
    keywords: ['tapete', 'listrado', 'sala', 'quarto'],
    flat: true,
    zBias: -4,
    colors: { main: '#e6ddcd', accent: '#8f9a76' },
    colorKeys: [
      { key: 'main', label: 'Fundo', palette: 'fabric' },
      { key: 'accent', label: 'Listras', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, alpha(colors.main, 0.92), alpha(shade(colors.main, -0.4), 0.55), 1.3);
      for (let i = 0; i < 7; i++) {
        const y = 14 + i * ((d - 28) / 6);
        line(ctx, 0, y, w, y, alpha(colors.accent, i % 2 ? 0.55 : 0.28), i % 2 ? 5 : 2.5);
      }
      box(ctx, 8, 8, w - 16, d - 16, 2, null, alpha(colors.accent, 0.5), 1.2);
    },
  },
  {
    id: 'tapete-peludo',
    name: 'Tapete peludo',
    category: 'decoracao',
    w: 180,
    d: 130,
    keywords: ['tapete', 'peludo', 'quarto', 'sala'],
    flat: true,
    zBias: -4,
    colors: { main: '#f0e8da', accent: '#cbb79a' },
    colorKeys: [
      { key: 'main', label: 'Fundo', palette: 'fabric' },
      { key: 'accent', label: 'Detalhe', palette: 'fabric' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 6, alpha(colors.main, 0.95), alpha(shade(colors.main, -0.35), 0.5), 1.3);
      hatch(ctx, 2, 2, w - 4, d - 4, alpha(colors.accent, 0.35), 5, 1);
      box(ctx, 10, 10, w - 20, d - 20, 4, null, alpha(colors.accent, 0.6), 1.2);
      circle(ctx, w / 2, d / 2, Math.min(w, d) * 0.2, null, alpha(colors.accent, 0.4), 1);
    },
  },
  {
    id: 'planta-vaso',
    name: 'Planta em vaso',
    category: 'decoracao',
    w: 46,
    d: 46,
    keywords: ['planta', 'vaso', 'decoracao'],
    colors: { main: '#c07f63', accent: '#6f8f5c' },
    colorKeys: [
      { key: 'main', label: 'Vaso', palette: 'stone' },
      { key: 'accent', label: 'Folhas', palette: 'plant' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      circle(ctx, cx, cy, Math.min(w, d) / 2 - 1, colors.main, alpha('#4a3a30', 0.4), 1.4);
      circle(ctx, cx, cy, Math.min(w, d) / 2 - 6, alpha(shade(colors.main, -0.3), 0.5), null);
      leaves(ctx, cx, cy, 7, Math.min(w, d) / 2 - 2, colors.accent);
    },
  },
  {
    id: 'planta-grande',
    name: 'Planta grande',
    category: 'decoracao',
    w: 85,
    d: 85,
    keywords: ['planta', 'vaso', 'grande', 'decoracao'],
    colors: { main: '#8a6142', accent: '#4d6b45' },
    colorKeys: [
      { key: 'main', label: 'Vaso', palette: 'stone' },
      { key: 'accent', label: 'Folhas', palette: 'plant' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      const cy = d / 2;
      circle(ctx, cx, cy, Math.min(w, d) * 0.3, colors.main, alpha('#4a3a30', 0.4), 1.5);
      circle(ctx, cx, cy, Math.min(w, d) * 0.22, alpha(shade(colors.main, -0.25), 0.6), null);
      leaves(ctx, cx, cy, 9, Math.min(w, d) / 2 - 2, colors.accent);
    },
  },
  {
    id: 'luminaria-piso',
    name: 'Luminária de piso',
    category: 'decoracao',
    w: 36,
    d: 36,
    keywords: ['luminaria', 'luz', 'abraçadeira', 'decoracao'],
    flat: true,
    colors: { main: '#e8c98a', accent: '#c2a469' },
    colorKeys: [
      { key: 'main', label: 'Cúpula', palette: 'paint' },
      { key: 'accent', label: 'Base', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      circle(ctx, cx, cx, 5, colors.accent, alpha('#5d4a22', 0.4), 1.2);
      circle(ctx, cx, cx, Math.min(w, d) / 2 - 4, alpha(colors.main, 0.55), alpha(shade(colors.main, -0.4), 0.5), 1.4);
      circle(ctx, cx, cx, Math.min(w, d) / 2 - 10, alpha('#fff6dd', 0.55), null);
    },
  },
  {
    id: 'pendente',
    name: 'Pendente',
    category: 'decoracao',
    w: 42,
    d: 42,
    keywords: ['pendente', 'luminaria', 'teto', 'luz'],
    flat: true,
    zBias: 6,
    colors: { main: '#c2a469' },
    colorKeys: [{ key: 'main', label: 'Acabamento', palette: 'metal' }],
    draw: ({ ctx, w, d, colors }) => {
      const cx = w / 2;
      ctx.save();
      ctx.setLineDash([4, 4]);
      circle(ctx, cx, cx, Math.min(w, d) / 2 - 2, alpha(colors.main, 0.18), alpha(colors.main, 0.7), 1.4);
      ctx.restore();
      circle(ctx, cx, cx, Math.min(w, d) / 2 - 8, alpha('#fff3cf', 0.85), alpha(colors.main, 0.6), 1.2);
      circle(ctx, cx, cx, 2.4, colors.main, null);
    },
  },
  {
    id: 'quadro',
    name: 'Quadro',
    category: 'decoracao',
    w: 90,
    d: 7,
    keywords: ['quadro', 'arte', 'parede', 'decoracao'],
    flat: true,
    zBias: 4,
    colors: { main: '#8a6142', accent: '#c9a86f' },
    colorKeys: [
      { key: 'main', label: 'Moldura', palette: 'wood' },
      { key: 'accent', label: 'Arte', palette: 'paint' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 1.5, colors.main, alpha('#2c2014', 0.4), 1.2);
      box(ctx, 4, 1.8, w - 8, d - 3.6, 0.8, colors.accent, alpha('#2c2014', 0.2), 1);
      line(ctx, 6, d / 2, w * 0.45, d / 2, alpha('#ffffff', 0.35), 1);
    },
  },
  {
    id: 'lareira',
    name: 'Lareira',
    category: 'decoracao',
    w: 120,
    d: 45,
    keywords: ['lareira', 'fogo', 'sala'],
    colors: { main: '#a9a9a4', accent: '#3b3f45' },
    colorKeys: [
      { key: 'main', label: 'Revestimento', palette: 'stone' },
      { key: 'accent', label: 'Boca', palette: 'metal' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 4, colors.main, alpha('#4a4f52', 0.35), 1.4);
      hatch(ctx, 2, 2, w - 4, d - 4, alpha('#4a4f52', 0.1), 9, 1);
      box(ctx, w * 0.2, 10, w * 0.6, d - 16, 3, colors.accent, alpha('#14171b', 0.5), 1.3);
      for (let i = 0; i < 3; i++) {
        line(ctx, w * 0.26 + i * 12, d - 14, w * 0.3 + i * 12, 15, alpha('#d9a13b', 0.55), 2);
      }
    },
  },
  {
    id: 'enfeite-peixes',
    name: 'Enfeite peixes madeira',
    category: 'decoracao',
    w: 120,
    d: 10,
    keywords: ['enfeite', 'parede', 'peixes', 'madeira', 'quadro', 'sala'],
    flat: true,
    zBias: 4,
    colors: { main: '#c19a6b' },
    colorKeys: [{ key: 'main', label: 'Madeira', palette: 'wood' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha('#000000', 0.04), null);
      const fish = (cx: number, cy: number, len: number, flip: boolean) => {
        const dir = flip ? -1 : 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, len / 2, 2.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = colors.main;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - dir * (len / 2), cy);
        ctx.lineTo(cx - dir * (len / 2 + 7), cy - 4.4);
        ctx.lineTo(cx - dir * (len / 2 + 7), cy + 4.4);
        ctx.closePath();
        ctx.fillStyle = shade(colors.main, -0.08);
        ctx.fill();
        grain(ctx, cx - len / 2, cy - 2.6, len, 5.2, colors.main, 6);
      };
      fish(w * 0.32, 3.4, 44, false);
      fish(w * 0.52, 6.6, 30, true);
      fish(w * 0.72, 3.2, 34, false);
    },
  },
  {
    id: 'enfeite-circulos',
    name: 'Enfeite círculos preto',
    category: 'decoracao',
    w: 110,
    d: 10,
    keywords: ['enfeite', 'parede', 'circulos', 'moderno', 'preto', 'abstrato'],
    flat: true,
    zBias: 4,
    colors: { main: '#33373c' },
    colorKeys: [{ key: 'main', label: 'Metal', palette: 'metal' }],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha('#000000', 0.04), null);
      line(ctx, w * 0.32, 1, w * 0.32, d - 1, colors.main, 1.6);
      line(ctx, w * 0.68, 1, w * 0.68, d - 1, colors.main, 1.6);
      circle(ctx, w * 0.32, d / 2, 3.6, null, colors.main, 1.6);
      circle(ctx, w * 0.68, d / 2, 4.4, null, colors.main, 1.8);
      circle(ctx, w * 0.32, 2, 1.2, colors.main, null);
      circle(ctx, w * 0.68, d - 2, 1.2, colors.main, null);
    },
  },
  {
    id: 'divisoria-plantas',
    name: 'Divisória com plantas',
    category: 'decoracao',
    w: 160,
    d: 28,
    keywords: ['divisoria', 'plantas', 'metal', 'sala', 'orquidea', 'verde'],
    colors: { main: '#3b3f45', accent: '#6f8f5c' },
    colorKeys: [
      { key: 'main', label: 'Estrutura', palette: 'metal' },
      { key: 'accent', label: 'Folhagem', palette: 'plant' },
    ],
    draw: ({ ctx, w, d, colors }) => {
      box(ctx, 0, 0, w, d, 2, alpha(colors.main, 0.9), alpha('#14171b', 0.45), 1.6);
      const cols = 4;
      for (let i = 0; i < cols; i++) {
        const x = 4 + i * ((w - 8) / cols);
        line(ctx, x + (w - 8) / cols / 2, 3, x + (w - 8) / cols / 2, d - 3, alpha('#ffffff', 0.14), 1.1);
        circle(ctx, x + (w - 8) / cols / 2, d * 0.62, 4.6, shade(colors.accent, i % 2 ? 0 : -0.12), alpha('#2c3a26', 0.5), 1.2);
        circle(ctx, x + (w - 8) / cols / 2, d * 0.3, 3, alpha('#ffffff', 0.75), null);
      }
      line(ctx, 3, d * 0.78, w - 3, d * 0.78, alpha(colors.main, 0.6), 1.4);
    },
  },
];
