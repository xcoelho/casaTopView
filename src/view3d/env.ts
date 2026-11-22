/** Ambiente IBL e tone mapping compartilhados entre a cena 3D e a prévia do inspetor. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function applyRealisticEnvironment(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  intensity = 0.45,
): () => void {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  // PCFSoftShadowMap foi removido no three r187; PCFShadowMap usa o radius para suavizar.
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const target = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = target.texture;
  scene.environmentIntensity = intensity;

  roomEnv.dispose();
  pmrem.dispose();

  return () => {
    if (scene.environment === target.texture) {
      scene.environment = null;
    }
    target.dispose();
  };
}
