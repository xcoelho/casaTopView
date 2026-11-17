/** Diálogo "Planta de fundo": imagem de referência por baixo do desenho. */
import type { Plan, Underlay } from '../core/document';
import type { Vec2 } from '../core/geometry';
import type { Store } from '../core/store';
import { button, el, numberField, openModal, toggleRow } from './controls';
import type { ModalHandle } from './controls';

export interface UnderlayDeps {
  store: Store;
  notify: (message: string, variant?: 'default' | 'accent') => void;
  getViewSize: () => { width: number; height: number };
  onCalibrate: () => void;
}

const MAX_IMAGE_SIDE = 1800;
const JPEG_QUALITY = 0.82;

interface PickedImage {
  image: string;
  width: number;
  height: number;
}

function pickImageFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null));
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

/** Reduz a imagem antes de guardar: o projeto inteiro vive no armazenamento do navegador. */
function readImageFile(file: File): Promise<PickedImage | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight, 1));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      // JPEG não guarda transparência: fundo branco evita áreas pretas.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve({ image: canvas.toDataURL('image/jpeg', JPEG_QUALITY), width, height });
    });
    img.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      resolve(null);
    });
    img.src = url;
  });
}

/** Coloca a imagem centralizada na vista, com largura proporcional ao palco. */
function placeUnderlay(store: Store, picked: PickedImage, view: { width: number; height: number }): void {
  const hasView = view.width > 0 && view.height > 0;
  const center = hasView ? store.viewCenter(view.width, view.height) : { x: 550, y: 390 };
  const viewW = hasView ? view.width / store.view.zoom : 2000;
  const viewH = hasView ? view.height / store.view.zoom : 1400;

  let width = Math.max(300, Math.min(viewW * 0.7, 1600));
  let height = width * (picked.height / picked.width);
  const limit = viewH * 0.85;
  if (height > limit) {
    const factor = limit / height;
    width *= factor;
    height *= factor;
  }

  const underlay: Underlay = {
    image: picked.image,
    x: center.x - width / 2,
    y: center.y - height / 2,
    w: width,
    h: height,
    rot: 0,
    opacity: 0.5,
    visible: true,
    locked: false,
  };
  store.tx('Imagem de fundo', () => {
    store.doc.underlay = underlay;
  });
}

/** Recalcula a escala da imagem a partir de dois pontos e da medida real em cm. */
export function scaleUnderlayBetween(store: Store, a: Vec2, b: Vec2, realCm: number): boolean {
  const underlay = store.doc.underlay;
  const current = Math.hypot(b.x - a.x, b.y - a.y);
  if (!underlay || current < 0.5 || realCm <= 0) return false;
  const factor = Math.min(20, Math.max(0.05, realCm / current));

  store.tx('Calibrar imagem', () => {
    const cx = underlay.x + underlay.w / 2;
    const cy = underlay.y + underlay.h / 2;
    underlay.w *= factor;
    underlay.h *= factor;
    // Mantém o primeiro ponto clicado no lugar: o desenho já feito não se desloca.
    underlay.x = a.x + (cx - a.x) * factor - underlay.w / 2;
    underlay.y = a.y + (cy - a.y) * factor - underlay.h / 2;
  });
  return true;
}

