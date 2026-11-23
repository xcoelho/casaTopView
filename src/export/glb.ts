/** Exportação do modelo 3D em GLB para abrir no Blender, Godot e afins. */
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { Plan } from '../core/document';
import { getDef } from '../catalog/registry';
import { floorKeyForPisoDef } from '../catalog/floors';
import { buildFloors, buildWalls } from '../view3d/architecture';
import { buildFurniture } from '../view3d/furniture';
import { planFileSlug } from './png';

/** O glTF usa metros; o editor trabalha em centímetros. */
const GLB_SCALE = 0.01;

/** Evita texturas gigantes no arquivo sem perda visível para o render. */
const MAX_TEXTURE_SIZE = 1024;

/**
 * Monta a cena que vai para o GLB. Ficam de fora chão, câmera, luzes e
 * qualquer elemento de interface: o programa de destino cuida da iluminação.
 */
export function buildGlbScene(plan: Plan): THREE.Group | null {
  const hasContent =
    plan.walls.length > 0 ||
    plan.rooms.length > 0 ||
    plan.items.some((item) => !item.hidden);
  if (!hasContent) return null;

  const root = new THREE.Group();
  root.name = plan.name || 'casaTopView';
  root.scale.setScalar(GLB_SCALE);

  const floors = buildFloors(plan);
  floors.name = 'Pisos';

  const walls = buildWalls(plan);
  walls.name = 'Paredes';

  const furniture = new THREE.Group();
  furniture.name = 'Móveis';
  for (const item of plan.items) {
    if (item.hidden) continue;
    const group = buildFurniture(item);
    group.name = item.label || getDef(item.defId)?.name || item.defId;
    // Pisos são itens móveis com defId piso-*: vão para o grupo certo no outliner.
    if (floorKeyForPisoDef(item.defId)) floors.add(group);
    else furniture.add(group);
  }

  root.add(...[floors, walls, furniture].filter((group) => group.children.length > 0));
  return root;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Gera o .glb em memória. Retorna null quando a planta não tem nada para exportar. */
export async function encodePlanGLB(plan: Plan): Promise<ArrayBuffer | null> {
  const scene = buildGlbScene(plan);
  if (!scene) return null;

  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, {
    binary: true,
    onlyVisible: true,
    trs: true,
    embedImages: true,
    maxTextureSize: MAX_TEXTURE_SIZE,
  });
  return result instanceof ArrayBuffer ? result : null;
}

/** Gera e baixa o .glb. Retorna false quando a planta não tem nada para exportar. */
export async function exportPlanGLB(plan: Plan): Promise<boolean> {
  const result = await encodePlanGLB(plan);
  if (!result) return false;

  downloadBlob(new Blob([result], { type: 'model/gltf-binary' }), `${planFileSlug(plan.name)}-3d.glb`);
  return true;
}
