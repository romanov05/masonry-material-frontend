import type { FC } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { MasonryMaterial } from '../modules/masonry-material-types';
import { MASONRY_MATERIAL_DEFAULT_IMAGE } from '../modules/masonry-material-defaults';
import { getMasonryMaterialMediaUrl } from '../modules/masonry-material-media';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';

interface MasonryMaterialCardProps {
  material: MasonryMaterial;
  canDelete: boolean; // своя услуга авторизованного пользователя
  loading: boolean;
  onDelete: (id: number) => void;
}

export const MasonryMaterialCard: FC<MasonryMaterialCardProps> = ({
  material,
  canDelete,
  loading,
  onDelete,
}) => (
  <Card className="masonry-material-card h-100">
    <Link to={`${MASONRY_MATERIAL_ROUTES.FEED}?id=${material.id}`} className="masonry-material-card__link">
      <Card.Img
        variant="top"
        className="masonry-material-card__image"
        src={getMasonryMaterialMediaUrl(material.imageUrl, MASONRY_MATERIAL_DEFAULT_IMAGE)}
        alt={material.name}
      />
      <Card.Body className="masonry-material-card__body">
        <Card.Title className="masonry-material-card__name">{material.name}</Card.Title>
        <Card.Text className="masonry-material-card__consumption">
          Расход: {material.consumptionPerM3 ?? '—'} шт./м³
        </Card.Text>
        <Card.Text className="masonry-material-card__likes">❤ {material.likesCount}</Card.Text>
      </Card.Body>
    </Link>

    {canDelete && (
      <Button
        className="masonry-material-btn masonry-material-card__delete"
        disabled={loading}
        onClick={() => onDelete(material.id)}
      >
        Удалить
      </Button>
    )}
  </Card>
);
