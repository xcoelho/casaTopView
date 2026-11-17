import type { FurnitureDef } from '../types';
import { alpha, box, line, metalBar } from '../draw';

const WALL = 'rgba(57, 64, 74, 0.55)';
const FRAME = '#7f878e';

/** Símbolo de porta para miniaturas e prévia de arraste. */
function doorSymbol(
  ctx: CanvasRenderingContext2D,
  w: number,
  d: number,
  double: boolean,
  sliding: boolean,
): void {
  const mid = d / 2;
  box(ctx, 0, mid - 3, w, 6, 0, alpha('#39404a', 0.1), null);
  line(ctx, 0, mid - 4, 0, mid + 4, WALL, 2);
  line(ctx, w, mid - 4, w, mid + 4, WALL, 2);
  if (sliding) {
    metalBar(ctx, 3, mid - 5, w * 0.58, 3, FRAME, 1);
    metalBar(ctx, w * 0.4, mid + 1, w * 0.58, 3, FRAME, 1);
    return;
  }
  const leaf = double ? w / 2 : w;
  const hingeX = 0;
  ctx.save();
  ctx.strokeStyle = alpha('#39404a', 0.75);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(hingeX, mid);
  ctx.lineTo(hingeX, mid - leaf);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(hingeX, mid, leaf, -Math.PI / 2, 0, false);
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = alpha('#39404a', 0.4);
  ctx.stroke();
  ctx.restore();
  if (double) {
    ctx.save();
    ctx.strokeStyle = alpha('#39404a', 0.75);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(w, mid);
    ctx.lineTo(w, mid - leaf);
    ctx.stroke();
    ctx.restore();
  }
}

function windowSymbol(ctx: CanvasRenderingContext2D, w: number, d: number, panes: number): void {
  const mid = d / 2;
  box(ctx, 0, mid - 4, w, 8, 0, alpha('#cfe3e8', 0.7), WALL, 1.4);
  for (let i = 1; i <= panes; i++) {
    line(ctx, (w / (panes + 1)) * i, mid - 4, (w / (panes + 1)) * i, mid + 4, alpha('#6c7b80', 0.6), 1.2);
  }
  line(ctx, 0, mid, w, mid, alpha('#6c7b80', 0.35), 1);
}

export const aberturas: FurnitureDef[] = [
  {
    id: 'porta-simples',
    name: 'Porta simples',
    category: 'aberturas',
    w: 80,
    d: 15,
    kind: 'opening',
    opening: { kind: 'porta', width: 80 },
    keywords: ['porta', 'abertura'],
    draw: ({ ctx, w, d }) => doorSymbol(ctx, w, d, false, false),
  },
  {
    id: 'porta-dupla',
    name: 'Porta dupla',
    category: 'aberturas',
    w: 150,
    d: 15,
    kind: 'opening',
    opening: { kind: 'porta-dupla', width: 150 },
    keywords: ['porta', 'dupla', 'abertura'],
    draw: ({ ctx, w, d }) => doorSymbol(ctx, w, d, true, false),
  },
  {
    id: 'porta-correr',
    name: 'Porta de correr',
    category: 'aberturas',
    w: 160,
    d: 15,
    kind: 'opening',
    opening: { kind: 'porta-correr', width: 160 },
    keywords: ['porta', 'correr', 'deslizante'],
    draw: ({ ctx, w, d }) => doorSymbol(ctx, w, d, false, true),
  },
  {
    id: 'porta-garagem',
    name: 'Porta de garagem',
    category: 'aberturas',
    w: 300,
    d: 15,
    kind: 'opening',
    opening: { kind: 'porta-garagem', width: 300 },
    keywords: ['porta', 'garagem', 'carro'],
    draw: ({ ctx, w, d }) => {
      const mid = d / 2;
      box(ctx, 0, mid - 4, w, 8, 0, alpha('#39404a', 0.12), WALL, 1.4);
      for (let i = 1; i < 5; i++) {
        line(ctx, 3, mid - 4 + (8 / 5) * i, w - 3, mid - 4 + (8 / 5) * i, alpha('#39404a', 0.4), 1);
      }
    },
  },
  {
    id: 'janela',
    name: 'Janela',
    category: 'aberturas',
    w: 120,
    d: 15,
    kind: 'opening',
    opening: { kind: 'janela', width: 120 },
    keywords: ['janela', 'vidro', 'abertura'],
    draw: ({ ctx, w, d }) => windowSymbol(ctx, w, d, 2),
  },
  {
    id: 'janela-correr',
    name: 'Janela de correr',
    category: 'aberturas',
    w: 200,
    d: 15,
    kind: 'opening',
    opening: { kind: 'janela-correr', width: 200 },
    keywords: ['janela', 'correr', 'vidro'],
    draw: ({ ctx, w, d }) => windowSymbol(ctx, w, d, 3),
  },
  {
    id: 'janela-grande',
    name: 'Janela ampla',
    category: 'aberturas',
    w: 260,
    d: 15,
    kind: 'opening',
    opening: { kind: 'janela', width: 260 },
    keywords: ['janela', 'ampla', 'vidro', 'varanda'],
    draw: ({ ctx, w, d }) => windowSymbol(ctx, w, d, 4),
  },
  {
    id: 'vao',
    name: 'Vão livre',
    category: 'aberturas',
    w: 200,
    d: 15,
    kind: 'opening',
    opening: { kind: 'vao', width: 200 },
    keywords: ['vao', 'passagem', 'arco', 'abertura'],
    draw: ({ ctx, w, d }) => {
      const mid = d / 2;
      line(ctx, 0, mid - 3, w, mid - 3, alpha('#39404a', 0.35), 1.2);
      line(ctx, 0, mid + 3, w, mid + 3, alpha('#39404a', 0.35), 1.2);
      line(ctx, 2, mid, w - 2, mid, alpha('#39404a', 0.18), 1);
    },
  },
];
