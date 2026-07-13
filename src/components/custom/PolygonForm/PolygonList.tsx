import { EditOutlined } from '@ant-design/icons';
import { Button, Card, List } from 'antd';
import { useEffect, useState } from 'react';

import PolygonForm from './PolygonForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPolygons, setPolygons } from '@/store/slices/polygonSlice';

export default function PolygonList() {
  const [editPolygonIdx, setEditPolygonIdx] = useState(-1);
  const [addPolygon, setAddPolygon] = useState(false);

  const polygons = useSelector(selectCurrentPolygons);
  const dispatch = useDispatch();
  const setPolygonCoords = (polygons: [number, number][][]) => dispatch(setPolygons(polygons));

  function handleAddPolygon(polyCoords: [number, number][]) {
    setPolygonCoords([...polygons, polyCoords]);
    setAddPolygon(false);
  }

  function handleEditPolygon(polyCoords: [number, number][]) {
    setPolygonCoords([
      ...polygons.slice(0, editPolygonIdx),
      polyCoords,
      ...polygons.slice(editPolygonIdx + 1),
    ]);
    setEditPolygonIdx(-1);
  }

  return (
    <Card title="Selection Summary" size="small">
      <List
        style={{ marginTop: 0, marginBottom: 20 }}
        itemLayout="horizontal"
        dataSource={polygons}
        locale={{
          emptyText: 'No polygons have been added yet.',
        }}
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
                  description={`${item.length} Vertices: ${item.map((point) => `(${point[0].toFixed(3)}, ${point[1].toFixed(3)})`).join(', ')}`}
                />
              </List.Item>
            ) : (
              <PolygonForm
                initialPoints={item}
                editing
                setPolygonCoords={handleEditPolygon}
                handleCancel={() => setEditPolygonIdx(-1)}
              />
            )}
          </>
        )}
      />
      {addPolygon ? (
        <PolygonForm
          setPolygonCoords={handleAddPolygon}
          handleCancel={() => setAddPolygon(false)}
        />
      ) : (
        <Button type="primary" onClick={() => setAddPolygon(true)}>
          Add Polygon
        </Button>
      )}
    </Card>
  );
}
