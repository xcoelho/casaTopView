# casaTopView

Editor de plantas baixas em vista de cima para uso pessoal: desenhe paredes e cômodos, arraste móveis do catálogo, insira portas e janelas e confira o resultado numa vista 3D. Tudo roda no navegador, sem servidor, sem cadastro e sem internet — a planta fica salva no `localStorage` do próprio navegador.

**Versão online:** https://xcoelho.github.io/casaTopView/

## Funcionalidades

- **Desenho 2D** — ferramentas de parede, cômodo, porta, janela e medição, com encaixe (snap) em cantos, eixos e paredes, cotas automáticas, grade e barra de escala.
- **Catálogo de móveis** — 80 itens em 16 categorias (camas, mesas, assentos, armários, cozinha, banheiro, closet, eletro, escritório, gourmet, lavanderia, infantil, decoração, estrutura, externo e aberturas), com busca por nome e miniatura. Arraste um item da lista direto para a planta.
- **Edição precisa** — inspetor com posição, medidas, rotação, alinhamento, travar/desbloquear, duplicar e troca de materiais/acabamentos por item.
- **Cômodos** — ambientes fechados com nome, tipo de piso e área calculada; o total da planta aparece nos quantitativos.
- **Aberturas reais** — portas e janelas se prendem à parede mais próxima e abrem o vão de verdade na espessura da parede, com lado de dobradiça, inversão e cor da folha.
- **Vista 3D** — modelo gerado a partir da própria planta (paredes, pisos, aberturas e móveis), com órbita, zoom e materiais por categoria.
- **Imagem de fundo** — sobreponha um PDF/print de planta existente, com calibração de escala entre dois pontos clicados.
- **Quantitativos** — áreas de piso por ambiente, área de parede, rodapé, aberturas e contagem de móveis.
- **Exportação** — PDF (planta 2D + vista 3D, ou só um dos dois), PNG (inclusive com fundo transparente), CSV de quantitativos e JSON da planta.
- **Projetos** — vários projetos salvos no navegador, com salvamento automático, desfazer/refazer (80 passos) e importação/exportação de JSON.
- **Atalhos de teclado** — `V` selecionar, `P` parede, `C` cômodo, `T` porta, `J` janela, `M` medir, `3` vista 3D, `R` girar 90°, `Del` excluir, `Ctrl+Z`/`Ctrl+Shift+Z` desfazer/refazer, `Ctrl+D` duplicar, `Ctrl+C`/`Ctrl+V` copiar/colar, `Ctrl+0` enquadrar, `G` grade, `S` encaixe, `I` cotas, `L` travar, `Espaço`/botão direito para navegar. A lista completa está no botão **?** do app.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (o build do GitHub Actions usa o 22).
- npm (já vem com o Node).

Sem dependências além de `three`, e as ferramentas de desenvolvimento (`vite`, `typescript`, `@types/three`).

## Como rodar (desenvolvimento)

```bash
npm install
npm run dev
```

Abra <http://localhost:5173>. O servidor usa a porta 5173 com `strictPort`, então se ela estiver ocupada o comando falha em vez de trocar de porta.

Scripts disponíveis:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento do Vite com hot reload. |
| `npm run build` | Checagem de tipos (`tsc --noEmit`), build do Vite e empacotamento em `dist/index.html` autocontido. |
| `npm run build:web` | Igual ao anterior, mas sem o empacotamento: deixa `dist/` com os arquivos separados (JS e CSS). |
| `npm run preview` | Serve o `dist/` localmente para conferir o build. |
| `npm run typecheck` | Só a checagem de tipos. |

## Como buildar para usar offline

```bash
npm run build
```

O resultado é **`dist/index.html`**, um único arquivo com HTML, CSS e JavaScript embutidos (script `scripts/inline-dist.mjs`). Ele pode ser aberto com duplo clique (`file://`), copiado para um pendrive ou enviado por e-mail — não precisa de servidor nem de internet.

> Abrir o `index.html` da raiz pelo disco não funciona: ele é a entrada de desenvolvimento do Vite. Use `dist/index.html` ou o servidor de desenvolvimento.

## Publicação (GitHub Pages)

O workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) roda a cada push na branch `main`: instala as dependências com `npm ci`, roda `npm run build` e publica o conteúdo de `dist/` no GitHub Pages.

Para ativar na primeira vez, em **Settings → Pages**, defina **Source** como **GitHub Actions** (o workflow também tenta habilitar automaticamente). Depois disso, cada push em `main` atualiza <https://xcoelho.github.io/casaTopView/> em alguns minutos. Também é possível disparar manualmente em **Actions → Deploy no GitHub Pages → Run workflow**.

## Estrutura do projeto

```
index.html            entrada de desenvolvimento do Vite
scripts/
  inline-dist.mjs     embute JS/CSS em dist/index.html (arquivo único)
src/
  main.ts             ponto de entrada: monta a interface e liga tudo
  core/               modelo da planta, store com histórico, persistência, unidades, quantitativos
  catalog/            definições dos móveis (draw 2D, cores, medidas) e registro/busca
  render/             desenho 2D em canvas: camadas, viewport, tema, miniaturas
  interaction/        ponteiro, ferramentas (parede, cômodo, abertura, medir), mover, redimensionar, girar, encaixe, teclado
  view3d/             vista 3D em three.js: arquitetura, móveis, materiais, texturas, previews e snapshot
  ui/                 barra de ferramentas, catálogo, inspetor, diálogos, status bar, toasts
  export/             PNG, PDF (gerado à mão, sem dependências), CSV e JSON
  styles/             tokens, layout e componentes em CSS
```

## Dados e privacidade

Nada é enviado para servidor algum. As plantas ficam no `localStorage` do navegador, sob as chaves `casatopview.plan.v1.<id>`, `casatopview.index.v1` e `casatopview.current.v1`. Limpar os dados do site apaga os projetos, então exporte o JSON (ou um PDF) do que quiser guardar.

## Licença

[MIT](LICENSE).
