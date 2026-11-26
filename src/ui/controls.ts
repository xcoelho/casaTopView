/** Componentes reutilizáveis de interface. */
import { parseNumber } from '../core/units';
import type { SwatchOption } from '../catalog/draw';

const SVG_NS = 'http://www.w3.org/2000/svg';

const ICONS: Record<string, string> = {
  select: '<path d="M5 3.5 18.5 12l-6.4 1.4L9.7 20z"/>',
  wall: '<path d="M3 7h18M3 17h18M8 7v10M16 7v10"/>',
  room: '<path d="M4 5h16v14H4z"/><path d="M10 5v14"/>',
  door: '<path d="M7 20V4h10v16"/><path d="M17 20a10 10 0 0 0-10-10"/>',
  window: '<path d="M4 6h16v12H4z"/><path d="M12 6v12M4 12h16"/>',
  ruler: '<path d="M3 15 9 21 21 9 15 3z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M20 20v-6a5 5 0 0 0-5-5H4"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M4 20v-6a5 5 0 0 1 5-5h11"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  upload: '<path d="M12 20V8M7 13l5-5 5 5"/><path d="M4 4h16"/>',
  image: '<path d="M4 5h16v14H4z"/><circle cx="9" cy="10" r="1.6"/><path d="m5 18 5-5 4 4 3-3 3 3"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.6 2.6 0 1 1 3.6 2.4c-.8.4-1.1.9-1.1 1.8"/><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/>',
  grid: '<path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  magnet: '<path d="M6 4v7a6 6 0 0 0 12 0V4h-4v7a2 2 0 0 1-4 0V4z"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  lock: '<path d="M6 11h12v9H6z"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  front: '<path d="M12 3v10M8 7l4-4 4 4"/><path d="M4 15v5h16v-5"/>',
  back: '<path d="M12 21V11M8 17l4 4 4-4"/><path d="M4 4h16v5"/>',
  zoomIn: '<circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M16.5 16.5 21 21"/>',
  zoomOut: '<circle cx="11" cy="11" r="7"/><path d="M8 11h6M16.5 16.5 21 21"/>',
  fit: '<path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5"/>',
  expand: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  copy: '<path d="M9 9h11v11H9z"/><path d="M15 5H4v11"/>',
  plan: '<path d="M4 5h16v14H4z"/><path d="M4 12h8M12.5 5v14"/>',
  panelRight: '<path d="M4 5h16v14H4z"/><path d="M14.5 5v14"/>',
  panelLeft: '<path d="M4 5h16v14H4z"/><path d="M9.5 5v14"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  sparkles: '<path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z"/><path d="M18 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
};

export function icon(name: string, size = 18): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name] ?? '';
  return svg;
}

type Attrs = Record<string, unknown>;
type Child = Node | string | number | null | undefined | false;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'dataset') Object.assign(node.dataset, value as Record<string, string>);
    else if (key === 'style') Object.assign(node.style, value as Partial<CSSStyleDeclaration>);
    else if (key === 'text') node.textContent = String(value);
    else if (key === 'html') node.innerHTML = String(value);
    else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === 'string' || typeof child === 'number' ? document.createTextNode(String(child)) : child);
  }
  return node;
}

export interface ButtonOptions {
  label?: string;
  icon?: string;
  title?: string;
  variant?: string;
  className?: string;
  badge?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function button(opts: ButtonOptions): HTMLButtonElement {
  const classes = ['btn'];
  if (opts.variant) classes.push(...opts.variant.split(' '));
  if (opts.className) classes.push(opts.className);
  const node = el('button', {
    class: classes.join(' '),
    type: 'button',
    title: opts.title ?? opts.label ?? '',
  });
  if (opts.icon) node.append(icon(opts.icon, 17));
  if (opts.label) node.append(el('span', {}, opts.label));
  if (opts.badge) node.append(el('span', { class: 'badge' }, opts.badge));
  if (opts.disabled) node.disabled = true;
  if (opts.onClick) node.addEventListener('click', opts.onClick);
  return node;
}

export function section(title: string, ...children: Child[]): HTMLElement {
  return el('section', { class: 'insp-section' }, el('h3', {}, title), ...children);
}

export function field(label: string, control: Node): HTMLElement {
  return el('div', { class: 'field' }, el('span', { class: 'field-label' }, label), control);
}

export interface NumberFieldOptions {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  onCommit: (value: number) => void;
}

export function numberField(opts: NumberFieldOptions): HTMLElement {
  const input = el('input', {
    type: 'number',
    step: opts.step ?? 1,
    value: String(Math.round(opts.value * 100) / 100),
    disabled: opts.disabled,
  }) as HTMLInputElement;
  const commit = (): void => {
    const parsed = parseNumber(input.value, opts.value);
    let next = parsed;
    if (opts.min !== undefined) next = Math.max(opts.min, next);
    if (opts.max !== undefined) next = Math.min(opts.max, next);
    opts.onCommit(next);
  };
  input.addEventListener('change', commit);
  input.addEventListener('keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Enter') input.blur();
  });
  const box = el('div', { class: 'input' }, input);
  if (opts.unit) box.append(el('span', { class: 'unit' }, opts.unit));
  return el('div', { class: 'field' }, el('span', { class: 'field-label' }, opts.label), box);
}

