/** Prévia 3D do móvel selecionado, exibida no inspetor. */
import * as THREE from 'three';
import type { Item } from '../core/document';
import { applyRealisticEnvironment } from './env';
import { buildFurniture } from './furniture';

export interface ItemPreviewHandle {
  /** Elemento persistente: o inspetor apenas o reposiciona a cada render. */
  element: HTMLElement;
  show(item: Item): void;
  dispose(): void;
}

const DEG = Math.PI / 180;

export function createItemPreview(): ItemPreviewHandle | null {
  const element = document.createElement('div');
  element.className = 'insp-preview';

  const canvas = document.createElement('canvas');
  canvas.className = 'insp-preview-canvas';
  element.append(canvas);

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const disposeEnv = applyRealisticEnvironment(renderer, scene, 0.45);
  const camera = new THREE.PerspectiveCamera(38, 1, 1, 20000);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb6b0a2, 1.1));
  const key = new THREE.DirectionalLight(0xfff4e0, 1.7);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.bias = -0.0006;
  scene.add(key);
  scene.add(key.target);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-1, 0.7, -1.2);
  scene.add(fill);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(1, 64),
    new THREE.MeshStandardMaterial({ color: '#e6e0d3', roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  /** Gira com o arraste do mouse (giro de mesa, só no eixo vertical). */
  const pivot = new THREE.Group();
  scene.add(pivot);

  let model: THREE.Group | null = null;
  let signature = '';
  let raf = 0;
  let yaw = -0.42;

  function schedule(): void {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (!element.isConnected) return;
      if (!element.clientWidth || !element.clientHeight) return;
      renderer.render(scene, camera);
    });
  }

  function resize(): void {
    const width = Math.max(1, element.clientWidth);
    const height = Math.max(1, element.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    schedule();
  }

  function clearModel(): void {
    if (!model) return;
    pivot.remove(model);
    model = null;
  }

  function show(item: Item): void {
    const next = `${item.defId}|${item.w}|${item.d}|${JSON.stringify(item.colors)}`;
    if (next === signature && model) {
      schedule();
      return;
    }
    signature = next;
    clearModel();

    model = buildFurniture({ ...item, x: 0, y: 0, rot: 0 });
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Centraliza no plano e apoia a base no piso da prévia.
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box.min.y;
    pivot.add(model);

    const biggest = Math.max(size.x, size.y, size.z, 5);
    const radius = biggest / 2;
    const distance = (radius / Math.sin((camera.fov * DEG) / 2)) * 1.12;

    const target = new THREE.Vector3(0, size.y * 0.46, 0);
    const direction = new THREE.Vector3(0.9, 0.62, 1.15).normalize();
    camera.position.copy(target).addScaledVector(direction, distance);
    camera.near = Math.max(0.5, distance / 200);
    camera.far = distance * 24 + 500;
    camera.lookAt(target);
    camera.updateProjectionMatrix();

    ground.scale.setScalar(Math.max(size.x, size.z) * 1.6 + 12);

    key.position.set(biggest * 1.1, biggest * 1.9, biggest * 0.9);
    key.target.position.copy(target);
    key.target.updateMatrixWorld();
    const shadowRadius = radius * 1.9 + 4;
    const shadowCamera = key.shadow.camera as THREE.OrthographicCamera;
    shadowCamera.left = -shadowRadius;
    shadowCamera.right = shadowRadius;
    shadowCamera.top = shadowRadius;
    shadowCamera.bottom = -shadowRadius;
    shadowCamera.near = 1;
    shadowCamera.far = distance * 6 + 1000;
    shadowCamera.updateProjectionMatrix();

    pivot.rotation.y = yaw;
    resize();
    schedule();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(element);

  let dragging = false;
  let lastX = 0;

  const onDown = (event: PointerEvent): void => {
    dragging = true;
    lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
    element.classList.add('dragging');
    schedule();
  };
  const onMove = (event: PointerEvent): void => {
    if (!dragging) return;
    yaw += (event.clientX - lastX) * 0.012;
    lastX = event.clientX;
    pivot.rotation.y = yaw;
    schedule();
  };
  const onUp = (event: PointerEvent): void => {
    if (!dragging) return;
    dragging = false;
    element.classList.remove('dragging');
    try {
      canvas.releasePointerCapture(event.pointerId);
    } catch {
      /* ignora */
    }
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  return {
    element,
    show,
    dispose: () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      clearModel();
      disposeEnv();
      ground.geometry.dispose();
      (ground.material as THREE.Material).dispose();
      renderer.dispose();
      element.remove();
    },
  };
}
