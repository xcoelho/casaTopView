/** Pacote de catálogo correspondente a cada tipo de abertura. */
import type { OpeningKind } from '../core/document';
import { getDef } from './registry';

/** Pacote padrão de cada tipo, usado ao inserir uma abertura nova. */
const BY_KIND: Record<OpeningKind, string> = {
  porta: 'porta-simples',
  'porta-dupla': 'porta-dupla',
  'porta-correr': 'porta-correr',
  'porta-garagem': 'porta-garagem',
  janela: 'janela',
  'janela-correr': 'janela-correr',
  vao: 'vao',
};

export function openingDefIdForKind(kind: OpeningKind): string {
  return BY_KIND[kind];
}

/**
 * Plantas antigas não guardavam `defId`: nelas a porta era escolhida pela largura.
 * Mantém o mesmo visual ao carregar esses arquivos.
 */
export function inferredOpeningDefId(kind: OpeningKind, width: number): string {
  if (kind === 'porta') {
    if (width >= 100) return 'porta-pivotante';
    if (width >= 85) return 'porta-vidro';
  }
  return openingDefIdForKind(kind);
}

/** Usa o pacote salvo quando ele ainda existe e combina com o tipo; senão infere. */
export function resolveOpeningDefId(
  kind: OpeningKind,
  width: number,
  defId?: string,
): string {
  if (defId) {
    const def = getDef(defId);
    if (def?.kind === 'opening' && def.opening?.kind === kind) return defId;
  }
  return inferredOpeningDefId(kind, width);
}
