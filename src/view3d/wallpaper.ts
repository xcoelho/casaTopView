/** Texturas 3D dos papéis de parede, repetidas em escala real. */
import * as THREE from 'three';
import type { WallpaperPreset } from '../core/wallpapers';
import { wallPaintTexture } from './textures';

const TEXTURE_SIZE = 768;
const textures = new Map<string, THREE.CanvasTexture>();
const materials = new Map<string, THREE.MeshStandardMaterial>();

function baseTexture(preset: WallpaperPreset): THREE.CanvasTexture {
  const existing = textures.get(preset.id);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx) preset.drawTile(ctx, TEXTURE_SIZE);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  textures.set(preset.id, texture);
  return texture;
}

function wrap01(value: number): number {
  return ((value % 1) + 1) % 1;
}

/**
 * Material para uma face de um trecho de parede. O repeat acompanha a largura
 * e a altura reais; o offset mantém o padrão contínuo entre trechos e vãos.
 */
export function wallpaperMaterial(
  preset: WallpaperPreset,
  width: number,
  height: number,
  start: number,
  base: number,
  mirrored = false,
): THREE.MeshStandardMaterial {
  const key = [
    preset.id,
    width.toFixed(1),
    height.toFixed(1),
    start.toFixed(1),
    base.toFixed(1),
    mirrored ? 'L' : 'R',
  ].join('|');
  const existing = materials.get(key);
  if (existing) return existing;

  const map = baseTexture(preset).clone();
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  // A face -Z do BoxGeometry corre no sentido oposto ao eixo A → B; o repeat
  // negativo mantém o padrão contínuo quando ele atravessa vãos e quinas.
  const repeatX = Math.max(0.05, width / preset.tileCm) * (mirrored ? -1 : 1);
  map.repeat.set(repeatX, Math.max(0.05, height / preset.tileCm));
  map.offset.set(
    wrap01((mirrored ? start + width : start) / preset.tileCm),
    wrap01(base / preset.tileCm),
  );
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  map.needsUpdate = true;

  const material = new THREE.MeshStandardMaterial({
    map,
    roughness: 0.84,
    metalness: 0.01,
    bumpMap: wallPaintTexture(),
    bumpScale: 0.055,
    envMapIntensity: 0.3,
  });
  materials.set(key, material);
  return material;
}
