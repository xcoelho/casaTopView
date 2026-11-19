import type { FurnitureDef } from '../types';
import { alpha, box, glass, line, metalBar } from '../draw';

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
    id: 'porta-pivotante',
    name: 'Porta pivotante com puxador barra',
    category: 'aberturas',
    w: 100,
    d: 15,
    kind: 'opening',
    opening: { kind: 'porta', width: 100 },
    keywords: ['porta', 'pivotante', 'barra', 'entrada', 'hall'],
    draw: ({ ctx, w, d }) => {
      doorSymbol(ctx, w, d, false, false);
      // Puxador barra vertical no vão da porta (metalBar vertical).
      metalBar(ctx, w - 10, d / 2 - 4.5, 3, 9, FRAME, 1.4);
    },
  },
  {
    id: 'porta-vidro',
    name: 'Porta de vidro com puxador',
    category: 'aberturas',
    w: 90,
    d: 15,
    kind: 'opening',
    opening: { kind: 'porta', width: 90 },
    keywords: ['porta', 'vidro', 'divisória', 'escritório', 'cozinha'],
    draw: ({ ctx, w, d }) => {
      doorSymbol(ctx, w, d, false, false);
      // Miolo de vidro azulado sobre a folha e puxador barra curto.
      glass(ctx, 6, d / 2 - 3, w - 12, 6, '#cfe3e8');
      metalBar(ctx, w - 10, d / 2 - 3, 3, 6, FRAME, 1.2);
    },
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
    id: 'janela-cortina',
    name: 'Janela com cortina',
    category: 'aberturas',
    w: 160,
    d: 15,
    kind: 'opening',
    opening: { kind: 'janela', width: 160 },
    keywords: ['janela', 'cortina', 'tecido', 'sala', 'quarto'],
    draw: ({ ctx, w, d }) => {
      windowSymbol(ctx, w, d, 2);
      // Laterais de cortina (faixas verticais)
      box(ctx, 0, 0, 14, d, 0, alpha('#7a5c48', 0.55), alpha('#7a5c48', 0.85), 1);
      box(ctx, w - 14, 0, 14, d, 0, alpha('#7a5c48', 0.55), alpha('#7a5c48', 0.85), 1);
    },
  },
  {
    id: 'janela-banheiro-quadrada',
    name: 'Janela alta de banheiro quadrada',
    category: 'aberturas',
    w: 80,
    d: 15,
    kind: 'opening',
    opening: { kind: 'janela-correr', width: 80 },
    keywords: ['janela', 'banheiro', 'alta', 'ventilação'],
    draw: ({ ctx, w, d }) => {
      windowSymbol(ctx, w, d, 1);
      // Peitoril alto: linha tracejada indica altura (sill elevado, vão curto)
      ctx.save();
      ctx.setLineDash([4, 3]);
      line(ctx, 0, d - 2.5, w, d - 2.5, alpha('#6c7b80', 0.75), 1.2);
      ctx.restore();
    },
  },
  {
    id: 'janela-banheiro-redonda',
    name: 'Janela alta de banheiro redonda',
    category: 'aberturas',
    w: 70,
    d: 15,
    kind: 'opening',
    opening: { kind: 'janela', width: 70 },
    keywords: ['janela', 'banheiro', 'redonda', 'óculo'],
    draw: ({ ctx, w, d }) => {
      const cx = w / 2;
      const cy = d / 2;
      const r = Math.min(w / 2 - 2, 6.5);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
      ctx.fillStyle = alpha('#cfe3e8', 0.7);
      ctx.fill();
      ctx.strokeStyle = WALL;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2, false);
      ctx.strokeStyle = alpha('#6c7b80', 0.5);
      ctx.lineWidth = 1;
      ctx.stroke();
    },
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
