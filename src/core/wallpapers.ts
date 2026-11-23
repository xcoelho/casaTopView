/**
 * Papéis de parede procedurais: cada preset desenha uma repetição contínua.
 * A mesma função alimenta as miniaturas, a planta 2D e a textura 3D.
 */
export interface WallpaperPreset {
  id: string;
  name: string;
  /** Descrição curta usada em tooltips e legendas. */
  note: string;
  base: string;
  accent: string;
  soft: string;
  deep: string;
  /** Largura física de uma repetição, em centímetros. */
  tileCm: number;
  drawTile: (ctx: CanvasRenderingContext2D, size: number) => void;
}

function rgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((char) => char + char)
          .join('')
      : clean;
  const value = Number.parseInt(full, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function fill(ctx: CanvasRenderingContext2D, size: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
}

/** Trama fina de papel/tecido, com passo proporcional ao tamanho. */
function weave(ctx: CanvasRenderingContext2D, size: number, preset: WallpaperPreset, strength = 1): void {
  const step = Math.max(2, Math.round(size / 56));
  ctx.save();
  ctx.globalAlpha = strength;
  for (let y = 0; y < size; y += step) {
    ctx.fillStyle = rgba(preset.soft, 0.12);
    ctx.fillRect(0, y, size, Math.max(0.5, size / 1024));
  }
  for (let x = 0; x < size; x += step * 2) {
    ctx.fillStyle = rgba(preset.accent, 0.07);
    ctx.fillRect(x, 0, Math.max(0.5, size / 1024), size);
  }
  ctx.restore();
}

function speckles(
  ctx: CanvasRenderingContext2D,
  size: number,
  preset: WallpaperPreset,
  seed: number,
  count: number,
  opacity = 0.12,
): void {
  const rand = seeded(seed);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const width = size * (0.004 + rand() * 0.018);
    const height = Math.max(0.5, size * (0.0015 + rand() * 0.005));
    ctx.fillStyle = rgba(rand() > 0.45 ? preset.deep : preset.soft, opacity * (0.4 + rand() * 0.8));
    ctx.fillRect(x, y, width, height);
    if (x + width > size) ctx.fillRect(x - size, y, width, height);
  }
  ctx.restore();
}

/* ---------------- Linho ---------------- */

const linho: WallpaperPreset = {
  id: 'linho',
  name: 'Linho cru',
  note: 'trama natural',
  base: '#e9e1d3',
  accent: '#c8b9a4',
  soft: '#f7f1e6',
  deep: '#b4a38d',
  tileCm: 18,
  drawTile: (ctx, size) => {
    fill(ctx, size, '#e9e1d3');
    weave(ctx, size, linho, 1.45);
    // Fios horizontais mais largos: a trama precisa aparecer mesmo em amostra.
    const thread = Math.max(2, Math.round(size / 48));
    for (let y = 0; y < size; y += thread) {
      ctx.fillStyle = rgba(linho.soft, 0.4);
      ctx.fillRect(0, y, size, Math.max(0.8, size / 680));
    }
    for (let x = 0; x < size; x += Math.round(thread * 1.6)) {
      ctx.fillStyle = rgba(linho.accent, 0.16);
      ctx.fillRect(x, 0, Math.max(0.7, size / 850), size);
    }
    speckles(ctx, size, linho, 7, Math.round(size * 0.5), 0.2);
    // Pequenos fios claros dão o brilho irregular do linho.
    const rand = seeded(91);
    for (let i = 0; i < Math.round(size * 0.2); i++) {
      const x = rand() * size;
      const y = rand() * size;
      const length = size * (0.01 + rand() * 0.04);
      ctx.fillStyle = rgba(linho.soft, 0.32 + rand() * 0.24);
      ctx.fillRect(x, y, length, Math.max(0.5, size / 900));
      if (x + length > size) ctx.fillRect(x - size, y, length, Math.max(0.5, size / 900));
    }
  },
};

/* ---------------- Jardim secreto ---------------- */

function leaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  fillColor: string,
  veinColor: string,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(length * 0.28, -width, length * 0.76, -width * 0.82, length, 0);
  ctx.bezierCurveTo(length * 0.76, width * 0.82, length * 0.28, width, 0, 0);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = Math.max(0.5, length * 0.028);
  ctx.beginPath();
  ctx.moveTo(length * 0.06, 0);
  ctx.quadraticCurveTo(length * 0.48, -width * 0.08, length * 0.92, 0);
  ctx.stroke();
  ctx.restore();
}

function sprig(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  preset: WallpaperPreset,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const stem = scale;
  ctx.strokeStyle = rgba(preset.deep, 0.68);
  ctx.lineWidth = Math.max(0.7, scale * 0.011);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(scale * 0.09, -stem * 0.3, -scale * 0.08, -stem * 0.68, scale * 0.025, -stem);
  ctx.stroke();

  for (let i = 0; i < 5; i++) {
    const t = 0.17 + i * 0.16;
    const px = Math.sin(t * Math.PI * 1.2) * scale * 0.045;
    const py = -stem * t;
    const side = i % 2 === 0 ? 1 : -1;
    const length = scale * (0.255 + (i % 3) * 0.038);
    leaf(
      ctx,
      px,
      py,
      side * (0.95 - t * 0.22),
      length,
      length * 0.42,
      rgba(preset.accent, 0.72 + (i % 2) * 0.08),
      rgba(preset.deep, 0.48),
    );
    if (i % 2 === 1) {
      ctx.beginPath();
      ctx.arc(px + side * scale * 0.045, py + scale * 0.018, Math.max(0.7, scale * 0.018), 0, Math.PI * 2);
      ctx.fillStyle = rgba(preset.deep, 0.4);
      ctx.fill();
    }
  }

  leaf(ctx, scale * 0.02, -stem, -0.42, scale * 0.2, scale * 0.07, rgba(preset.accent, 0.78), rgba(preset.deep, 0.48));
  leaf(ctx, scale * 0.025, -stem * 0.96, 0.48, scale * 0.16, scale * 0.058, rgba(preset.soft, 0.9), rgba(preset.deep, 0.38));
  ctx.restore();
}

const jardim: WallpaperPreset = {
  id: 'jardim',
  name: 'Jardim secreto',
  note: 'folhagem suave',
  base: '#dfe7dc',
  accent: '#7f9679',
  soft: '#f2f5ea',
  deep: '#5d7258',
  tileCm: 64,
  drawTile: (ctx, size) => {
    fill(ctx, size, '#dfe7dc');
    weave(ctx, size, jardim, 0.5);
    speckles(ctx, size, jardim, 33, Math.round(size * 0.22), 0.09);
    for (const x of [size * 0.3, size * 0.8]) {
      for (const y of [size * 0.38, size * 0.88]) {
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            sprig(ctx, x + ox * size, y + oy * size, -0.28, size * 0.37, jardim);
          }
        }
      }
    }
    // Pequenos pontos de luz entre as folhas.
    const rand = seeded(18);
    for (let i = 0; i < Math.round(size * 0.09); i++) {
      ctx.beginPath();
      ctx.arc(rand() * size, rand() * size, Math.max(0.5, size * 0.003), 0, Math.PI * 2);
      ctx.fillStyle = rgba(jardim.soft, 0.55);
      ctx.fill();
    }
  },
};

/* ---------------- Damask areia ---------------- */

