import { useState, type FC } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginMasonryMaterialUser } from '../modules/masonry-material-user-api';
import { setMasonryMaterialUser } from '../slices/masonryMaterialUserSlice';
import { useMasonryMaterialDispatch } from '../store';
import { MASONRY_MATERIAL_ROUTES } from '../masonry-material-routes';

export const MasonryMaterialLoginPage: FC = () => {
  const dispatch = useMasonryMaterialDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await loginMasonryMaterialUser(login, password);
      dispatch(setMasonryMaterialUser(response.data.fullName));
      navigate(MASONRY_MATERIAL_ROUTES.TILES);
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="masonry-material-form">
      <h1 className="masonry-material-form__title">Вход</h1>

      <Form
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin();
        }}
      >
        <Form.Group className="mb-3" controlId="masonry-material-login">
          <Form.Label>Логин</Form.Label>
          <Form.Control value={login} required onChange={(event) => setLogin(event.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="masonry-material-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>

        {error && <Alert variant="danger">Неверный логин или пароль</Alert>}

        <Button type="submit" className="masonry-material-btn w-100" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Войти'}
        </Button>
      </Form>
    </div>
  );
};