export interface TextFieldOptions {
  label: string;
  value: string;
  placeholder?: string;
  onCommit: (value: string) => void;
}

export function textField(opts: TextFieldOptions): HTMLElement {
  const input = el('input', {
    type: 'text',
    value: opts.value,
    placeholder: opts.placeholder ?? '',
  }) as HTMLInputElement;
  input.addEventListener('change', () => opts.onCommit(input.value.trim()));
  input.addEventListener('keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Enter') input.blur();
  });
  return el('div', { class: 'field' }, el('span', { class: 'field-label' }, opts.label), el('div', { class: 'input' }, input));
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldOptions {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function selectField(opts: SelectFieldOptions): HTMLElement {
  const select = el('select', { class: 'input' }) as HTMLSelectElement;
  for (const option of opts.options) {
    const node = el('option', { value: option.value, selected: option.value === opts.value }, option.label);
    select.append(node);
  }
  select.value = opts.value;
  select.addEventListener('change', () => opts.onChange(select.value));
  return el('div', { class: 'field' }, el('span', { class: 'field-label' }, opts.label), select);
}

export function readOnlyRow(label: string, value: string): HTMLElement {
  return el(
    'div',
    { class: 'kbd-row' },
    el('span', {}, label),
    el('span', {}, el('b', { style: { fontWeight: '600', color: 'var(--ink)' } }, value)),
  );
}

export function swatchField(
  label: string,
  options: SwatchOption[],
  value: string,
  onChange: (value: string) => void,
): HTMLElement {
  const row = el('div', { class: 'swatches' });
  for (const option of options) {
    const swatch = el('button', {
      class: `swatch${option.value === value ? ' active' : ''}`,
      type: 'button',
      title: option.name,
      style: { background: option.value },
      onClick: () => onChange(option.value),
    });
    row.append(swatch);
  }
  return el('div', { class: 'field' }, el('span', { class: 'swatch-label' }, label), row);
}

export function toggleRow(label: string, checked: boolean, onChange: (value: boolean) => void): HTMLElement {
  const input = el('input', { type: 'checkbox' }) as HTMLInputElement;
  input.checked = checked;
  input.addEventListener('change', () => onChange(input.checked));
  return el('label', { class: 'toggle-row' }, input, el('span', {}, label));
}

export interface ModalOptions {
  title: string;
  subtitle?: string;
  body: Node;
  footer?: Node;
  narrow?: boolean;
  onClose?: () => void;
}

export interface ModalHandle {
  root: HTMLElement;
  close: () => void;
}

export function openModal(opts: ModalOptions): ModalHandle {
  const close = (): void => {
    root.remove();
    document.removeEventListener('keydown', onKey);
    opts.onClose?.();
  };
  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
    }
  };

  const closeButton = button({
    icon: 'close',
    variant: 'ghost icon',
    title: 'Fechar',
    onClick: close,
  });

  const modal = el(
    'div',
    { class: `modal${opts.narrow ? ' narrow' : ''}`, role: 'dialog', 'aria-modal': 'true' },
    el(
      'div',
      { class: 'modal-head' },
      el(
        'div',
        {},
        el('h2', {}, opts.title),
        opts.subtitle ? el('p', {}, opts.subtitle) : null,
      ),
      closeButton,
    ),
    el('div', { class: 'modal-body' }, opts.body),
    opts.footer ? el('div', { class: 'modal-foot' }, opts.footer) : null,
  );

  const root = el('div', {
    class: 'modal-backdrop',
    onClick: (event: MouseEvent) => {
      if (event.target === root) close();
    },
  }, modal);

  document.body.append(root);
  document.addEventListener('keydown', onKey);
  return { root, close };
}
