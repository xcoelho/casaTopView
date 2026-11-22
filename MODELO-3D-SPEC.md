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

O nome da pasta é o `id` da peça, em kebab-case (`mesa-reuniao`). O registro confere a correspondência e **interrompe o build** se a pasta e o `id` divergirem, se faltar `draw`, se a categoria não existir ou se houver `id`/`modelId` duplicado.

## Categorias válidas

Use exatamente um destes valores em `category`:

`assentos`, `mesas`, `camas`, `armarios`, `cozinha`, `banheiro`, `eletro`, `lavanderia`, `decoracao`, `externo`, `estrutura`, `aberturas`

## definition.ts

Exporte a definição como padrão, tipada com `FurnitureDef`. Ela desenha a peça vista de cima em centímetros, com a origem no canto superior esquerdo local (eixos `w` e `d`).

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

### Campos de FurnitureDef

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `id` | sim | Mesmo nome da pasta, em kebab-case. |
| `name` | sim | Nome exibido no catálogo. |
| `category` | sim | Uma das categorias válidas acima. |
| `w`, `d` | sim | Largura e profundidade padrão, em cm. |
| `draw` | sim | Função que desenha a peça vista de cima. |
| `keywords` | não | Termos extras para a busca. |
| `colors` | não | Cores iniciais por chave (`{ main: '#...' }`). |
| `colorKeys` | não | Acabamentos editáveis no inspetor. |
| `flat` | não | `true` remove a sombra e trata a peça como piso/tapete. |
| `zBias` | não | Camada de desenho. Pisos usam `-10`; pendentes/coifas usam positivo para ficar por cima. |
| `kind` | não | `'opening'` marca portas e janelas que se prendem à parede. |
| `opening` | não | Com `kind: 'opening'`: `{ kind, width }`. |

### DrawArgs

```ts
interface DrawArgs {
  ctx: CanvasRenderingContext2D;
  w: number;                                   // largura em cm
  d: number;                                   // profundidade em cm
  colors: Record<string, string>;              // colors + colorKeys resolvidos pelo item
  px?: number;                                 // pixels por cm (detalhes dependentes do zoom)
}
```

### colorKeys

`palette` aceita apenas: `wood`, `fabric`, `metal`, `stone`, `paint`, `plant`, `glass`.

### Helpers 2D

Importe de `../../catalog/draw`: `box`, `circle`, `line`, `rr`, `cushion`, `grain`, `hatch`, `knob`, `metalBar`, `glass`, `softShadow`, `text`, `shade`, `alpha`, constantes `LINE` e `LINE_SOFT`.

Quando a ajuda servir a várias peças da mesma família, crie `src/furniture/shared/<familia>.ts` (ex.: `shared/assentos.ts` exporta `drawSofa`).

## model.ts

Gere o modelo em TypeScript para o motor Three.js do projeto. Dimensões e coordenadas em centímetros.

```ts
import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, coneAt } from '../../view3d/modelApi';

export const modelId = 'mesa-reuniao';
export const modelHeight = 76;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  // adiciona geometria a body
}
```

| Export | Obrigatório | Descrição |
| --- | --- | --- |
| `modelId` | sim | Mesmo `id` da pasta e da `FurnitureDef`. |
| `build(context)` | sim | Adiciona a geometria a `context.body`. |
| `modelHeight` | não | Altura total em cm. Sem ele, usa a altura da categoria. |
| `modelBase` | não | Elevação inicial da base em cm. `> 0` liga o ajuste de altura (inspetor + alça 3D), para pendentes, coifas, espelhos e prateleiras. |

### ModelBuildContext

```ts
interface ModelBuildContext {
  body: THREE.Group;    // grupo local; origem no centro da base
  palette: Palette;     // dimensões e acabamentos resolvidos
  item: Item;           // item da planta (defId, colors, elevation, ...)
  main: string;         // cor principal resolvida
  height: number;       // altura efetiva em cm
}
```

### Palette

```ts
type Palette = {
  w: number; d: number; h: number;
  base: number;         // elevação da base
  ceil: number;         // espaço livre até o teto (WALL_HEIGHT - base)
  main: string; accent: string; dark: string; light: string; metal: string;
  id: string;
};
```

`ceil` é o que permite pendentes e coifas se pendurarem do teto.

### Coordenadas e limites

- Use centímetros. `WALL_HEIGHT` é 262 cm.
- O app posiciona e gira `body`; **não altere** posição ou rotação do grupo recebido.
- Eixos locais: `x` largura, `z` profundidade, `y` vertical.
- A origem é o centro da base. A face do chão está em `baseY = 0`.
- Mantenha a geometria dentro de `palette.w × palette.d × palette.h`.

### Primitivas 3D

