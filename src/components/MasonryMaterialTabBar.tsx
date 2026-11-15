import { useState, type FC } from 'react';
import { Nav, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';
import { logoutMasonryMaterialUser } from '../modules/masonry-material-user-api';
import { useMasonryMaterialDispatch, useMasonryMaterialSelector } from '../store';
import { resetMasonryMaterialUser } from '../slices/masonryMaterialUserSlice';
import { resetMasonryMaterialFilter } from '../slices/masonryMaterialSlice';

interface MasonryMaterialTabBarItem {
  label: string;
  path: string;
  to: string;
  enabled: boolean;
}

export const MasonryMaterialTabBar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useMasonryMaterialDispatch();
  const isAuthenticated = useMasonryMaterialSelector(
    (state) => state.masonryMaterialUser.isAuthenticated,
  );
  const [logoutLoading, setLogoutLoading] = useState(false);

  const items: MasonryMaterialTabBarItem[] = [
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
      enabled: isAuthenticated, // гостю недоступно
    },
    {
      label: 'Плитка',
      path: MASONRY_MATERIAL_ROUTES.TILES,
      to: MASONRY_MATERIAL_ROUTES.TILES,
      enabled: true,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  // выход: сессия удаляется на бэкенде, состояние сбрасывается до гостя вместе с фильтром
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutMasonryMaterialUser();
    } catch {
      // сессия могла истечь — гостем пользователь становится в любом случае
    } finally {
      dispatch(resetMasonryMaterialUser());
      dispatch(resetMasonryMaterialFilter());
      setLogoutLoading(false);
      navigate(MASONRY_MATERIAL_ROUTES.TILES);
    }
  };

  return (
    <Nav as="nav" className="masonry-material-tabbar">
      {items.map((item) => (
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

      <Nav.Item>
        {isAuthenticated ? (
          <Nav.Link
            as="button"
            type="button"
            className="masonry-material-tabbar__item"
            disabled={logoutLoading}
            onClick={handleLogout}
          >
            {logoutLoading ? <Spinner animation="border" size="sm" /> : 'Выход'}
          </Nav.Link>
        ) : (
          <Nav.Link
            as="button"
            type="button"
            className="masonry-material-tabbar__item"
            active={isActive(MASONRY_MATERIAL_ROUTES.LOGIN)}
            onClick={() => navigate(MASONRY_MATERIAL_ROUTES.LOGIN)}
          >
            Вход
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};
