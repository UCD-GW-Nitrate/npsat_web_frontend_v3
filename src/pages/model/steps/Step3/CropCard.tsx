import { Card, Col, InputNumber, Row, Slider } from 'antd';
import { useState } from 'react';

import type { Crop } from '@/store/apis/cropApi';

interface CropCardProps {
  crop: Crop;
  initialValue?: number;
}

const CropCard = ({ crop, initialValue }: CropCardProps) => {
  const [value, setValue] = useState<number>(initialValue ?? 0);

  return (
    <Card title={crop.name}>
      <Row gutter={16}>
        <Col span={3} style={{ margin: '5px 0' }}>
          Loading
        </Col>
        <Col span={8}>
          <Slider
            max={200}
            min={0}
            marks={{
              0: '0%',
              200: '200%',
            }}
            value={value}
            onChange={setValue}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={200}
            value={value}
            onChange={(v: number | null) => setValue(v ?? initialValue ?? 0)}
            style={{ margin: '0 16px' }}
            formatter={(v) => `${v}%`}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CropCard;
