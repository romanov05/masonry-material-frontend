import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { MasonryMaterialTabBar } from './components/MasonryMaterialTabBar';

export const MasonryMaterialLayout: FC = () => (
  <div className="masonry-material-screen">
    <main className="masonry-material-content">
      <Outlet />
    </main>
    <MasonryMaterialTabBar />
  </div>
);
