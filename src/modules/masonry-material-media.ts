// бэкенд отдаёт полный адрес MinIO (http://localhost:9000/masonry-material-media/…);
// путь без хоста загружается через прокси vite
const MASONRY_MATERIAL_MEDIA_URL = /^https?:\/\/[^/]+(\/masonry-material-media\/.+)$/;

export const getMasonryMaterialMediaUrl = (url: string | null, defaultUrl: string): string => {
  if (!url) {
    return defaultUrl;
  }
  return url.match(MASONRY_MATERIAL_MEDIA_URL)?.[1] ?? url;
};
