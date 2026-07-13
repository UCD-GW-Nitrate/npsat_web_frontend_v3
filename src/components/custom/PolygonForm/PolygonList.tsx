import { EditOutlined } from '@ant-design/icons';
import { Button, Card, List } from 'antd';
import { useState } from 'react';

import PolygonForm from './PolygonForm';

export default function PolygonList() {
  const [editPolygonIdx, setEditPolygonIdx] = useState(-1);
  const addPolygon = true;
  const [polygons, setPolygons] = useState<[number, number][][]>([]);

  function handleAddPolygon(polyCoords: [number, number][]) {
    setPolygons([...polygons, polyCoords]);
  }

  function handleEditPolygon(polyCoords: [number, number][]) {
    setPolygons([
      ...polygons.slice(0, editPolygonIdx),
      polyCoords,
      ...polygons.slice(editPolygonIdx + 1),
    ]);
    setEditPolygonIdx(-1);
  }

  return (
    <Card title="Selection Summary">
      <List
        itemLayout="horizontal"
        dataSource={polygons}
        renderItem={(item, index) => (
          <>
            {editPolygonIdx !== index ? (
              <List.Item
                actions={[
                  <Button
                    color="default"
                    variant="filled"
                    key={index}
                    onClick={() => setEditPolygonIdx(index)}
                  >
                    Edit <EditOutlined />
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  // avatar={<Avatar src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${index}`} />}
                  title={<p>Polygon #{index + 1}</p>}
                  description={`${item.length} Vertices: ${item.map((point) => `(${point[0]}, ${point[1]})`).join(', ')}`}
                />
              </List.Item>
            ) : (
              <PolygonForm
                initialPoints={item}
                editing
                setPolygonCoords={handleEditPolygon}
              />
            )}
          </>
        )}
      />
      {addPolygon && <PolygonForm setPolygonCoords={handleAddPolygon} />}
    </Card>
  );
}
