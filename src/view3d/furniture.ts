/** Constrói itens 3D usando o model.ts de cada pacote em ../furniture/<id>/. */
import * as THREE from 'three';
import type { Item } from '../core/document';
import { getDef } from '../catalog/registry';
import { getFurnitureModel } from './modelRegistry';
import { shade } from '../catalog/draw';
import { WALL_HEIGHT } from '../core/constants';
import { generic, itemElevation, itemHeight, type Palette } from './modelShared';
import type { ModelBuildContext } from './modelApi';

export { clampElevation, defaultElevation, isElevatable, itemElevation, itemHeight, maxElevation } from './modelShared';
export type { ModelSize, Palette } from './modelShared';


/** Semente estável por item: dá variação sem depender da ordem de construção. */
function itemSeed(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

/** Peças que acendem: a cúpula ganha brilho quente para ler como "acesa". */
const LAMP_KEYWORDS = ['luminaria', 'pendente', 'arandela', 'abajur'];

/** Cor da cúpula acesa (sem tone mapping, lê como luz própria). */
const LAMP_SHADE_LIT = 0xffe3b6;

/** Realce da cúpula reaproveitado por material de origem (evita clonar a cada reconstrução). */
const litShades = new WeakMap<THREE.Material, THREE.Material>();

/**
 * Faz a lâmpada parecer acesa trocando o material da cúpula por um emissivo barato.
 * Numa cena diurna uma PointLight some sob o sol e ainda vazaria pelas paredes (não
 * projeta sombra), e o bulbo fica escondido dentro da cúpula: o que o olho enxerga
 * numa luminária ligada é a própria cúpula acesa.
 */
function glowLampShade(body: THREE.Group): void {
  let shade: THREE.Mesh | null = null;
  let shadeSize = 0;
  body.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material as THREE.MeshPhysicalMaterial;
    // Tecido (a cúpula das luminárias) é o único material com sheen.
    if (!mat || typeof mat.sheen !== 'number' || mat.sheen <= 0) return;
    if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
    const size = (mesh.geometry.boundingSphere?.radius ?? 0) * mesh.scale.length();
    if (size > shadeSize) {
      shadeSize = size;
      shade = mesh;
    }
  });
  if (!shade) return;
  const target = shade as THREE.Mesh;
  const src = target.material as THREE.MeshPhysicalMaterial;
  let mat = litShades.get(src);
  if (!mat) {
    // Material básico (sem sombreamento) lê como superfície iluminada por dentro,
    // e `toneMapped: false` mantém o creme quente sem depender do bloom.
    const lit = new THREE.MeshBasicMaterial({
      color: LAMP_SHADE_LIT,
      map: src.map ?? null,
      toneMapped: false,
      side: src.side,
    });
    litShades.set(src, lit);
    mat = lit;
  }
  target.material = mat;
}

export function buildFurniture(item: Item): THREE.Group {
  const group = new THREE.Group();
  const elevation = itemElevation(item);
  group.position.set(item.x, elevation, item.y);
  group.rotation.y = -item.rot * Math.PI / 180;
  group.userData.itemId = item.id;

  const { height } = itemHeight(item.defId);
  // Variação sutil de tom por peça: repetidas da mesma cor não ficam clones idênticos.
  const variation = (itemSeed(item.id) - 0.5) * 0.05;
  const main = shade(item.colors.main ?? '#c9a37a', variation);
  const accent = shade(item.colors.accent ?? shade(main, 0.14), variation);
  const palette: Palette = {
    id: item.defId, w: item.w, d: item.d, h: height, base: elevation,
    ceil: WALL_HEIGHT - elevation, main, accent,
    dark: shade(main, -0.16), light: shade(main, 0.1),
    metal: item.colors.metal ?? accent,
  };

  const body = new THREE.Group();
  group.add(body);
  const model = getFurnitureModel(item.defId);
  if (model?.build) {
    const context: ModelBuildContext = { body, palette, item, main, height };
    model.build(context);
  } else {
    generic(body, palette, getDef(item.defId)?.category ?? 'decoracao');
  }

  if (LAMP_KEYWORDS.some((key) => item.defId.includes(key))) glowLampShade(body);
  return group;
}
