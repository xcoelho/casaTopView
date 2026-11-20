# Memory

## Project Overview

casaTopView — editor de plantas baixas 2D + vista 3D, 100% front-end. See @README.md for features and @package.json for scripts.

Stack: Vite + TypeScript + Three.js (sem dependências além de `three`). Entrada dev: `index.html` -> `src/main.ts`. Saída offline autocontida: `dist/index.html` (script `scripts/inline-dist.mjs`).

## Subagent Workflow (sempre seguir em tarefas de código)

Este projeto tem 3 papéis definidos em `.commandcode/agents/` (`planner.md`, `executor.md`, `reviewer.md`), mas a ferramenta `agent` só aceita `subagent_type` = `general`, `explore` ou `plan`. Não existe `subagent_type` = `executor/planner/reviewer` — tentar isso falha com "Unknown subagent_type" e nada executa.

Como aplicar na prática:

- `planner` = delegar com `subagent_type` `plan` ou `explore` (ou `general` com o prompt do `planner.md`). Só planeja, nunca edita.
- `executor` = delegar com `subagent_type` `general` incluindo as regras do `executor.md` no prompt (uma tarefa por vez, edição mínima, roda o teste, devolve o diff). Se a delegação falhar/interromper, executar direto seguindo as mesmas regras — e conta como tentativa (ver Regras anti-loop).
- `reviewer` = delegar com `subagent_type` `general` e `model: deepseek/deepseek-v4.1-flash` (fixado em `.commandcode/agents/reviewer.md`), incluindo as regras do `reviewer.md` (revisa diff sem reimplementar, veredito APROVADO/REPROVADO). O `reasoningEffort: max` do arquivo só vale se o agente customizado for invocado direto, o que a ferramenta `agent` não permite hoje: na prática a revisão roda no effort padrão do modelo. Se `shell_command` estiver bloqueado pelo permission mode da sessão, passar o output do `npm run typecheck` dentro do próprio prompt. Se falhar, eu mesmo reviso (conta como a revisão daquela tentativa).

## Regras anti-loop (contadores obrigatórios)

Antes de CADA delegação, anunciar o estado em texto: "Tarefa N — tentativa X/3 — orçamento global restante Y". O contador de tentativas é o teto-mestre; os limites de no-op e de revisões são sub-limites dentro dele. Nenhum caminho pode re-delegar sem incrementar contador.

1. **Tentativa**: TODA invocação do executor conta — delegada ou direta, com diff ou sem diff, compilando ou não, concluída ou interrompida. Incrementar ANTES de executar. Teto: 3 tentativas por tarefa.
2. **No-op** ("completed" sem alterar nenhum arquivo): conta como tentativa. No máximo 1 repetição com prompt reforçado (exigindo `edit_file` de verdade). Se o 2º resultado também for no-op, PROIBIDO delegar de novo para essa tarefa: executar direto (conta como tentativa) ou parar e perguntar ao usuário.
3. **Typecheck/build reprovado**: conta como tentativa (já incrementada). Diff que não compila não vai para o `reviewer`. Voltar ao executor com o erro de compilação apenas se houver orçamento; senão, escalar (regra 5).
4. **Revisões**: numeradas em sequência própria (1ª, 2ª, 3ª), contando apenas as tentativas que chegaram ao reviewer. Tentativa que falha no typecheck ou termina em no-op não gera revisão. Cada revisão consome uma tentativa, logo nunca há mais de 3 revisões por tarefa. Se a 3ª revisão vier REPROVADA, parar e escalar (regra 5).
5. **Esgotamento / escala**: PARAR se a tarefa chegar a 3 tentativas sem APROVADO, OU se o orçamento global da demanda esgotar (regra 6) — em qualquer estado final: typecheck reprovado, no-op ou REPROVADO. Apresentar ao usuário: diff atual (`git diff --stat` + arquivos), problemas do reviewer, erros de compilação e/ou histórico de no-ops (o que houver), contadores de tentativas e revisões, e pedir decisão: (a) autorizar mais N tentativas, (b) mudar o escopo, (c) assumir o risco. Somente o usuário pode estender o orçamento, explicitamente (registrar: "autorizado +2 tentativas na tarefa 3"). Sem resposta do usuário, não executar mais nada.
6. **Orçamento por demanda**: teto global = 3 × nº de tarefas do plano inicial. Re-planejar, renomear ou quebrar tarefa NÃO zera nem cria orçamento — tarefas novas consomem o mesmo bolo. Re-invocar o `planner` depois de iniciado o fluxo exige decisão do usuário.
7. **Pós-aprovação**: qualquer edição após APROVADO invalida o veredito. Novo ciclo de checagem + revisão conta como tentativa; sem orçamento → escalar (regra 5).
8. **Falha de infraestrutura**: se a ferramenta `agent` falhar ao iniciar 2× seguidas, parar e reportar ao usuário — não ficar re-tentando a delegação. Execução direta segue as mesmas regras e conta como tentativa.

Todo esgotamento termina em pergunta ao usuário, nunca em nova delegação automática.

## Fluxo obrigatório para qualquer mudança em `src/`

1. **Planejar**: delegar ao `planner` primeiro (explorar código, listar tarefas prontas para executor, com critério de aceite). Registrar o nº de tarefas N → orçamento global = 3 × N.
2. **Executar**: verificar contador da tarefa e orçamento global (regras 1 e 6). Sem orçamento → escalar (regra 5). Com orçamento: incrementar tentativa, anunciar o estado e delegar UMA tarefa ao `executor`.
3. **Conferir diff**: `git status` + `git diff --stat`. Se devolveu "completed" sem alterar arquivos → aplicar regra 2 (conta tentativa; máx. 1 repetição reforçada; depois direto ou parar).
4. **Compilar**: rodar `npm run typecheck` (ou `npm run build`) antes de revisar. Falhou → regra 3 (não vai ao reviewer; correção só com orçamento).
5. **Revisar**: delegar o diff ao `reviewer`. REPROVADO → voltar ao passo 2 com as correções apontadas, se houver orçamento. 3ª revisão REPROVADA ou orçamento esgotado → escalar (regras 4 e 5).
6. **Pronto**: somente após APROVADO + typecheck/build verde. Edição posterior invalida o veredito (regra 7).

Não pular o planner em tarefas com 3+ arquivos. Não reimplementar no review.

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