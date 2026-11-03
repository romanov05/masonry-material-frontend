import { useEffect, useState, type FC } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { MasonryMaterialCard } from '../components/MasonryMaterialCard';
import { MasonryMaterialConsumptionFilter } from '../components/MasonryMaterialConsumptionFilter';
import { getMasonryMaterials } from '../modules/masonry-material-api';
import type { MasonryMaterial } from '../modules/masonry-material-types';
import { MASONRY_MATERIAL_MAX_CONSUMPTION } from '../modules/masonry-material-defaults';

export const MasonryMaterialTilesPage: FC = () => {
  const [maxConsumption, setMaxConsumption] = useState(MASONRY_MATERIAL_MAX_CONSUMPTION);
  const [materials, setMaterials] = useState<MasonryMaterial[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMaterials = (limit: number) => {
    setLoading(true);
    getMasonryMaterials(limit)
      .then(setMaterials)
      .finally(() => setLoading(false));
  };

  // загрузка всех услуг при открытии страницы
  useEffect(() => {
    loadMaterials(MASONRY_MATERIAL_MAX_CONSUMPTION);
  }, []);

  return (
    <div className="masonry-material-tiles">
      <h1 className="masonry-material-tiles__title">Фильтрация: расход (в шт./м³) до</h1>

      <MasonryMaterialConsumptionFilter
        value={maxConsumption}
        max={MASONRY_MATERIAL_MAX_CONSUMPTION}
        loading={loading}
        onChange={setMaxConsumption}
        onSearch={() => loadMaterials(maxConsumption)}
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
              <MasonryMaterialCard material={material} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
