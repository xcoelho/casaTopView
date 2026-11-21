/** Picking de clique 3D: raycast sobre grupos de móveis e seleção via store. */
import * as THREE from 'three';
import type { Plan } from '../core/document';
import type { Store } from '../core/store';
import { clampElevation, isElevatable, itemHeight, itemElevation } from './furniture';

export interface AttachItemPickingOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  groups: () => Map<string, THREE.Group>;
  store: Store;
}

function pickGroup(
  event: { clientX: number; clientY: number },
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  groups: Map<string, THREE.Group>,
): THREE.Group | null {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const pointer = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...groups.values()], true);
  for (const hit of hits) {
    let obj: THREE.Object3D | null = hit.object;
    while (obj) {
      if (typeof obj.userData?.itemId === 'string' && obj.userData.itemId) {
        return obj as THREE.Group;
      }
      obj = obj.parent;
    }
  }
  return null;
}

export function attachItemPicking(opts: AttachItemPickingOptions): () => void {
  const { canvas, camera, groups, store } = opts;
  let downX: number | null = null;
  let downY: number | null = null;

  function onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    downX = event.clientX;
    downY = event.clientY;
  }

  function onClick(event: MouseEvent): void {
    if (downX === null || downY === null) return;
    const dx = event.clientX - downX;
    const dy = event.clientY - downY;
    downX = null;
    downY = null;
    if (dx * dx + dy * dy > 16) return;
    const group = pickGroup(event, canvas, camera, groups());
    const id = group?.userData.itemId as string | undefined;
    if (!id) {
      store.clearSelection();
      return;
    }
    const item = store.findItem(id);
    if (!item || item.hidden) {
      store.clearSelection();
      return;
    }
    // locked apenas seleciona — o mover vem depois e não é implementado aqui.
    if (event.shiftKey) store.toggleSelection(id);
    else store.select([id]);
  }

  function onPointerCancel(): void {
    downX = null;
    downY = null;
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('pointercancel', onPointerCancel);
  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('click', onClick);
    canvas.removeEventListener('pointercancel', onPointerCancel);
  };
}

export interface AttachSelectionHighlightOptions {
  scene: THREE.Scene;
  groups: () => Map<string, THREE.Group>;
  store: Store;
}

export interface SelectionHighlightHandle {
  refresh: () => void;
  /** Recalcula a caixa a partir da world matrix atual (usado durante o arrasto). */
  update: () => void;
  dispose: () => void;
}

export function attachSelectionHighlight(opts: AttachSelectionHighlightOptions): SelectionHighlightHandle {
  const { scene, groups, store } = opts;
  let helper: THREE.BoxHelper | null = null;

  function clear(): void {
    if (!helper) return;
    scene.remove(helper);
    helper.dispose();
    helper = null;
  }

  function refresh(): void {
    clear();
    if (store.selection.length !== 1) return;
    const group = groups().get(store.selection[0]);
    if (!group) return;
    helper = new THREE.BoxHelper(group, 0x0f766e);
    scene.add(helper);
  }

  const off = store.selectionChanged.on(refresh);
  refresh();
  return {
    refresh,
    // BoxHelper.update recalcula a caixa a partir da world matrix do grupo.
    update: () => {
      helper?.update();
    },
    dispose: () => {
      off();
      clear();
    },
  };
}

export interface AttachItemFocusOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  controls: {
    target: THREE.Vector3;
    minDistance: number;
    maxDistance: number;
    update: () => void;
  };
  groups: () => Map<string, THREE.Group>;
  store: Store;
}

export function attachItemFocus(opts: AttachItemFocusOptions): () => void {
  const { canvas, camera, controls, groups, store } = opts;

  function onDoubleClick(event: MouseEvent): void {
    const group = pickGroup(event, canvas, camera, groups());
    if (!group) return;
    const id = group.userData.itemId as string | undefined;
    if (!id) return;
    const item = store.findItem(id);
    if (!item || item.hidden) return;
    const center = new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3());
    const direction = camera.position.clone().sub(controls.target);
    const distance = Math.min(
      Math.max(direction.length(), controls.minDistance),
      controls.maxDistance,
    );
    // Câmera exatamente sobre o target deixa direction ~0 e normalize() produziria NaN.
    if (direction.lengthSq() < 1e-12) direction.set(0, 1, 1);
    direction.normalize();
    controls.target.copy(center);
    camera.position.copy(center).addScaledVector(direction, distance);
    controls.update();
  }

  canvas.addEventListener('dblclick', onDoubleClick);
  return () => {
    canvas.removeEventListener('dblclick', onDoubleClick);
  };
}

