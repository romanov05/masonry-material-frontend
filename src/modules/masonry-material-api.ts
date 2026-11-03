import type { MasonryMaterial } from './masonry-material-types';
import { MASONRY_MATERIAL_MOCK } from './masonry-material-mock';

const MASONRY_MATERIAL_MOCK_DELAY_MS = 300; // имитация задержки запроса

const waitMasonryMaterialMock = () =>
  new Promise<void>((resolve) => setTimeout(resolve, MASONRY_MATERIAL_MOCK_DELAY_MS));

const getSortedMasonryMaterialMock = () =>
  [...MASONRY_MATERIAL_MOCK].sort((first, second) => first.id - second.id);

// список услуг с фильтром: расход не больше maxConsumption
export async function getMasonryMaterials(maxConsumption?: number): Promise<MasonryMaterial[]> {
  await waitMasonryMaterialMock();
  return getSortedMasonryMaterialMock().filter(
    (material) =>
      maxConsumption === undefined ||
      (material.consumptionPerM3 !== null && material.consumptionPerM3 <= maxConsumption),
  );
}

// лента: next без id — первая услуга, с id — эта услуга, с id и next — следующая по кругу
export async function getMasonryMaterialFeedItem(
  id?: number,
  next = false,
): Promise<MasonryMaterial | null> {
  await waitMasonryMaterialMock();
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
