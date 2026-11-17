import type { OpeningKind } from '../core/document';

/** Categorias do catálogo lateral. */
export type CategoryId =
  | 'assentos'
  | 'mesas'
  | 'camas'
  | 'armarios'
  | 'cozinha'
  | 'banheiro'
  | 'eletro'
  | 'lavanderia'
  | 'decoracao'
  | 'externo'
  | 'estrutura'
  | 'aberturas';

/** Paletas de materiais oferecidas no inspetor. */
export type PaletteId = 'wood' | 'fabric' | 'metal' | 'stone' | 'paint' | 'plant' | 'glass';

export interface ColorKey {
  key: string;
  label: string;
  palette: PaletteId;
}

export interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  /** largura em cm (eixo local x) */
  w: number;
  /** profundidade em cm (eixo local y) */
  d: number;
  colors: Record<string, string>;
  /** pixels por cm, útil para detalhes que dependem do zoom */
  px?: number;
}

export interface OpeningPreset {
  kind: OpeningKind;
  width: number;
}

export interface FurnitureDef {
  id: string;
  name: string;
  category: CategoryId;
  /** largura padrão em cm */
  w: number;
  /** profundidade padrão em cm */
  d: number;
  keywords?: string[];
  /** 'opening' são portas/janelas que se prendem às paredes */
  kind?: 'furniture' | 'opening';
  opening?: OpeningPreset;
  /** desenha por cima de tudo (pendentes, coifas) */
  zBias?: number;
  /** não recebe sombra (tapetes, piscinas, itens de teto) */
  flat?: boolean;
  colors?: Record<string, string>;
  colorKeys?: ColorKey[];
  draw(args: DrawArgs): void;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
}