export interface AttachItemDragOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  controls: { enabled: boolean; update: () => void };
  groups: () => Map<string, THREE.Group>;
  store: Store;
  /** Contorno da seleção: repassado para o destaque acompanhar o arrasto. */
  highlight: { update: () => void };
}

/**
 * Arrasta um móvel com o botão esquerdo no plano do piso (y = 0).
 * Durante o gesto escreve direto nas referências vivas do store e emite viewChanged
 * (sem histórico); no pointerup gera um único passo 'Mover'.
 */
export function attachItemDrag(opts: AttachItemDragOptions): () => void {
  const { canvas, camera, controls, groups, store } = opts;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();

  let dragging = false;
  let moved = false;
  let pointerId: number | null = null;
  let dragId: string | null = null;
  /** Snapshot preguiçoso: só nasce no primeiro move que passa do guarda de 4px. */
  let before: Plan | null = null;
  /** Documento do pointerdown: se o store trocar de doc no meio, o gesto é cancelado. */
  let docAtDown: Plan | null = null;
  /** Valores do item no pointerdown: o snap é aplicado sobre o delta, não sobre o centro. */
  let baseX = 0;
  let baseZ = 0;
  let downPointX = 0;
  let downPointZ = 0;
  let downX = 0;
  let downY = 0;
  let capturedHere = false;
  let controlsOff = false;
  /** Estado da órbita antes do gesto: o arrasto devolve exatamente o que encontrou. */
  let controlsWasEnabled = true;

  function pointOnFloor(event: { clientX: number; clientY: number }): THREE.Vector3 | null {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.ray.intersectPlane(floorPlane, hit);
  }

  /** Arredonda o deslocamento (não o centro absoluto) para a grade, como no 2D. */
  function snappedDelta(delta: number): number {
    const settings = store.doc.settings;
    if (!settings.snap) return delta;
    const grid = settings.grid > 0 ? settings.grid : 10;
    return Math.round(delta / grid) * grid;
  }

  function releaseControls(): void {
    if (!controlsOff) return;
    controls.enabled = controlsWasEnabled;
    controlsOff = false;
  }

  function releaseCapture(): void {
    if (!capturedHere || pointerId === null) return;
    capturedHere = false;
    const id = pointerId;
    try {
      if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
    } catch {
      /* o navegador pode já ter solto a captura. */
    }
  }

  function resetState(): void {
    dragging = false;
    moved = false;
    pointerId = null;
    dragId = null;
    before = null;
    docAtDown = null;
    capturedHere = false;
  }

  function onPointerDown(event: PointerEvent): void {
    // Shift é modificador de seleção (o picking cuida do toggle): nunca inicia arrasto,
    // senão o select([id]) abaixo colapsaria a seleção múltipla.
    if (event.shiftKey) return;
    if (event.button !== 0 || dragging) return;
    // Sem acerto de móvel nada acontece: o OrbitControls orbita normalmente.
    const group = pickGroup(event, canvas, camera, groups());
    const id = group?.userData.itemId as string | undefined;
    if (!id) return;
    const item = store.findItem(id);
    if (!item || item.hidden) return;
    if (item.locked) {
      // Mesma regra do clique: só seleciona se o item ainda não estiver selecionado.
      if (!store.selection.includes(id)) store.select([id]);
      return;
    }
    const point = pointOnFloor(event);
    if (!point) return;

    if (!store.selection.includes(id)) store.select([id]);
    // Sem snapshot aqui: ele nasce no primeiro move, quando o gesto vira arrasto de fato.
    baseX = item.x;
    baseZ = item.y;
    downPointX = point.x;
    downPointZ = point.z;
    docAtDown = store.doc;
    dragId = id;
    pointerId = event.pointerId;
    downX = event.clientX;
    downY = event.clientY;
    dragging = true;
    moved = false;
    controlsWasEnabled = controls.enabled;
    controls.enabled = false;
    controlsOff = true;
    // O OrbitControls já capturou o ponteiro no mesmo canvas; só capturamos se ninguém o fez.
    if (!canvas.hasPointerCapture(event.pointerId)) {
      try {
        canvas.setPointerCapture(event.pointerId);
        capturedHere = true;
      } catch {
        /* sem captura o arrasto segue válido enquanto o ponteiro fica sobre o canvas. */
      }
    }
  }

  function onPointerMove(event: PointerEvent): void {
    if (!dragging || dragId === null) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    // Botão solto fora do canvas: o gesto termina aqui mesmo sem pointerup.
    if (event.buttons === 0) {
      finishDrag(moved);
      return;
    }
    // Mantém o guarda de 4px do picking: abaixo disso ainda é clique, não arrasto.
    if (!moved) {
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (dx * dx + dy * dy <= 16) return;
      moved = true;
      // Snapshot preguiçoso: só aqui sabemos que o clique virou arrasto.
      before = store.snapshot();
    }
    // Documento trocado no meio do gesto (undo, abrir planta...): o snapshot não vale mais.
    if (!before || store.doc !== docAtDown) {
      releaseCapture();
      releaseControls();
      resetState();
      return;
    }
    const item = store.findItem(dragId);
    if (!item) return;
    const point = pointOnFloor(event);
    if (!point) return;

    // Snap sobre o delta (paridade com o 2D): preserva o offset de grab do ponteiro.
    const nextX = baseX + snappedDelta(point.x - downPointX);
    const nextZ = baseZ + snappedDelta(point.z - downPointZ);
    // item é a referência viva do store: escrever aqui evita tx por frame.
    item.x = nextX;
    // No plano 2D o y do item é a profundidade, que vira z na cena. A altura nunca é tocada.
    item.y = nextZ;
    const group = groups().get(dragId);
    if (group) {
      // Mantém a altura escolhida (elevation); o gesto move apenas no plano do piso.
      group.position.set(nextX, group.position.y, nextZ);
      // O contorno vem de um BoxHelper: sem isto ele ficaria parado no lugar de origem.
      opts.highlight.update();
    }
    store.emit();
  }

  function onPointerUp(event: PointerEvent): void {
    if (!dragging) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    // Só o botão esquerdo encerra o gesto; botões extras não commitam nada.
    if (event.button !== 0) return;
    finishDrag(moved);
  }

  /** Encerra o gesto: um único commit se houve movimento, senão volta ao snapshot. */
  function finishDrag(commit: boolean): void {
    if (!dragging) return;
    const snapshot = before;
    releaseCapture();
    releaseControls();
    resetState();
    if (commit && snapshot) store.commit('Mover', snapshot);
    else if (snapshot) store.setDoc(snapshot, false);
  }

  function cancelDrag(): void {
    finishDrag(false);
  }

  function onPointerCancel(): void {
    cancelDrag();
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    if (!dragging) return;
    // Este listener é registrado antes do listener de Escape que fecha o painel em
    // ui/viewer3d.ts; parar a propagação impede que a mesma tecla feche o painel.
    event.stopImmediatePropagation();
    event.preventDefault();
    cancelDrag();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  // Rede de segurança: o ponteiro pode ser solto fora do canvas.
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  // Captura: vence o Escape global (que limparia a seleção) e o que fecha o painel.
  window.addEventListener('keydown', onKeyDown, true);
  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerCancel);
    window.removeEventListener('keydown', onKeyDown, true);
    // Dispose com gesto ativo: desfaz a posição mutada (sem passo de histórico).
    if (dragging && before) store.setDoc(before, false);
    releaseCapture();
    releaseControls();
    resetState();
  };
}

