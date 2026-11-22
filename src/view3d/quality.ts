/**
 * Pipeline de alta qualidade para a vista 3D ao vivo.
 *
 * Liga quatro melhorias que funcionam em cima do renderer atual:
 * - GTAO: oclusão de ambiente nas frestas e sombras de contato entre móveis,
 *   paredes e piso, que é o que mais aproxima a maquete de uma foto;
 * - supersampling: renderiza acima da resolução da tela e reduz, o que suaviza
 *   arestas e serrilhado de geometria fina;
 * - bloom: dá brilho aos materiais emissivos (lâmpadas, pendentes, LEDs);
 * - SMAA: anti-aliasing por pós-processamento nas arestas restantes.
 *
 * Desligado por padrão: é mais caro que um renderer.render direto.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export interface QualityRenderer {
  render(): void;
  setSize(width: number, height: number): void;
  dispose(): void;
}

/** Fator de supersampling: 1.25 já reduz o serrilhado; o SMAA cobre o resto. */
const SUPERSAMPLE = 1.25;

/** Raio do GTAO em centímetros (a cena é modelada em cm). */
const GTAO_RADIUS = 24;
const GTAO_THICKNESS = 10;
/** O AO é de baixa frequência: calcular em 60% da resolução economiza sem perder contato. */
const GTAO_SCALE = 0.6;

export function createQualityRenderer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  size: { width: number; height: number },
): QualityRenderer | null {
  let composer: EffectComposer;
  try {
    composer = new EffectComposer(renderer);
  } catch {
    return null;
  }

  composer.setPixelRatio(Math.min(renderer.getPixelRatio() * SUPERSAMPLE, 2));

  composer.addPass(new RenderPass(scene, camera));

  // GTAO: escurece frestas e cria a sombra de contato que falta ao sol direcional.
  let gtao: GTAOPass;
  try {
    gtao = new GTAOPass(scene, camera, size.width, size.height);
  } catch {
    // GPUs antigas podem não suportar depth texture em half float: volta ao render direto.
    composer.dispose();
    return null;
  }
  gtao.output = GTAOPass.OUTPUT.Default;
  // Faces duplas no buffer de normais evitam buracos em cubas, vasos e tampos finos.
  gtao.normalMaterial.side = THREE.DoubleSide;
  gtao.blendIntensity = 1;
  gtao.updateGtaoMaterial({
    radius: GTAO_RADIUS,
    distanceExponent: 1.1,
    thickness: GTAO_THICKNESS,
    distanceFallOff: 1,
    scale: 1.3,
    samples: 16,
    screenSpaceRadius: false,
  });
  gtao.updatePdMaterial({
    lumaPhi: 10,
    depthPhi: 1.5,
    normalPhi: 1.5,
    radius: 5,
    radiusExponent: 1.2,
    rings: 2,
    samples: 16,
  });
  // O composer chama setSize em resolução cheia; aqui o AO roda em resolução reduzida.
  const gtaoSetSize = gtao.setSize.bind(gtao);
  gtao.setSize = (width, height) => {
    gtaoSetSize(
      Math.max(1, Math.round(width * GTAO_SCALE)),
      Math.max(1, Math.round(height * GTAO_SCALE)),
    );
  };
  composer.addPass(gtao);

  const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.3, 0.55, 1.35);
  composer.addPass(bloom);

  const smaa = new SMAAPass();
  composer.addPass(smaa);
  const output = new OutputPass();
  composer.addPass(output);

  // Precisa vir depois de todos os passes para dimensionar também GTAO e SMAA.
  composer.setSize(size.width, size.height);

  return {
    render: () => composer.render(),
    setSize: (width, height) => composer.setSize(width, height),
    dispose: () => {
      composer.dispose();
      gtao.dispose();
      bloom.dispose();
      smaa.dispose();
      output.dispose();
    },
  };
}
