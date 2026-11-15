import type { MasonryMaterial } from './masonry-material-types';
import { MASONRY_MATERIAL_MOCK } from './masonry-material-mock';

// mock-данные подставляются для гостя, когда веб-сервис недоступен

const getSortedMasonryMaterialMock = () =>
  [...MASONRY_MATERIAL_MOCK].sort((first, second) => first.id - second.id);

// список услуг с фильтром: расход не больше maxConsumption
export function getMasonryMaterialMockList(maxConsumption?: number): MasonryMaterial[] {
  return getSortedMasonryMaterialMock().filter(
    (material) =>
      maxConsumption === undefined ||
      (material.consumptionPerM3 !== null && material.consumptionPerM3 <= maxConsumption),
  );
}

// лента: next без id — первая услуга, с id — эта услуга, с id и next — следующая по кругу
export function getMasonryMaterialMockFeedItem(id?: number, next = false): MasonryMaterial | null {
  const materials = getSortedMasonryMaterialMock();
  if (materials.length === 0) {
    return null;
  }
  if (id === undefined) {
    return next ? materials[0] : null;
  }
  if (next) {
    return materials.find((material) => material.id > id) ?? materials[0];
  }
  return materials.find((material) => material.id === id) ?? null;
}