function damaskMotif(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  preset: WallpaperPreset,
  size: number,
): void {
  const line = Math.max(0.55, size / 760);
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(radius * 0.24, -radius * 0.18, radius * 0.22, -radius * 0.7, 0, -radius);
    ctx.bezierCurveTo(-radius * 0.22, -radius * 0.7, -radius * 0.24, -radius * 0.18, 0, 0);
    ctx.closePath();
    ctx.fillStyle = rgba(preset.accent, 0.16);
    ctx.fill();
    ctx.strokeStyle = rgba(preset.accent, 0.72);
    ctx.lineWidth = line * 1.35;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.08);
    ctx.quadraticCurveTo(radius * 0.06, -radius * 0.35, 0, -radius * 0.7);
    ctx.strokeStyle = rgba(preset.deep, 0.2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.rotate(Math.PI / 4);
  const diamond = radius * 0.28;
  ctx.fillStyle = rgba(preset.accent, 0.48);
  ctx.fillRect(-diamond / 2, -diamond / 2, diamond, diamond);
  ctx.strokeStyle = rgba(preset.deep, 0.5);
  ctx.lineWidth = line * 1.35;
  ctx.strokeRect(-diamond / 2, -diamond / 2, diamond, diamond);
  ctx.restore();

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + Math.PI / 8;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * radius * 1.08, Math.sin(angle) * radius * 1.08, Math.max(0.6, radius * 0.035), 0, Math.PI * 2);
    ctx.fillStyle = rgba(preset.accent, 0.42);
    ctx.fill();
  }
  ctx.restore();
}

const damask: WallpaperPreset = {
  id: 'damask',
  name: 'Damask areia',
  note: 'ornamento clássico',
  base: '#efe7db',
  accent: '#c4ad8f',
  soft: '#f9f3e9',
  deep: '#a58b6a',
  tileCm: 56,
  drawTile: (ctx, size) => {
    fill(ctx, size, '#efe7db');
    weave(ctx, size, damask, 0.55);
    speckles(ctx, size, damask, 12, Math.round(size * 0.12), 0.06);
    damaskMotif(ctx, size / 2, size / 2, size * 0.265, damask, size);
    for (const x of [0, size]) {
      for (const y of [0, size]) {
        damaskMotif(ctx, x, y, size * 0.145, damask, size);
      }
    }
    const line = Math.max(0.5, size / 1100);
    ctx.strokeStyle = rgba(damask.accent, 0.12);
    ctx.lineWidth = line;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo((size / 4) * i, 0);
      ctx.lineTo(0, (size / 4) * i);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(size, (size / 4) * i);
      ctx.lineTo((size / 4) * i, size);
      ctx.stroke();
    }
  },
};

/* ---------------- Terracota listrada ---------------- */

const terracota: WallpaperPreset = {
  id: 'terracota',
  name: 'Terracota listrada',
  note: 'listras quentes',
  base: '#c99a80',
  accent: '#a96f54',
  soft: '#e8c6b2',
  deep: '#8e5a43',
  tileCm: 40,
  drawTile: (ctx, size) => {
    fill(ctx, size, '#c99a80');
    ctx.fillStyle = rgba(terracota.soft, 0.32);
    ctx.fillRect(size * 0.06, 0, size * 0.14, size);
    ctx.fillRect(size * 0.56, 0, size * 0.14, size);
    ctx.fillStyle = rgba(terracota.accent, 0.16);
    ctx.fillRect(size * 0.4, 0, size * 0.055, size);
    ctx.fillRect(size * 0.88, 0, size * 0.04, size);
    for (const x of [0.025, 0.26, 0.38, 0.78, 0.98]) {
      ctx.fillStyle = rgba(terracota.soft, 0.58);
      ctx.fillRect(size * x, 0, Math.max(0.6, size / 700), size);
    }
    weave(ctx, size, terracota, 1.15);
    speckles(ctx, size, terracota, 66, Math.round(size * 0.28), 0.1);
  },
};

/* ---------------- Céu art déco ---------------- */

