# Especificação de móveis do casaTopView

Cada móvel é um **pacote**: uma pasta em `src/furniture/<id>/` com metadados, desenho 2D e, quando existir, o modelo 3D. Não há registro central para editar — o Vite descobre as pastas na hora do build.

## Estrutura do pacote

```
src/furniture/
  mesa-reuniao/
    definition.ts     metadados + desenho visto de cima (obrigatório)
    model.ts          modelo 3D em three.js (opcional)
  shared/             ajudas de desenho reaproveitadas por várias peças
```

O nome da pasta é o `id` da peça, em kebab-case (`mesa-reuniao`). O registro confere a correspondência e interrompe o build se a pasta e o `id` divergirem, se faltar `draw` ou se houver `id`/`modelId` duplicado.

## definition.ts

Exporte a definição como padrão, tipada com `FurnitureDef`. Ela continua como antes: id, nome, categoria, largura, profundidade, palavras-chave, cores, `colorKeys` e a função `draw`, que desenha a peça vista de cima em centímetros (origem no canto superior esquerdo local, eixos `w` e `d`).

~~~ts
import type { FurnitureDef } from '../../catalog/types';

export default {
  id: 'mesa-reuniao',
  name: 'Mesa de reunião',
  category: 'mesas',
  w: 240,
  d: 110,
  keywords: ['mesa', 'reuniao', 'escritorio'],
  colors: { main: '#c19a6b' },
  colorKeys: [{ key: 'main', label: 'Tampo', palette: 'wood' }],
  draw: ({ ctx, w, d, colors }) => {
    // desenho vetorial usando os helpers de ../../catalog/draw
  },
} satisfies FurnitureDef;
~~~

Desenho compartilhado: use `src/catalog/draw.ts` (formas, cores, texturas) e, quando a ajuda servir a várias peças da mesma família, `src/furniture/shared/<familia>.ts`.

## model.ts

Gere o modelo em TypeScript para o motor Three.js do projeto. Dimensões e coordenadas em centímetros.

- `modelId`: mesmo id da pasta e da `FurnitureDef`.
- `build(context): void`: adiciona a geometria a `context.body`.
- `modelHeight?`: altura total em centímetros.
- `modelBase?`: elevação inicial da base; use 0 para móveis no chão.

Importe o tipo `ModelBuildContext` e os helpers 3D de `../../view3d/modelApi`. O contexto inclui `body`, `palette`, `item`, `main` e `height`.

### Coordenadas e limites

- Use centímetros.
- O app já posiciona e gira `body`; não altere sua posição ou rotação.
- Eixos locais: `x` largura, `z` profundidade, `y` vertical.
- A origem é o centro da base. A face do chão está em `baseY = 0`.
- Use `palette.w`, `palette.d` e `palette.h` para as dimensões padrão.
- `boxAt` e `roundedBoxAt` usam a assinatura `(parent, largura, profundidade, altura, x, z, baseY, cor, ...)`; `baseY` indica a face inferior.

### Acabamentos

Use as cores de `palette` (`main`, `accent`, `dark`, `light` e `metal`) para seguir o inspetor. `MaterialKind` aceita matte, wood, fabric, metal, chrome, glass, ceramic, stone, paint, wallPaint, screen, screenGlow, foliage, emissive e water.

### Exemplo

~~~ts
import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, coneAt } from '../../view3d/modelApi';

export const modelId = 'mesa-reuniao';
export const modelHeight = 76;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, main, metal } = palette;
  const tampo = 4;
  const pernas = 72;
  boxAt(body, w, d, tampo, 0, 0, pernas, main, 1, 0, 'wood');
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      coneAt(body, 2, 3, pernas, x * (w / 2 - 9), z * (d / 2 - 9), 0, metal, 1, 'metal', 12);
    }
  }
}
~~~

## Como integrar uma peça nova

1. Crie `src/furniture/<id>/definition.ts` com os metadados e o desenho 2D.
2. Se a peça tiver 3D próprio, crie `src/furniture/<id>/model.ts` na mesma pasta.
3. Pronto: catálogo, miniaturas, busca e vista 3D passam a incluir a peça. Nenhum arquivo central precisa ser alterado.

Peças sem `model.ts` continuam no catálogo e na planta 2D; na vista 3D elas usam o modelo genérico da categoria.

## Prompt curto para gerar o pacote

Gere um pacote de móvel para o projeto casaTopView conforme este documento: crie `src/furniture/<id>/definition.ts` com a `FurnitureDef` (id igual ao nome da pasta, categoria existente, medidas em centímetros, cores, `colorKeys` e `draw` vetorial visto de cima) e, se solicitado, `src/furniture/<id>/model.ts` com `modelId`, `modelHeight`, `modelBase` e `build`. No 3D, use os helpers de `modelApi`, mantenha a origem no centro da base e a geometria dentro de `palette.w × palette.d × palette.h`. Não altere a transformação do grupo recebido.
