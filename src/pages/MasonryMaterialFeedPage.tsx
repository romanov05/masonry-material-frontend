import { useEffect, useState, type FC } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MASONRY_MATERIAL_DEFAULT_VIDEO } from '../modules/masonry-material-defaults';
import { getMasonryMaterialMediaUrl } from '../modules/masonry-material-media';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';
import { useMasonryMaterialDispatch, useMasonryMaterialSelector } from '../store';
import { getMasonryMaterialFeedItem, setMasonryMaterialLike } from '../slices/masonryMaterialSlice';

const MASONRY_MATERIAL_HEART_PATH =
  'M12 21s-6.716-4.35-9.428-8.485C.774 9.79 1.5 6 4.5 4.5 7 3.25 9.5 4 12 7c2.5-3 5-3.75 7.5-2.5 3 1.5 3.726 5.29 1.928 8.015C18.716 16.65 12 21 12 21z';

export const MasonryMaterialFeedPage: FC = () => {
  const [searchParams] = useSearchParams(); // ?id=2&next=true
  const id = searchParams.get('id');
  const next = searchParams.get('next') === 'true';
  const navigate = useNavigate();
  const dispatch = useMasonryMaterialDispatch();
  const { feedItem: material, loading } = useMasonryMaterialSelector((state) => state.masonryMaterial);
  const isAuthenticated = useMasonryMaterialSelector(
    (state) => state.masonryMaterialUser.isAuthenticated,
  );
  const [expanded, setExpanded] = useState(false);

  // загрузка услуги при открытии страницы и смене параметров в адресе
  useEffect(() => {
    setExpanded(false);
    dispatch(getMasonryMaterialFeedItem({ id: id === null ? undefined : Number(id), next }));
  }, [dispatch, id, next]);

  // «Следующий» — следующая услуга по кругу
  const handleNext = () => {
    if (material) {
      navigate(`${MASONRY_MATERIAL_ROUTES.FEED}?id=${material.id}&next=true`);
    }
  };

  if (!material) {
    return (
      <div className="masonry-material-feed masonry-material-feed--empty">
        {loading ? <Spinner animation="border" variant="light" /> : <p>Услуга не найдена</p>}
      </div>
    );
  }

  const videoSrc = getMasonryMaterialMediaUrl(material.videoUrl, MASONRY_MATERIAL_DEFAULT_VIDEO);

  // лайк ставит и снимает только авторизованный пользователь
  const handleLike = () => {
    dispatch(setMasonryMaterialLike({ id: material.id, value: material.isLiked === 1 ? 0 : 1 }));
  };

  return (
    <div className="masonry-material-feed">
      <video
        key={videoSrc}
        className="masonry-material-feed__video"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="masonry-material-feed__overlay">
        <div className="masonry-material-feed__side">
          <div className="masonry-material-feed__fields">
            <div>
              Раствор:
              <br />
              {material.mortarPerM3 ?? '—'} м³/м³
            </div>
            <div>
              Расход:
              <br />
              {material.consumptionPerM3 ?? '—'} шт./м³
            </div>
          </div>

          <div className="masonry-material-feed__actions">
            {isAuthenticated ? (
              <Button
                variant="link"
                className={`masonry-material-icon-btn${
                  material.isLiked === 1 ? ' masonry-material-icon-btn--liked' : ''
                }`}
                aria-label="Лайк"
                disabled={loading}
                onClick={handleLike}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d={MASONRY_MATERIAL_HEART_PATH} />
                </svg>
                <span className="masonry-material-like-count">{material.likesCount}</span>
              </Button>
            ) : (
              <div className="masonry-material-icon-btn" aria-label="Лайки">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d={MASONRY_MATERIAL_HEART_PATH} />
                </svg>
                <span className="masonry-material-like-count">{material.likesCount}</span>
              </div>
            )}

            <Button
              variant="link"
              className="masonry-material-icon-btn masonry-material-icon-btn--next"
              aria-label="Следующий"
              disabled={loading}
              onClick={handleNext}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="masonry-material-feed__text">
          <h2 className="masonry-material-feed__title">{material.name}</h2>
          <p
            className={`masonry-material-feed__description${
              expanded ? ' masonry-material-feed__description--expanded' : ''
            }`}
          >
            {material.shortDescription}
          </p>
          <button
            type="button"
            className="masonry-material-desc-toggle"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'меньше' : 'больше'}
          </button>
        </div>
      </div>
    </div>
  );
};
