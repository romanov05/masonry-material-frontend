import { useEffect, type FC } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { MasonryMaterialCard } from '../components/MasonryMaterialCard';
import { MasonryMaterialConsumptionFilter } from '../components/MasonryMaterialConsumptionFilter';
import { MASONRY_MATERIAL_MAX_CONSUMPTION } from '../modules/masonry-material-defaults';
import { useMasonryMaterialDispatch, useMasonryMaterialSelector } from '../store';
import {
  deleteMasonryMaterial,
  getMasonryMaterialList,
  setMasonryMaterialMaxConsumption,
} from '../slices/masonryMaterialSlice';

export const MasonryMaterialTilesPage: FC = () => {
  const dispatch = useMasonryMaterialDispatch();
  const { maxConsumption, materials, loading } = useMasonryMaterialSelector(
    (state) => state.masonryMaterial,
  );
  const isAuthenticated = useMasonryMaterialSelector(
    (state) => state.masonryMaterialUser.isAuthenticated,
  );

  // загрузка услуг с текущим фильтром при открытии страницы
  useEffect(() => {
    dispatch(getMasonryMaterialList());
  }, [dispatch]);

  return (
    <div className="masonry-material-tiles">
      <h1 className="masonry-material-tiles__title">Фильтрация: расход (в шт./м³) до</h1>

      <MasonryMaterialConsumptionFilter
        value={maxConsumption}
        max={MASONRY_MATERIAL_MAX_CONSUMPTION}
        loading={loading}
        onChange={(value) => dispatch(setMasonryMaterialMaxConsumption(value))}
        onSearch={() => dispatch(getMasonryMaterialList())}
      />

      {loading && materials.length === 0 ? (
        <div className="masonry-material-loader">
          <Spinner animation="border" />
        </div>
      ) : materials.length === 0 ? (
        <p className="masonry-material-tiles__empty">Ничего не найдено</p>
      ) : (
        <Row xs={2} className="g-3 masonry-material-tiles__grid">
          {materials.map((material) => (
            <Col key={material.id}>
              <MasonryMaterialCard
                material={material}
                canDelete={isAuthenticated && material.isMine === 1}
                loading={loading}
                onDelete={(id) => dispatch(deleteMasonryMaterial(id))}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
