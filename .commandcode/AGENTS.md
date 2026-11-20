# Memory

## Project Overview

casaTopView — editor de plantas baixas 2D + vista 3D, 100% front-end. See @README.md for features and @package.json for scripts.

Stack: Vite + TypeScript + Three.js (sem dependências além de `three`). Entrada dev: `index.html` -> `src/main.ts`. Saída offline autocontida: `dist/index.html` (script `scripts/inline-dist.mjs`).

## Code Style Guidelines

- Edição mínima: não refatorar o que não foi pedido, não mudar nomes/arquitetura fora da tarefa.
- Seguir padrões existentes em `src/catalog/` e `src/view3d/` (def 2D + builder 3D por `defId`).
- TypeScript estrito (`tsc --noEmit` deve passar). Sem `any` novo sem motivo.
- Sem comentários no código, a menos que pedido.

## Architecture Notes

- Catálogo: `src/catalog/registry.ts` (`DEFS`, `getDef()`, `searchDefs()`) + `src/catalog/items/*.ts` (`FurnitureDef{id,name,category,w,d,keywords,colors,colorKeys,draw}`) + `src/catalog/draw.ts` helpers.
- Novo móvel = 1 `FurnitureDef` em `src/catalog/items/<categoria>.ts` + entrada em `ITEM_HEIGHT` + builder em `src/view3d/furniture.ts` + `case` em `buildFurniture()`. Sem isso cai em `generic()` (caixa).
- 2D planta + thumb usam `def.draw()` (`src/render/layers/furniture.ts`, `src/render/thumbnail.ts:itemThumb()`).
- 3D usa primitivas `boxAt/roundedBoxAt/cylinderAt/coneAt/sphereAt/latheAt/torusAt/tubeAt` de `src/view3d/materials.ts` (unidades cm, y-up). Ver `src/view3d/furniture.ts:itemHeight()`.
- UI do catálogo (`src/ui/palette.ts`, `src/ui/shell.ts`, `src/interaction/dropFromPalette.ts`) resolve tudo por `defId` — não precisa mexer para adicionar item.
- Preview 3D de item: `src/view3d/preview.ts` (`createItemPreview()`), instanciado duas vezes — rodapé fixo do catálogo (`src/ui/palette.ts`) e inspetor (`src/ui/inspector.ts`). Já centraliza, enquadra a câmera, gira por arraste e tem `dispose()`; o CSS base é `.insp-preview`.
- `arquivo referencia/` são só guias visuais, nunca embarcar foto/textura nem GLB.

## Common Workflows

- `npm run typecheck` — checagem rápida após editar.
- `npm run build` — typecheck + build + `dist/index.html` autocontido. Sempre rodar após mudar `src/`.
- Testar abrindo `dist/index.html` com duplo clique (`file://`), NÃO o `index.html` da raiz (é entrada do Vite, mostra só o botão "Abrir a versão compilada").
- `npm run dev` só para desenvolvimento com hot reload em http://localhost:5173.