import type { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MasonryMaterialLayout } from './MasonryMaterialLayout';
import { MasonryMaterialTilesPage } from './pages/MasonryMaterialTilesPage';
import { MasonryMaterialFeedPage } from './pages/MasonryMaterialFeedPage';
import { MasonryMaterialDraftPage } from './pages/MasonryMaterialDraftPage';
import { MasonryMaterialLoginPage } from './pages/MasonryMaterialLoginPage';
import { MASONRY_MATERIAL_ROUTES } from './masonry-material-routes';
import { useMasonryMaterialSelector } from './store';

export const App: FC = () => {
  const isAuthenticated = useMasonryMaterialSelector(
    (state) => state.masonryMaterialUser.isAuthenticated,
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MasonryMaterialLayout />}>
          <Route path={MASONRY_MATERIAL_ROUTES.TILES} element={<MasonryMaterialTilesPage />} />
          <Route path={MASONRY_MATERIAL_ROUTES.FEED} element={<MasonryMaterialFeedPage />} />
          {/* добавление — только для авторизованного пользователя */}
          {isAuthenticated && (
            <Route path={MASONRY_MATERIAL_ROUTES.DRAFT} element={<MasonryMaterialDraftPage />} />
          )}
          <Route path={MASONRY_MATERIAL_ROUTES.LOGIN} element={<MasonryMaterialLoginPage />} />
          <Route path="*" element={<Navigate to={MASONRY_MATERIAL_ROUTES.TILES} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
