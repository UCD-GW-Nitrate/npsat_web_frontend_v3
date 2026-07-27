import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, List } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { PolygonsDict } from '@/store/slices/polygonSlice';
import {
  deletePolygon,
  selectCurrentPolygonsDict,
  setPolygons,
} from '@/store/slices/polygonSlice';

import PolygonForm from './PolygonForm';

export default function PolygonList() {
  const [editPolygonId, setEditPolygonId] = useState<string | null>(null);
  const [addPolygon, setAddPolygon] = useState(false);

  const polygonsDict = useSelector(selectCurrentPolygonsDict);
  const dispatch = useDispatch();
  const setPolygonCoords = (newPolygonsDict: PolygonsDict) =>
    dispatch(setPolygons(newPolygonsDict));

  function handleAddPolygon(polyCoords: [number, number][]) {
    const shortId = Date.now().toString();
    setPolygonCoords({ ...polygonsDict, [shortId]: polyCoords });
    setAddPolygon(false);
  }

  function handleEditPolygon(polyCoords: [number, number][], id: string) {
    setPolygonCoords({
      ...polygonsDict,
      [id]: polyCoords,
    });
    setEditPolygonId(null);
  }

  function handleDeletePolygon(id: string) {
    dispatch(deletePolygon(id as unknown as number));
  }

  return (
    <Card title="Selection Summary" size="small">
      <List
        style={{ marginTop: 0, marginBottom: 20 }}
        itemLayout="horizontal"
        dataSource={Object.entries(polygonsDict)}
        locale={{
          emptyText: 'No polygons have been added yet.',
        }}
        renderItem={([id, item], index) => (
          <>
            {editPolygonId !== id ? (
              <List.Item
                actions={[
                  <Button
                    color="default"
                    variant="filled"
                    key={`edit-${index}`}
                    onClick={() => setEditPolygonId(id)}
                  >
                    Edit <EditOutlined />
                  </Button>,
                  <Button
                    color="danger"
                    variant="filled"
                    key={`delete-${index}`}
                    onClick={() => handleDeletePolygon(id)}
                  >
                    Delete <DeleteOutlined />
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
                setPolygonCoords={(polygonCoords) =>
                  handleEditPolygon(polygonCoords, id)
                }
                handleCancel={() => setEditPolygonId(null)}
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
