/** Persistência local: lista de projetos + plantas + autosave. */
import type { Plan } from './document';
import { normalizePlan } from './document';
import { notify } from '../ui/toast';

const INDEX_KEY = 'casatopview.index.v1';
const PLAN_KEY = 'casatopview.plan.v1.';
const CURRENT_KEY = 'casatopview.current.v1';

/** Evita repetir o aviso a cada autosave depois que a cota estourou. */
let quotaWarned = false;

function warnStorage(error: unknown): void {
  console.warn('Falha ao salvar a planta (armazenamento cheio?)', error);
  const quota = error instanceof DOMException && error.name === 'QuotaExceededError';
  if (!quota || quotaWarned) return;
  quotaWarned = true;
  notify('Armazenamento do navegador cheio — exporte a planta em JSON ou remova a imagem de fundo');
}

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt: number;
  thumb?: string;
}

function readIndex(): ProjectMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProjectMeta[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => p && typeof p.id === 'string');
  } catch {
    return [];
  }
}

function writeIndex(index: ProjectMeta[]): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.warn('Não foi possível salvar a lista de projetos', error);
  }
}

export function listProjects(): ProjectMeta[] {
  return readIndex().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getProjectMeta(id: string): ProjectMeta | undefined {
  return readIndex().find((p) => p.id === id);
}

export function savePlan(plan: Plan, thumb?: string, setCurrent = true): void {
  try {
    localStorage.setItem(PLAN_KEY + plan.id, JSON.stringify(plan));
    const index = readIndex();
    const existing = index.find((p) => p.id === plan.id);
    if (existing) {
      existing.name = plan.name;
      existing.updatedAt = Date.now();
      if (thumb) existing.thumb = thumb;
    } else {
      index.push({ id: plan.id, name: plan.name, updatedAt: Date.now(), thumb });
    }
    writeIndex(index);
    if (setCurrent) localStorage.setItem(CURRENT_KEY, plan.id);
    quotaWarned = false;
  } catch (error) {
    warnStorage(error);
  }
}

export function loadPlan(id: string): Plan | null {
  try {
    const raw = localStorage.getItem(PLAN_KEY + id);
    if (!raw) return null;
    return normalizePlan(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function deletePlan(id: string): void {
  try {
    localStorage.removeItem(PLAN_KEY + id);
    writeIndex(readIndex().filter((p) => p.id !== id));
    if (localStorage.getItem(CURRENT_KEY) === id) localStorage.removeItem(CURRENT_KEY);
  } catch {
    /* ignora */
  }
}

export function currentProjectId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

export function setCurrentProjectId(id: string): void {
  localStorage.setItem(CURRENT_KEY, id);
}

/** Autosave com debounce; retorna o agendador e o cancelador. */
export function createAutosave(delay = 700) {
  let timer: number | null = null;
  let pending = false;

  const flush = (getPlan: () => Plan, getThumb: () => string | undefined): void => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
    if (!pending) return;
    pending = false;
    savePlan(getPlan(), getThumb());
  };

  return {
    schedule(getPlan: () => Plan, getThumb: () => string | undefined): void {
      pending = true;
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        flush(getPlan, getThumb);
      }, delay);
    },
    flush,
    get isPending(): boolean {
      return pending;
    },
  };
}
