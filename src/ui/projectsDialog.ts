/** Diálogo "Meus projetos". */
import { examplePlan, clonePlan } from '../core/document';
import type { Plan } from '../core/document';
import {
  deletePlan,
  getProjectMeta,
  listProjects,
  loadPlan,
  savePlan,
} from '../core/persistence';
import type { ProjectMeta } from '../core/persistence';
import { uid } from '../core/ids';
import type { Store } from '../core/store';
import { planThumb } from '../render/thumbnail';
import { button, el, openModal } from './controls';
import type { ModalHandle } from './controls';

export interface ProjectsDeps {
  store: Store;
  onOpen: (plan: Plan) => void;
  notify: (message: string) => void;
  onImportJson: () => void;
}

export function openProjectsDialog(deps: ProjectsDeps): void {
  const { store, onOpen, notify, onImportJson } = deps;
  const grid = el('div', { class: 'project-grid' });
  let modal: ModalHandle | null = null;

  function openProject(id: string): void {
    const plan = loadPlan(id);
    if (!plan) {
      notify('Não foi possível abrir o projeto');
      return;
    }
    modal?.close();
    onOpen(plan);
  }

  function startRename(meta: ProjectMeta, target: HTMLElement): void {
    const input = el('input', {
      type: 'text',
      value: meta.name,
      class: 'input',
      style: { height: '26px' },
    }) as HTMLInputElement;
    target.replaceWith(input);
    input.focus();
    input.select();
    let done = false;
    const commit = (): void => {
      if (done) return;
      done = true;
      const value = input.value.trim();
      if (value && value !== meta.name) {
        const plan = loadPlan(meta.id);
        if (plan) {
          plan.name = value;
          savePlan(plan, meta.thumb, false);
          if (plan.id === store.doc.id) {
            store.doc.name = value;
            store.emit();
          }
        }
      }
      renderList();
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') input.blur();
      if (event.key === 'Escape') {
        done = true;
        renderList();
      }
    });
  }

  function duplicate(meta: ProjectMeta): void {
    const plan = loadPlan(meta.id);
    if (!plan) return;
    const copy = clonePlan(plan);
    copy.id = uid('plan');
    copy.name = `${plan.name} (cópia)`;
    savePlan(copy, meta.thumb, false);
    renderList();
    notify('Projeto duplicado');
  }

  function remove(meta: ProjectMeta): void {
    if (meta.id === store.doc.id) {
      notify('Abra outro projeto antes de excluir o que está aberto');
      return;
    }
    if (!window.confirm(`Excluir "${meta.name}"? Essa ação não pode ser desfeita.`)) return;
    deletePlan(meta.id);
    renderList();
    notify('Projeto excluído');
  }

  function renderList(): void {
    const projects = listProjects();
    grid.replaceChildren();
    if (!projects.length) {
      grid.append(el('div', { class: 'catalog-empty' }, 'Nenhum projeto salvo ainda. Comece por um projeto novo.'));
    }

    for (const meta of projects) {
      const current = meta.id === store.doc.id;
      const card = el('div', { class: `project-card${current ? ' current' : ''}` });
      const thumb = el('div', { class: 'thumb' });
      if (meta.thumb) {
        thumb.append(el('img', { src: meta.thumb, alt: '' }));
      } else {
        thumb.append(el('span', { style: { color: 'var(--ink-faint)', fontSize: '11px' } }, 'sem miniatura'));
      }
      thumb.addEventListener('click', () => openProject(meta.id));

      const name = el('b', { title: 'Clique para renomear' }, meta.name);
      name.addEventListener('click', () => startRename(meta, name));
      const when = new Date(meta.updatedAt).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      card.append(
        thumb,
        el('div', { class: 'meta' }, name, el('span', {}, when)),
        el(
          'div',
          { class: 'row-actions', style: { padding: '0 10px 10px' } },
          button({ label: 'Abrir', variant: 'ghost', onClick: () => openProject(meta.id) }),
          button({
            icon: 'copy',
            variant: 'ghost icon sm',
            title: 'Duplicar projeto',
            onClick: () => duplicate(meta),
          }),
          button({
            icon: 'trash',
            variant: 'ghost icon sm danger',
            title: 'Excluir projeto',
            onClick: () => remove(meta),
          }),
        ),
      );
      grid.append(card);
    }
  }

  const footer = el(
    'div',
    { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' } },
    el('span', { style: { fontSize: '11px', color: 'var(--ink-faint)' } }, 'Salvo automaticamente neste navegador'),
    el(
      'div',
      { class: 'modal-actions' },
      button({ label: 'Importar JSON', icon: 'upload', onClick: onImportJson }),
      button({
        label: 'Casa exemplo',
        icon: 'plan',
        onClick: () => {
          const existing = listProjects().find((p) => p.name === 'Casa Exemplo');
          if (existing) {
            openProject(existing.id);
            return;
          }
          const example = examplePlan();
          savePlan(example, planThumb(example));
          modal?.close();
          onOpen(example);
        },
      }),
      button({
        label: 'Novo projeto',
        icon: 'plus',
        variant: 'primary',
        onClick: () => {
          const plan = examplePlan();
          /* projeto novo aproveita apenas as configurações, sem conteúdo */
          const blank: Plan = {
            ...plan,
            id: uid('plan'),
            name: 'Nova planta',
            walls: [],
            openings: [],
            rooms: [],
            items: [],
          };
          savePlan(blank);
          modal?.close();
          onOpen(blank);
        },
      }),
    ),
  );

  renderList();

  modal = openModal({
    title: 'Meus projetos',
    subtitle: 'Tudo fica salvo no armazenamento deste navegador. Exporte em JSON para backup.',
    body: grid,
    footer,
  });

  void getProjectMeta;
}