function decoFan(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  preset: WallpaperPreset,
  size: number,
): void {
  const line = Math.max(0.9, size / 520);
  ctx.save();
  ctx.translate(cx, cy);
  // Setores preenchidos dão massa ao leque quando a textura é reduzida na vista 3D.
  for (let i = 0; i < 12; i += 2) {
    const a0 = Math.PI + (i / 12) * Math.PI;
    const a1 = Math.PI + ((i + 1) / 12) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, a0, a1);
    ctx.closePath();
    ctx.fillStyle = rgba(preset.accent, 0.07);
    ctx.fill();
  }
  for (let i = 0; i <= 12; i++) {
    const angle = Math.PI + (i / 12) * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x, y);
    ctx.strokeStyle = rgba(preset.accent, i === 6 ? 0.88 : 0.44);
    ctx.lineWidth = i === 6 ? line * 2.1 : line * 1.4;
    ctx.stroke();
    if (i > 0 && i < 12 && i % 2 === 0) {
      const bx = Math.cos(angle) * radius * 0.93;
      const by = Math.sin(angle) * radius * 0.93;
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(angle);
      ctx.fillStyle = rgba(preset.soft, 0.78);
      ctx.fillRect(-line * 2.2, -line * 2.2, line * 4.4, line * 4.4);
      ctx.restore();
    }
  }
  for (const fraction of [0.36, 0.68, 1]) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * fraction, Math.PI, Math.PI * 2);
    ctx.strokeStyle = rgba(preset.accent, fraction === 1 ? 0.68 : 0.36);
    ctx.lineWidth = fraction === 1 ? line * 1.8 : line * 1.2;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.strokeStyle = rgba(preset.soft, 0.55);
  ctx.lineWidth = line * 1.3;
  ctx.stroke();
  ctx.restore();
}

const artDeco: WallpaperPreset = {
  id: 'art-deco',
  name: 'Céu art déco',
  note: 'leque dourado',
  base: '#203744',
  accent: '#c9a45f',
  soft: '#e8cf99',
  deep: '#13252f',
  tileCm: 48,
  drawTile: (ctx, size) => {
    fill(ctx, size, '#203744');
    const glow = ctx.createLinearGradient(0, 0, 0, size);
    glow.addColorStop(0, rgba(artDeco.accent, 0.05));
    glow.addColorStop(0.65, rgba(artDeco.deep, 0));
    glow.addColorStop(1, rgba(artDeco.deep, 0.22));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    const line = Math.max(0.9, size / 720);
    ctx.strokeStyle = rgba(artDeco.accent, 0.22);
    ctx.lineWidth = line;
    for (const x of [size * 0.035, size * 0.965]) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    decoFan(ctx, size / 2, size * 0.84, size * 0.36, artDeco, size);

    // Diamante suspenso acima do leque.
    ctx.save();
    ctx.translate(size / 2, size * 0.22);
    ctx.rotate(Math.PI / 4);
    const d = size * 0.062;
    ctx.fillStyle = rgba(artDeco.accent, 0.38);
    ctx.fillRect(-d / 2, -d / 2, d, d);
    ctx.strokeStyle = rgba(artDeco.soft, 0.68);
    ctx.lineWidth = line * 1.6;
    ctx.strokeRect(-d / 2, -d / 2, d, d);
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(size / 2, size * 0.28);
    ctx.lineTo(size / 2, size * 0.48);
    ctx.strokeStyle = rgba(artDeco.accent, 0.24);
    ctx.stroke();

    speckles(ctx, size, artDeco, 5, Math.round(size * 0.08), 0.06);
  },
};

/* ---------------- Mármore suave ---------------- */

/** Veio diagonal contínuo: inclinação de 45° e onda inteira para repetir sem emenda. */
function marbleVein(
  ctx: CanvasRenderingContext2D,
  size: number,
  offset: number,
  amplitude: number,
  frequency: number,
  phase: number,
  width: number,
  color: string,
  opacity: number,
): void {
  const segments: Array<Array<[number, number]>> = [];
  let current: Array<[number, number]> = [];
  let previous: number | null = null;

  for (let x = 0; x <= size; x += 2) {
    const t = x / size;
    const raw =
      offset +
      x +
      Math.sin(t * Math.PI * 2 * frequency + phase) * amplitude +
      Math.sin(t * Math.PI * 4 * frequency + phase * 1.35) * amplitude * 0.28 +
      Math.sin(t * Math.PI * 10 + phase * 0.6) * amplitude * 0.07;
    const y = ((raw % size) + size) % size;
    if (previous !== null && Math.abs(y - previous) > size / 2) {
      if (current.length > 1) segments.push(current);
      current = [];
    }
    current.push([x, y]);
    previous = y;
  }
  if (current.length > 1) segments.push(current);

  ctx.save();
  ctx.strokeStyle = rgba(color, opacity);
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const segment of segments) {
    ctx.beginPath();
    segment.forEach(([x, y], index) => {
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  ctx.restore();
}

/** Ramificação curta para quebrar a leitura de veios paralelos. */
function marbleBranch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  dy: number,
  width: number,
  color: string,
  opacity: number,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + dx * 0.28, y + dy * 0.15, x + dx * 0.62, y + dy * 0.72, x + dx, y + dy);
  ctx.strokeStyle = rgba(color, opacity);
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();
}

