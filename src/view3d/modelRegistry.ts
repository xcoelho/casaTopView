/** Descobre modelos 3D que acompanham cada pacote de móvel. */
import type { FurnitureModelModule } from './modelApi';

const modules = import.meta.glob<FurnitureModelModule>('../furniture/*/model.ts', { eager: true });
const byId = new Map<string, FurnitureModelModule>();
for (const [file, model] of Object.entries(modules)) {
  const id = model.modelId?.trim();
  if (!id) throw new Error('Modelo 3D sem modelId: ' + file);
  if (byId.has(id)) throw new Error('modelId 3D duplicado: ' + id);
  if (model.modelHeight !== undefined && (!Number.isFinite(model.modelHeight) || model.modelHeight < 0)) {
    throw new Error('modelHeight inválido em ' + file);
  }
  if (model.modelBase !== undefined && (!Number.isFinite(model.modelBase) || model.modelBase < 0)) {
    throw new Error('modelBase inválido em ' + file);
  }
  byId.set(id, model);
}

export function getFurnitureModel(id: string): FurnitureModelModule | undefined {
  return byId.get(id);
}