Importe de `../../view3d/modelApi` (reexporta `./materials`). Atenção: a ordem dos parâmetros **muda entre primitivas**.

```ts
boxAt(parent, w, d, h, x, z, baseY, color,
      opacity = 1, rotY = 0, kind = 'matte')

roundedBoxAt(parent, w, d, h, x, z, baseY, color,
             radius = 1.6, kind = 'matte', opacity = 1,
             rotY = 0, rotX = 0, rotZ = 0)

cylinderAt(parent, radius, h, x, z, baseY, color,
           opacity = 1, kind = 'matte')

coneAt(parent, radiusTop, radiusBottom, h, x, z, baseY, color,
       opacity = 1, kind = 'matte', radialSegments = 24, openEnded = false)

sphereAt(parent, radius, x, y, z, color,
         scale = [1, 1, 1], kind = 'matte', opacity = 1)

latheAt(parent, profile: Array<[radius, y]>, x, z, baseY, color,
        kind = 'ceramic', segments = 28, scaleX = 1, scaleZ = 1, opacity = 1)

torusAt(parent, radius, tube, x, z, y, color,
        kind = 'chrome', rotX = Math.PI / 2, rotY = 0, arc = Math.PI * 2, opacity = 1)

tubeAt(parent, points: Array<[x, y, z]>, radius, x, z, baseY, color,
       kind = 'chrome', opacity = 1)
```

Diferenças que derrubam o código quando ignoradas:

- Em `roundedBoxAt`, `radius` e `kind` vêm **antes** de `opacity` — em `boxAt`, `opacity` vem antes de `kind`.
- `sphereAt` usa `x`, `y`, `z` absolutos (sem `baseY`).
- `torusAt` usa `x`, `z`, `y` nessa ordem (não `x`, `y`, `z`).
- `latheAt` recebe o perfil como `[raio, y]` e usa `baseY` como origem vertical.
- `baseY` em `boxAt`, `roundedBoxAt`, `cylinderAt`, `coneAt`, `latheAt` e `tubeAt` indica a **face inferior** da peça.

### MaterialKind

`matte`, `wood`, `fabric`, `metal`, `chrome`, `glass`, `ceramic`, `stone`, `paint`, `wallPaint`, `screen`, `screenGlow`, `foliage`, `emissive`, `water`.

### Acabamentos

Use as cores de `palette` (`main`, `accent`, `dark`, `light`, `metal`) para seguir o que o inspetor escolher.

## Helpers de alto nível (opcional, recomendado)

As peças existentes não montam tudo à mão: importam `../../view3d/modelShared`, que reexporta as primitivas e traz construtores prontos por família.

```ts
import * as shared from '../../view3d/modelShared';

export const modelId = 'cama-casal';
export const modelHeight = 52;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  shared.bed(body, palette);
}
```

Disponíveis: `bed`, `table`, `roundTable`, `desk`, `sofa`, `wardrobe`, `drawers`, `counter`, `appliance`, `bunkBed`, `mediaWall`, `openCloset`, `floatingVanity`, `plant`, `stairs`, `pisoItem`, `fourLegs`, `slabWithHole`, `basin`, `faucet`, `bar`, `rakedLeg`, `bottle`, `clothColors`, `generic`.

Também exporta constantes de cor (`CHROME`, `STEEL`, `DARK_METAL`, `PORCELAIN`, `GLASS`), `DEG`, `hash`, `CATEGORY_HEIGHT` e os tipos `Palette`, `G`, `MaterialKind`, `ModelSize`.

Quando um construtor de família servir a várias peças, ele pertence a `src/view3d/modelShared.ts`; se for específico de uma peça, escreva o `build` no `model.ts`.

## Exemplo completo: uma cadeira

Pacote inteiro de uma cadeira de jantar (`src/furniture/cadeira-exemplo/`). Use este par como molde de saída: metadados, desenho 2D e modelo 3D coerentes entre si.

Medidas: 48 cm de largura, 52 cm de profundidade, 92 cm de altura, assento a 45 cm.

### definition.ts

~~~ts
import type { FurnitureDef } from '../../catalog/types';
import { alpha, box, circle, cushion, shade } from '../../catalog/draw';