const marmore: WallpaperPreset = {
  id: 'marmore',
  name: 'Mármore suave',
  note: 'veios de gesso',
  base: '#eae5dc',
  accent: '#b2aba0',
  soft: '#f7f3ec',
  deep: '#8b857c',
  tileCm: 72,
  drawTile: (ctx, size) => {
    fill(ctx, size, '#eae5dc');
    const rand = seeded(204);
    for (let i = 0; i < 10; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const radius = size * (0.08 + rand() * 0.2);
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, radius);
      cloud.addColorStop(0, rgba(i % 3 === 0 ? marmore.accent : marmore.soft, i % 3 === 0 ? 0.1 : 0.26));
      cloud.addColorStop(1, rgba(i % 3 === 0 ? marmore.accent : marmore.soft, 0));
      ctx.fillStyle = cloud;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    // Dois veios principais: halo largo + núcleo fino, com espaçamento irregular.
    marbleVein(ctx, size, size * 0.1, size * 0.06, 2, 0.4, Math.max(1.2, size * 0.012), marmore.accent, 0.22);
    marbleVein(ctx, size, size * 0.13, size * 0.05, 2, 0.5, Math.max(0.7, size * 0.0038), marmore.deep, 0.4);
    marbleVein(ctx, size, size * 0.55, size * 0.08, 3, 1.8, Math.max(0.9, size * 0.007), marmore.accent, 0.2);
    marbleVein(ctx, size, size * 0.58, size * 0.06, 3, 1.95, Math.max(0.6, size * 0.0028), marmore.deep, 0.34);
    // Veios finos independentes, inclusive um claro para dar profundidade.
    marbleVein(ctx, size, size * 0.36, size * 0.032, 4, 0.75, Math.max(0.5, size * 0.0022), marmore.accent, 0.3);
    marbleVein(ctx, size, size * 0.74, size * 0.05, 2, 2.6, Math.max(0.5, size * 0.003), marmore.deep, 0.25);
    marbleVein(ctx, size, size * 0.86, size * 0.04, 1, 3.2, Math.max(0.6, size * 0.005), marmore.soft, 0.55);

    // Um segundo sentido de veio, mais tênue, cria o cruzamento típico da pedra.
    ctx.save();
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    marbleVein(ctx, size, size * 0.3, size * 0.035, 2, 1.25, Math.max(0.5, size * 0.0026), marmore.accent, 0.24);
    marbleVein(ctx, size, size * 0.7, size * 0.028, 3, 2.45, Math.max(0.5, size * 0.002), marmore.deep, 0.2);
    ctx.restore();

    // Pequenas ramificações tornam os veios menos regulares.
    marbleBranch(ctx, size * 0.28, size * 0.2, size * 0.16, size * 0.07, Math.max(0.5, size * 0.0022), marmore.accent, 0.28);
    marbleBranch(ctx, size * 0.66, size * 0.46, size * 0.13, size * 0.09, Math.max(0.5, size * 0.002), marmore.deep, 0.24);
    marbleBranch(ctx, size * 0.22, size * 0.72, size * 0.1, size * 0.05, Math.max(0.5, size * 0.0018), marmore.accent, 0.22);
    speckles(ctx, size, marmore, 88, Math.round(size * 0.18), 0.05);
  },
};

export const WALLPAPERS: WallpaperPreset[] = [linho, jardim, damask, terracota, artDeco, marmore];

const byId = new Map(WALLPAPERS.map((preset) => [preset.id, preset]));

export function getWallpaper(id?: string | null): WallpaperPreset | undefined {
  return id ? byId.get(id) : undefined;
}
