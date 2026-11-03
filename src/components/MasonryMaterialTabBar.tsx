import type { FC } from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';

interface MasonryMaterialTabBarItem {
  label: string;
  path: string;
  to: string;
  enabled: boolean; // гостю доступны только «Лента» и «Плитка»
}

const MASONRY_MATERIAL_TAB_BAR_ITEMS: MasonryMaterialTabBarItem[] = [
  {
    label: 'Лента',
    path: MASONRY_MATERIAL_ROUTES.FEED,
    to: `${MASONRY_MATERIAL_ROUTES.FEED}?next=true`, // первая услуга
    enabled: true,
  },
  {
    label: 'Добавление',
    path: MASONRY_MATERIAL_ROUTES.DRAFT,
    to: MASONRY_MATERIAL_ROUTES.DRAFT,
    enabled: false,
  },
  {
    label: 'Плитка',
    path: MASONRY_MATERIAL_ROUTES.TILES,
    to: MASONRY_MATERIAL_ROUTES.TILES,
    enabled: true,
  },
  {
    label: 'Вход',
    path: MASONRY_MATERIAL_ROUTES.LOGIN,
    to: MASONRY_MATERIAL_ROUTES.LOGIN,
    enabled: false,
  },
];

export const MasonryMaterialTabBar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Nav as="nav" className="masonry-material-tabbar">
      {MASONRY_MATERIAL_TAB_BAR_ITEMS.map((item) => (
        <Nav.Item key={item.label}>
          <Nav.Link
            as="button"
            type="button"
            className="masonry-material-tabbar__item"
            active={isActive(item.path)}
            disabled={!item.enabled}
            onClick={() => navigate(item.to)}
          >
            {item.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};