export default {
  id: 'cadeira-exemplo',
  name: 'Cadeira',
  category: 'assentos',
  w: 48,
  d: 52,
  keywords: ['cadeira', 'jantar', 'mesa'],
  colors: { main: '#c19a6b', accent: '#ded4c1' },
  colorKeys: [
    { key: 'main', label: 'Estrutura', palette: 'wood' },
    { key: 'accent', label: 'Assento', palette: 'fabric' },
  ],
  draw: ({ ctx, w, d, colors }) => {
    // encosto: fica na borda superior do desenho, que corresponde ao fundo (-z) no 3D
    box(ctx, 4, 1, w - 8, 11, 4, colors.main, alpha('#3a2c1e', 0.4), 1.3);
    // pernas dianteiras
    box(ctx, 3, 6, 6, d - 10, 3, colors.main, null);
    box(ctx, w - 9, 6, 6, d - 10, 3, colors.main, null);
    // assento estofado
    cushion(ctx, 6, 13, w - 12, d - 20, 5, colors.accent);
    // ponteiros das pernas traseiras
    circle(ctx, 7, d - 4, 2, shade(colors.main, -0.25), null);
    circle(ctx, w - 7, d - 4, 2, shade(colors.main, -0.25), null);
  },
} satisfies FurnitureDef;
~~~

### model.ts

~~~ts
import type { ModelBuildContext } from '../../view3d/modelApi';
import { boxAt, coneAt, roundedBoxAt } from '../../view3d/modelApi';

export const modelId = 'cadeira-exemplo';
export const modelHeight = 92;
export const modelBase = 0;

export function build({ body, palette }: ModelBuildContext): void {
  const { w, d, h, main, accent, dark } = palette;
  const a = w / 2;
  const b = d / 2;
  const seatY = 45;

  // pernas: as de trás sobem até o encosto, as da frente param no assento
  for (const sx of [-1, 1]) {
    coneAt(body, 2, 2.5, h - 6, sx * (a - 3.5), -b + 4, 0, main, 1, 'wood', 10);
    coneAt(body, 1.6, 2.1, seatY - 4, sx * (a - 3.5), b - 4, 0, main, 1, 'wood', 10);
  }

  // estrutura do assento e estofado por cima
  roundedBoxAt(body, w - 2, d - 4, 5, 0, 1, seatY - 5, main, 1.4, 'wood');
  roundedBoxAt(body, w - 10, d - 12, 4, 0, 1, seatY, accent, 1.8, 'fabric');
  boxAt(body, w - 14, 3, 5, 0, -b + 8, seatY - 10, dark, 1, 0, 'wood');

  // montantes e travessa superior do encosto
  for (const sx of [-1, 1]) {
    boxAt(body, 3.4, 4, h - seatY - 2, sx * (a - 3.5), -b + 4, seatY - 2, main, 1, 0, 'wood');
  }
  roundedBoxAt(body, w - 8, 3.6, 10, 0, -b + 4.4, h - 16, main, 1.2, 'wood');

  // ripas verticais entre assento e travessa
  for (let i = 0; i < 3; i++) {
    const x = -a + 11 + ((w - 22) * i) / 2;
    boxAt(body, 2.2, 2.2, h - seatY - 21, x, -b + 4, seatY + 6, main, 1, 0, 'wood');
  }
}
~~~

### Pontos que fazem o par funcionar

- O encosto fica em `-z` no 3D e na **borda superior** do desenho 2D. A convenção é: topo do desenho 2D = fundo da peça (`-z`); base do desenho = frente (`+z`).
- `seatY = 45` aparece no 2D (altura do estofado dentro de `d`) e no 3D (altura do assento), mantendo os dois coerentes.
- `modelHeight = 92` é a altura total, usada pelo inspetor e pela alça de elevação.
- `accent` é o estofado nos dois lados; `main` é a madeira. Assim o inspetor troca os dois acabamentos e o 2D/3D acompanham.
- As pernas usam `coneAt` com raio de topo menor que o da base (2 e 2,5), o que dá o afunilamento típico de cadeira.

## Como integrar uma peça nova

1. Crie `src/furniture/<id>/definition.ts` com os metadados e o desenho 2D.
2. Se a peça tiver 3D próprio, crie `src/furniture/<id>/model.ts` na mesma pasta.
3. Rode `npm run typecheck`.
4. Pronto: catálogo, miniaturas, busca e vista 3D passam a incluir a peça. Nenhum arquivo central precisa ser alterado.

Peças sem `model.ts` continuam no catálogo e na planta 2D; na vista 3D elas usam o modelo genérico da categoria.

## Prompt curto para gerar o pacote

Gere um pacote de móvel para o projeto casaTopView conforme este documento: crie `src/furniture/<id>/definition.ts` com a `FurnitureDef` (id igual ao nome da pasta em kebab-case, categoria da lista válida, medidas em centímetros, `colors`, `colorKeys` com palette válida e `draw` vetorial visto de cima usando os helpers de `catalog/draw`) e, se solicitado, `src/furniture/<id>/model.ts` com `modelId`, `modelHeight`, `modelBase` e `build`.

No 3D: use as primitivas de `view3d/modelApi` (respeitando a ordem de parâmetros de cada uma) ou os construtores de família de `view3d/modelShared`; mantenha a origem no centro da base, a geometria dentro de `palette.w × palette.d × palette.h` e não altere a transformação do grupo recebido.
