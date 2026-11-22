import type { FurnitureDef } from '../../catalog/types';
import { alpha, circle, shade } from '../../catalog/draw';

const rnd = (i: number): number => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export default {
  id: 'arvore-natal',
  name: 'Árvore de Natal',
  category: 'decoracao',
  w: 120,
  d: 120,
  keywords: ['arvore', 'natal', 'pinheiro', 'decoracao', 'festa'],
  colors: { main: '#2e6b3c', accent: '#c23b3b', metal: '#d9a441' },
  colorKeys: [
    { key: 'main', label: 'Folhagem', palette: 'plant' },
    { key: 'accent', label: 'Enfeites', palette: 'paint' },
    { key: 'metal', label: 'Detalhes', palette: 'metal' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    const cx = w / 2;
    const cy = d / 2;
    const R = Math.min(w, d) / 2 - 2;
    const layers: Array<[number, string]> = [
      [R, colors.main],
      [R * 0.68, shade(colors.main, 0.08)],
      [R * 0.4, shade(colors.main, 0.16)],
    ];
    layers.forEach(([r, fill], li) => {
      circle(ctx, cx, cy, r, fill, alpha('#1d3f26', 0.5));
      const n = 18 - li * 4;
      ctx.strokeStyle = shade(fill, -0.22);
      ctx.lineWidth = 1;
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 + li * 0.35;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * r * 0.55, cy + Math.sin(ang) * r * 0.55);
        ctx.lineTo(cx + Math.cos(ang) * r * 0.97, cy + Math.sin(ang) * r * 0.97);
        ctx.stroke();
      }
    });
    for (let i = 0; i < 12; i++) {
      const ang = rnd(i) * Math.PI * 2;
      const rr = R * (0.3 + rnd(i + 40) * 0.6);
      const fill = i % 3 === 0 ? colors.metal : i % 3 === 1 ? colors.accent : shade(colors.accent, 0.25);
      circle(ctx, cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr, 2.4, fill, alpha('#26160c', 0.4));
    }
    circle(ctx, cx, cy, 3.4, '#f5c542', alpha('#8a5a12', 0.6));
  },
} satisfies FurnitureDef;