export interface AttachElevationHandleOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  controls: { enabled: boolean };
  groups: () => Map<string, THREE.Group>;
  store: Store;
  /** Contorno da seleção: repassado para acompanhar o arrasto vertical. */
  highlight: { update: () => void };
}

export interface ElevationHandle {
  /** Reaponta a alça depois de um rebuild da cena ou de mudar a seleção. */
  refresh: () => void;
  /** Mantém a alça legível em qualquer zoom (chamado a cada frame). */
  tick: () => void;
  dispose: () => void;
}

const HANDLE_GAP = 16;
const HANDLE_COLOR = 0x0f766e;
const DEG = Math.PI / 180;
/** Altura total do desenho da alça, em cm, antes da escala de tela. */
const HANDLE_DRAW_HEIGHT = 47;
const HANDLE_PIXELS = 46;

/**
 * Alça vertical para itens suspensos: aparece ao lado do único item selecionado
 * e arrasta a altura da base entre o chão e o teto. Escreve direto no item
 * durante o gesto e gera um único passo 'Altura' no pointerup.
 */
export function attachElevationHandle(opts: AttachElevationHandleOptions): ElevationHandle {
  const { canvas, camera, scene, controls, groups, store } = opts;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const gizmo = new THREE.Group();
  gizmo.visible = false;
  scene.add(gizmo);

  const arrowMat = new THREE.MeshBasicMaterial({
    color: HANDLE_COLOR,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0.95,
  });
  const knobMat = new THREE.MeshBasicMaterial({
    color: 0xf8faf9,
    depthTest: false,
    depthWrite: false,
  });
  const ringMat = new THREE.MeshBasicMaterial({
    color: HANDLE_COLOR,
    depthTest: false,
    depthWrite: false,
  });

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 34, 10), arrowMat);
  const topArrow = new THREE.Mesh(new THREE.ConeGeometry(3.8, 7, 12), arrowMat);
  topArrow.position.y = 20;
  const bottomArrow = new THREE.Mesh(new THREE.ConeGeometry(3.8, 7, 12), arrowMat);
  bottomArrow.position.y = -20;
  bottomArrow.rotation.z = Math.PI;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(5.2, 18, 14), knobMat);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(7.2, 1.2, 8, 28), ringMat);
  // Área de clique maior que o desenho: esfera invisível, mas ainda raycastável.
  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(16, 12, 10),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  );

  for (const mesh of [shaft, topArrow, bottomArrow, knob, ring, hitArea]) {
    mesh.renderOrder = 1000;
    gizmo.add(mesh);
  }

  let currentId: string | null = null;
  let dragging = false;
  let moved = false;
  let pointerId: number | null = null;
  let dragId: string | null = null;
  let before: Plan | null = null;
  let docAtDown: Plan | null = null;
  let startElevation = 0;
  let modelHeight = 0;
  let downY = 0;
  let perPixel = 1;
  let capturedHere = false;
  let controlsWasEnabled = true;
  let suppressClick = false;

  function centerOf(): THREE.Vector3 {
    return gizmo.position;
  }

  function hitsGizmo(event: { clientX: number; clientY: number }): boolean {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObject(gizmo, true).length > 0;
  }

  /** Esconde a alça quando não há exatamente um suspenso selecionado. */
  function refresh(): void {
    if (dragging) return;
    currentId = null;
    gizmo.visible = false;
    if (store.selection.length !== 1) return;
    const item = store.findItem(store.selection[0]);
    if (!item || item.hidden || item.locked || !isElevatable(item.defId)) return;
    const group = groups().get(item.id);
    if (!group) return;
    currentId = item.id;
    const height = itemHeight(item.defId).height;
    // Ao lado do móvel (eixo local +x), na altura média: não cobre o modelo.
    const offset = item.w / 2 + HANDLE_GAP;
    const angle = item.rot * DEG;
    gizmo.position.set(
      group.position.x + Math.cos(angle) * offset,
      itemElevation(item) + height / 2,
      group.position.z + Math.sin(angle) * offset,
    );
    gizmo.visible = true;
  }

  /** Escala em função da distância para a alça manter ~46 px de altura. */
  function tick(): void {
    if (!gizmo.visible) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.height) return;
    const distance = Math.max(1, camera.position.distanceTo(gizmo.position));
    const worldPerPixel = (2 * Math.tan((camera.fov * Math.PI) / 360) * distance) / rect.height;
    const scale = (worldPerPixel * HANDLE_PIXELS) / HANDLE_DRAW_HEIGHT;
    gizmo.scale.setScalar(Math.min(3, Math.max(0.5, scale)));
  }

  function releaseCapture(): void {
    if (!capturedHere || pointerId === null) return;
    capturedHere = false;
    const id = pointerId;
    try {
      if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
    } catch {
      /* o navegador pode já ter solto a captura. */
    }
  }

  function releaseControls(): void {
    controls.enabled = controlsWasEnabled;
  }

  function resetState(): void {
    dragging = false;
    moved = false;
    pointerId = null;
    dragId = null;
    before = null;
    docAtDown = null;
    capturedHere = false;
  }

  function onPointerDownCapture(event: PointerEvent): void {
    // Outro pointerdown invalida um clique pendente de suprimir.
    suppressClick = false;
    if (dragging) return;
    if (event.button !== 0 || !gizmo.visible) return;
    if (!hitsGizmo(event)) return;

    const id = currentId;
    if (!id) return;
    const item = store.findItem(id);
    if (!item || item.hidden || item.locked) return;

    // Captura antes do OrbitControls: sem órbita enquanto a alça é arrastada.
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = true;

    dragId = id;
    docAtDown = store.doc;
    startElevation = itemElevation(item);
    modelHeight = itemHeight(item.defId).height;
    downY = event.clientY;
    const rect = canvas.getBoundingClientRect();
    const distance = Math.max(1, camera.position.distanceTo(centerOf()));
    perPixel = (2 * Math.tan((camera.fov * Math.PI) / 360) * distance) / Math.max(1, rect.height);
    pointerId = event.pointerId;
    dragging = true;
    moved = false;
    before = null;
    controlsWasEnabled = controls.enabled;
    controls.enabled = false;
    if (!canvas.hasPointerCapture(event.pointerId)) {
      try {
        canvas.setPointerCapture(event.pointerId);
        capturedHere = true;
      } catch {
        /* sem captura o arrasto segue válido enquanto o ponteiro fica sobre o canvas. */
      }
    }
  }

  function onPointerMove(event: PointerEvent): void {
    // Feedback de cursor quando só está passando por cima da alça.
    if (!dragging) {
      if (gizmo.visible && event.buttons === 0) {
        canvas.style.cursor = hitsGizmo(event) ? 'ns-resize' : '';
      }
      return;
    }
    if (dragId === null) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    if (event.buttons === 0) {
      finishDrag(true);
      return;
    }
    if (!moved) {
      const dy = event.clientY - downY;
      if (Math.abs(dy) < 2) return;
      moved = true;
      before = store.snapshot();
    }
    if (!before || store.doc !== docAtDown) {
      releaseCapture();
      releaseControls();
      resetState();
      return;
    }
    const item = store.findItem(dragId);
    if (!item) return;

    let delta = (downY - event.clientY) * perPixel;
    const settings = store.doc.settings;
    if (settings.snap) {
      const grid = settings.grid > 0 ? settings.grid : 10;
      delta = Math.round(delta / grid) * grid;
    }
    const next = clampElevation(Math.round(startElevation + delta), item.defId);
    // item é a referência viva do store: escrever aqui evita tx por frame.
    item.elevation = next;
    const group = groups().get(dragId);
    if (group) {
      group.position.y = next;
      opts.highlight.update();
    }
    gizmo.position.y = next + modelHeight / 2;
    store.emit();
  }

  function onPointerUp(event: PointerEvent): void {
    if (!dragging) return;
    if (pointerId !== null && event.pointerId !== pointerId) return;
    if (event.button !== 0) return;
    finishDrag(true);
  }

  function finishDrag(commit: boolean): void {
    if (!dragging) return;
    const snapshot = before;
    releaseCapture();
    releaseControls();
    resetState();
    if (commit && snapshot) store.commit('Altura', snapshot);
    // Sem snapshot nada mudou; se o doc trocou no meio, o gesto já foi abandonado.
    refresh();
  }

  function onPointerCancel(): void {
    finishDrag(false);
  }

  function onClickCapture(event: MouseEvent): void {
    if (!suppressClick) return;
    suppressClick = false;
    // O clique sintético do arrasto não deve limpar a seleção no picking.
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !dragging) return;
    // Registrado antes do Escape que fecha o painel em ui/viewer3d.ts.
    event.stopImmediatePropagation();
    event.preventDefault();
    const snapshot = before;
    releaseCapture();
    releaseControls();
    resetState();
    if (snapshot) store.setDoc(snapshot, false);
    refresh();
  }

  const offSelection = store.selectionChanged.on(refresh);
  // Captura para vencer o listener do OrbitControls, que é registrado antes.
  canvas.addEventListener('pointerdown', onPointerDownCapture, true);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('click', onClickCapture, true);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
  // Captura: vence o Escape global (que limparia a seleção) e o que fecha o painel.
  window.addEventListener('keydown', onKeyDown, true);
  refresh();

  return {
    refresh,
    tick,
    dispose: () => {
      offSelection();
      canvas.removeEventListener('pointerdown', onPointerDownCapture, true);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('keydown', onKeyDown, true);
      if (dragging && before) store.setDoc(before, false);
      releaseCapture();
      releaseControls();
      resetState();
      canvas.style.cursor = '';
      scene.remove(gizmo);
      for (const mesh of [shaft, topArrow, bottomArrow, knob, ring, hitArea]) {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      }
    },
  };
}