export function openUnderlayDialog(deps: UnderlayDeps): void {
  const { store, notify } = deps;
  const body = el('div', { class: 'ud-body' });
  let modal: ModalHandle | null = null;

  function group(title: string, ...children: (Node | string)[]): HTMLElement {
    return el('section', { class: 'ud-section' }, el('h3', {}, title), ...children);
  }

  async function chooseImage(): Promise<void> {
    const file = await pickImageFile();
    if (!file) return;
    const picked = await readImageFile(file);
    if (!picked) {
      notify('Não foi possível ler essa imagem — use PNG ou JPG');
      return;
    }
    placeUnderlay(store, picked, deps.getViewSize());
    render();
    notify('Imagem adicionada — calibre a escala para desenhar na medida certa', 'accent');
  }

  function rotate(): void {
    const underlay = store.doc.underlay;
    if (!underlay) return;
    store.tx('Girar imagem', () => {
      underlay.rot = (((underlay.rot + 90) % 360) + 360) % 360;
    });
  }

  function render(): void {
    const underlay = store.doc.underlay;
    body.replaceChildren();

    if (!underlay) {
      body.append(
        group(
          'Sem imagem de fundo',
          el(
            'p',
            { class: 'ud-note' },
            'Importe a foto ou o print de uma planta existente e desenhe por cima. A imagem fica salva junto com o projeto e não sai no PNG exportado.',
          ),
          el(
            'div',
            { class: 'row-actions' },
            button({
              label: 'Escolher imagem',
              icon: 'image',
              variant: 'primary',
              onClick: () => void chooseImage(),
            }),
          ),
        ),
      );
      return;
    }

    const opacity = el('input', {
      type: 'range',
      min: '5',
      max: '100',
      step: '1',
      value: String(Math.round(underlay.opacity * 100)),
    }) as HTMLInputElement;
    const opacityValue = el('span', {}, `${Math.round(underlay.opacity * 100)}%`);
    let opacityBefore: Plan | null = null;

    opacity.addEventListener('input', () => {
      if (!opacityBefore) opacityBefore = store.snapshot();
      underlay.opacity = Number(opacity.value) / 100;
      opacityValue.textContent = `${opacity.value}%`;
      store.emit();
    });
    opacity.addEventListener('change', () => {
      const before = opacityBefore;
      opacityBefore = null;
      if (before) store.commit('Opacidade da imagem', before);
    });

    const ratio = underlay.h / underlay.w;

    body.append(
      group(
        'Imagem',
        el('img', { class: 'ud-preview', src: underlay.image, alt: 'Planta de fundo' }),
        el(
          'div',
          { class: 'row-actions' },
          button({ label: 'Trocar imagem', icon: 'upload', onClick: () => void chooseImage() }),
          button({
            label: 'Girar 90°',
            icon: 'redo',
            disabled: underlay.locked,
            onClick: rotate,
          }),
          button({
            label: 'Calibrar escala',
            icon: 'ruler',
            onClick: () => {
              modal?.close();
              deps.onCalibrate();
            },
          }),
        ),
      ),
      group(
        'Exibição',
        el('div', { class: 'ud-range' }, el('span', {}, 'Opacidade'), opacity, opacityValue),
        toggleRow('Mostrar imagem', underlay.visible, (checked) =>
          store.tx('Imagem visível', () => {
            underlay.visible = checked;
          }),
        ),
        toggleRow('Travar posição', underlay.locked, (checked) => {
          store.tx('Travar imagem', () => {
            underlay.locked = checked;
          });
          render();
        }),
      ),
      group(
        'Posição e escala',
        el(
          'div',
          { class: 'field-row' },
          numberField({
            label: 'X',
            value: Math.round(underlay.x),
            step: 5,
            unit: 'cm',
            disabled: underlay.locked,
            onCommit: (value) =>
              store.tx('Mover imagem', () => {
                underlay.x = value;
              }),
          }),
          numberField({
            label: 'Y',
            value: Math.round(underlay.y),
            step: 5,
            unit: 'cm',
            disabled: underlay.locked,
            onCommit: (value) =>
              store.tx('Mover imagem', () => {
                underlay.y = value;
              }),
          }),
        ),
        numberField({
          label: 'Largura',
          value: Math.round(underlay.w),
          min: 20,
          step: 10,
          unit: 'cm',
          disabled: underlay.locked,
          onCommit: (value) => {
            const width = Math.max(20, value);
            const cx = underlay.x + underlay.w / 2;
            const cy = underlay.y + underlay.h / 2;
            store.tx('Largura da imagem', () => {
              underlay.w = width;
              underlay.h = width * ratio;
              underlay.x = cx - underlay.w / 2;
              underlay.y = cy - underlay.h / 2;
            });
          },
        }),
        el(
          'p',
          { class: 'ud-note' },
          'A calibragem pede dois cliques em pontos da imagem cuja distância real você conhece (por exemplo, uma parede de 3,20 m).',
        ),
      ),
      group(
        'Remover',
        el(
          'div',
          { class: 'row-actions' },
          button({
            label: 'Remover imagem',
            icon: 'trash',
            variant: 'danger',
            onClick: () => {
              store.tx('Remover imagem', () => {
                delete store.doc.underlay;
              });
              render();
              notify('Imagem de fundo removida');
            },
          }),
        ),
      ),
    );
  }

  render();

  modal = openModal({
    title: 'Planta de fundo',
    subtitle: 'Use uma planta existente como referência e desenhe por cima. A imagem fica salva com o projeto.',
    body,
    footer: el(
      'div',
      { class: 'modal-actions' },
      button({ label: 'Fechar', variant: 'ghost', onClick: () => modal?.close() }),
    ),
  });
}
