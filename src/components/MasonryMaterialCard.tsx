import type { FC } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { MasonryMaterial } from '../modules/masonry-material-types';
import { MASONRY_MATERIAL_DEFAULT_IMAGE } from '../modules/masonry-material-defaults';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';

interface MasonryMaterialCardProps {
  material: MasonryMaterial;
}

export const MasonryMaterialCard: FC<MasonryMaterialCardProps> = ({ material }) => (
  <Link to={`${MASONRY_MATERIAL_ROUTES.FEED}?id=${material.id}`} className="masonry-material-card__link">
    <Card className="masonry-material-card h-100">
      <Card.Img
        variant="top"
        className="masonry-material-card__image"
        src={material.imageUrl || MASONRY_MATERIAL_DEFAULT_IMAGE} // изображение по умолчанию, если поле пустое
        alt={material.name}
      />
      <Card.Body className="masonry-material-card__body">
        <Card.Title className="masonry-material-card__name">{material.name}</Card.Title>
        <Card.Text className="masonry-material-card__consumption">
          Расход: {material.consumptionPerM3 ?? '—'} шт./м³
        </Card.Text>
        <Card.Text className="masonry-material-card__likes">❤ {material.likesCount}</Card.Text>
      </Card.Body>
    </Card>
  </Link>
);
