export interface MasonryMaterial {
  id: number;
  name: string;
  shortDescription: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  mortarPerM3: number | null; // раствор на 1 м³ кладки, м³
  consumptionPerM3: number | null; // расход, шт./м³
  createdAt: string;
  publishedAt: string | null;
  isMine: number; // 1 — услуга текущего пользователя
  likesCount: number;
  isLiked: number; // 1 — текущий пользователь поставил лайк
}
