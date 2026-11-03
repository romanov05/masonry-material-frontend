import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MasonryMaterialLayout } from './MasonryMaterialLayout';
import { MasonryMaterialTilesPage } from './pages/MasonryMaterialTilesPage';
import { MasonryMaterialFeedPage } from './pages/MasonryMaterialFeedPage';
import { MASONRY_MATERIAL_ROUTES } from './masonry-material-routes';

export const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MasonryMaterialLayout />}>
        <Route path={MASONRY_MATERIAL_ROUTES.TILES} element={<MasonryMaterialTilesPage />} />
        <Route path={MASONRY_MATERIAL_ROUTES.FEED} element={<MasonryMaterialFeedPage />} />
        {/* главная и недоступные гостю страницы — на плитку */}
        <Route path="*" element={<Navigate to={MASONRY_MATERIAL_ROUTES.TILES} replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
