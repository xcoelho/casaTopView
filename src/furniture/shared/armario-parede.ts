import type { DrawArgs } from '../../catalog/types';
import type { ModelBuildContext } from '../../view3d/modelApi';
import { alpha, box, knob, line, shade } from '../../catalog/draw';
import { boxAt } from '../../view3d/modelApi';

/** Armário aéreo de parede: mesma construção para 40, 60, 80 e 120 cm. */
export function drawArmarioParede({ ctx, w, d, colors }: DrawArgs): void {
  const main = colors.main ?? '#f6f3ec';
  const accent = colors.accent ?? '#d7c4a3';
  const doors = Math.max(1, Math.round(w / 40));
  const front = d - Math.min(10, d * 0.34);

  box(ctx, 0, 0, w, d, 1.6, accent, alpha('#5a5346', 0.45), 1.4);
  box(ctx, 1.7, 1.7, w - 3.4, front - 2.5, 0.8, shade(accent, -0.05), alpha('#5a5346', 0.22), 1);
  box(ctx, 1.7, front, w - 3.4, d - front - 1.7, 1, main, alpha('#5a5346', 0.42), 1.2);

  const dw = (w - 3.4) / doors;
  for (let i = 1; i < doors; i++) {
    line(ctx, 1.7 + i * dw, front, 1.7 + i * dw, d - 1.7, alpha('#5a5346', 0.5), 1.3);
  }
  for (let i = 0; i < doors; i++) {
    knob(ctx, 1.7 + dw * (i + 0.5), d - 3, shade(accent, -0.35), 1.2);
  }
  line(ctx, 1.7, front, w - 1.7, front, alpha('#5a5346', 0.35), 1.1);
}

export function buildArmarioParede({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent } = palette;
  const b = d / 2;
  const t = 2.4;

  boxAt(body, w, t, h, 0, -b + t / 2, 0, shade(accent, -0.16), 1, 0, 'paint');
  boxAt(body, w, d, t, 0, 0, 0, accent, 1, 0, 'paint');
  boxAt(body, w, d, t, 0, 0, h - t, accent, 1, 0, 'paint');
  for (const sx of [-1, 1]) {
    boxAt(body, t, d, h, sx * (w / 2 - t / 2), 0, 0, accent, 1, 0, 'paint');
  }
  boxAt(body, w - 2 * t, d - t, 1.8, 0, -t / 2, h / 2, shade(accent, 0.06), 1, 0, 'paint');

  const doors = Math.max(1, Math.round(w / 40));
  const gap = 0.7;
  const dw = (w - gap * (doors + 1)) / doors;
  const handleH = Math.min(14, h * 0.28);

  for (let i = 0; i < doors; i++) {
    const x = -w / 2 + gap + dw / 2 + i * (dw + gap);
    boxAt(body, dw, 1.8, h - 2 * gap, x, b - 0.9, gap, main, 1, 0, 'paint');
    const hx = x + (i % 2 === 0 ? dw / 2 - 2.4 : -dw / 2 + 2.4);
    boxAt(body, 1.4, 2.6, handleH, hx, b + 0.2, h / 2 - handleH / 2, shade(main, -0.5), 1, 0, 'metal');
  }
}
