import type { FC } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';

interface MasonryMaterialConsumptionFilterProps {
  value: number;
  max: number;
  loading: boolean;
  onChange: (value: number) => void;
  onSearch: () => void;
}

// фильтр по расходу: поиск выполняется только по кнопке «Найти»
export const MasonryMaterialConsumptionFilter: FC<MasonryMaterialConsumptionFilterProps> = ({
  value,
  max,
  loading,
  onChange,
  onSearch,
}) => (
  <Form
    className="masonry-material-tiles__search"
    onSubmit={(event) => {
      event.preventDefault(); // без перезагрузки страницы
      onSearch();
    }}
  >
    <Form.Range
      className="masonry-material-tiles__search-input"
      min={0}
      max={max}
      step={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
    <output className="masonry-material-tiles__search-value">{value}</output>
    <Button type="submit" className="masonry-material-btn" disabled={loading}>
      {loading ? <Spinner animation="border" size="sm" /> : 'Найти'}
    </Button>
  </Form>
);
