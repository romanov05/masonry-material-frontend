import { useEffect, useState, type FC } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  MASONRY_MATERIAL_DEFAULT_IMAGE,
  MASONRY_MATERIAL_DEFAULT_VIDEO,
} from '../modules/masonry-material-defaults';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';
import { useMasonryMaterialDispatch, useMasonryMaterialSelector } from '../store';
import {
  createMasonryMaterialDraft,
  getMasonryMaterialDraft,
  publishMasonryMaterial,
} from '../slices/masonryMaterialSlice';

// превью выбранного файла; до выбора — файл по умолчанию
const useMasonryMaterialPreview = (file: File | null, defaultUrl: string) => {
  const [url, setUrl] = useState(defaultUrl);
  useEffect(() => {
    if (!file) {
      setUrl(defaultUrl);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, defaultUrl]);
  return url;
};

export const MasonryMaterialDraftPage: FC = () => {
  const dispatch = useMasonryMaterialDispatch();
  const navigate = useNavigate();
  const { draft, loading } = useMasonryMaterialSelector((state) => state.masonryMaterial);
  const [draftChecked, setDraftChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // шаг 1
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const imagePreview = useMasonryMaterialPreview(image, MASONRY_MATERIAL_DEFAULT_IMAGE);
  const videoPreview = useMasonryMaterialPreview(video, MASONRY_MATERIAL_DEFAULT_VIDEO);

  // шаг 2
  const [shortDescription, setShortDescription] = useState('');
  const [mortarPerM3, setMortarPerM3] = useState('');
  const [consumptionPerM3, setConsumptionPerM3] = useState('');

  // если черновик уже есть — сразу шаг 2
  useEffect(() => {
    dispatch(getMasonryMaterialDraft()).finally(() => setDraftChecked(true));
  }, [dispatch]);

  const handleCreate = async () => {
    if (!image || !video) {
      return;
    }
    setError(null);
    try {
      await dispatch(createMasonryMaterialDraft({ name, image, video })).unwrap();
    } catch (status) {
      setError(
        status === 409 ? 'Черновик уже есть или название занято' : 'Не удалось создать черновик',
      );
    }
  };

  const handlePublish = async () => {
    if (!draft) {
      return;
    }
    setError(null);
    try {
      await dispatch(
        publishMasonryMaterial({
          id: draft.id,
          shortDescription,
          mortarPerM3: Number(mortarPerM3),
          consumptionPerM3: Number(consumptionPerM3),
        }),
      ).unwrap();
      navigate(MASONRY_MATERIAL_ROUTES.TILES);
    } catch {
      setError('Не удалось опубликовать черновик');
    }
  };

  if (!draftChecked) {
    return (
      <div className="masonry-material-loader">
        <Spinner animation="border" />
      </div>
    );
  }

  const submitContent = (label: string) =>
    loading ? <Spinner animation="border" size="sm" /> : label;

  return (
    <div className="masonry-material-form">
      <h1 className="masonry-material-form__title">Черновик</h1>

      {draft === null ? (
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            handleCreate();
          }}
        >
          <Form.Group className="mb-3" controlId="masonry-material-name">
            <Form.Label>Название</Form.Label>
            <Form.Control
              value={name}
              required
              minLength={3}
              maxLength={150}
              onChange={(event) => setName(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="masonry-material-image">
            <Form.Label>Изображение</Form.Label>
            <img className="masonry-material-form__preview" src={imagePreview} alt="Изображение" />
            <Form.Control
              type="file"
              accept="image/*"
              required
              onChange={(event) =>
                setImage((event.target as HTMLInputElement).files?.[0] ?? null)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="masonry-material-video">
            <Form.Label>Видео</Form.Label>
            <video
              key={videoPreview}
              className="masonry-material-form__preview"
              src={videoPreview}
              autoPlay
              loop
              muted
              playsInline
            />
            <Form.Control
              type="file"
              accept="video/*"
              required
              onChange={(event) =>
                setVideo((event.target as HTMLInputElement).files?.[0] ?? null)
              }
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button type="submit" className="masonry-material-btn w-100" disabled={loading}>
            {submitContent('Далее')}
          </Button>
        </Form>
      ) : (
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            handlePublish();
          }}
        >
          <Form.Group className="mb-3" controlId="masonry-material-draft-name">
            <Form.Label>Название</Form.Label>
            <Form.Control value={draft.name} readOnly />
          </Form.Group>

          <Form.Group className="mb-3" controlId="masonry-material-description">
            <Form.Label>Краткое описание</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={shortDescription}
              required
              minLength={10}
              maxLength={2000}
              onChange={(event) => setShortDescription(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="masonry-material-mortar">
            <Form.Label>Раствор, м³/м³</Form.Label>
            <Form.Control
              type="number"
              min={0.001}
              max={999.999}
              step={0.001}
              value={mortarPerM3}
              required
              onChange={(event) => setMortarPerM3(event.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="masonry-material-consumption">
            <Form.Label>Расход, шт./м³</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={100000}
              step={1}
              value={consumptionPerM3}
              required
              onChange={(event) => setConsumptionPerM3(event.target.value)}
            />
          </Form.Group>

          {error && <Alert variant="danger">{error}</Alert>}

          <Button type="submit" className="masonry-material-btn w-100" disabled={loading}>
            {submitContent('Опубликовать')}
          </Button>
        </Form>
      )}
    </div>
  );
};
