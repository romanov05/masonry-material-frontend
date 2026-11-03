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
  isMine: 0 | 1;
  likesCount: number;
  isLiked: 0 | 1;
}
