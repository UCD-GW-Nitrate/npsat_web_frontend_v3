import { QuestionCircleOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { Button, Form, InputNumber, Table, Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import type { Well } from '@/types/well/WellExplorer';

import { StandardText } from '../custom/StandardText/StandardText';

export interface MapProps {
  wells: Well[];
  wellProperty: 'depth' | 'wt2t' | 'unsat' | 'slmod' | 'pumping';
  // params passed by a WellsAndUrfData parent component, if applicable:
  onSelectWell?: (eid: number) => void;
  // params passed by ModelWellsModal parent component:
  allowDraw?: boolean;
  setPolygonCoords?: React.Dispatch<React.SetStateAction<[number, number][]>>;
  setNumWellsContained?: React.Dispatch<React.SetStateAction<number | null>>;
}

const columns: TableColumnsType<Well> = [
  {
    title: 'Well Id',
    dataIndex: 'eid',
  },
  {
    title: 'Coordinates',
    dataIndex: 'lat',
    render: (_, record) => (
      <p>
        Lat {record.lat.toFixed(5)}, Long {record.lon.toFixed(5)}
      </p>
    ),
  },
  {
    title: 'Depth (meters)',
    dataIndex: 'depth',
    render: (text) => +parseFloat(text).toFixed(2).toString(),
    sorter: (a, b) => a.depth - b.depth,
  },
  {
    title: 'Water Table to Top (meters)',
    dataIndex: 'wt2t',
    render: (text) => +parseFloat(text).toFixed(2).toString(),
    sorter: (a, b) => a.wt2t - b.wt2t,
  },
  {
    title: 'Unsaturated Depth (meters)',
    dataIndex: 'unsat',
    render: (text) => +parseFloat(text).toFixed(2).toString(),
    sorter: (a, b) => a.unsat - b.unsat,
  },
  {
    title: 'Screen Length (meters)',
    dataIndex: 'slmod',
    render: (text) => +parseFloat(text).toFixed(2).toString(),
    sorter: (a, b) => a.slmod - b.slmod,
  },
  {
    title: 'Pumping (meters)',
    dataIndex: 'pumping',
    render: (text) => +parseFloat(text).toFixed(2).toString(),
    sorter: (a, b) => a.pumping - b.pumping,
  },
];

export default function AccessibleWellsMap({
  wells,
  wellProperty,
  onSelectWell,
  allowDraw,
  setPolygonCoords,
  setNumWellsContained,
}: MapProps) {
  const [selected, setSelected] = useState<null | number>(null);
  const [polygonCoords, setPolygons] = useState<[number, number][]>([]);
  const [data, setData] = useState<Well[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setData(wells);
    form.resetFields();
  }, [wells]);

  const minValue = useMemo(() => {
    if (wells.length === 0) {
      return 0;
    }
    const allVals = wells.map((well) => well[wellProperty]);
    return Math.min(...allVals);
  }, [wells, wellProperty]);

  const maxValue = useMemo(() => {
    if (wells.length === 0) {
      return 0;
    }
    const allVals = wells.map((well) => well[wellProperty]);
    return Math.max(...allVals);
  }, [wells, wellProperty]);

  function handleClick(well: Well) {
    setSelected(well.eid);
    if (onSelectWell) {
      onSelectWell(well.eid);
    }
  }

  // Haversine distance (km)
  function getDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null)
      return null;

    const R = 6371; // Earth radius in km

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function filterAndSortByProximity(options: {
    refLat: number;
    refLon: number;
    radiusKm: number;
  }) {
    const { refLat = null, refLon = null, radiusKm = null } = options;

    const hasRef = refLat != null && refLon != null;

    let result = wells.map((item) => {
      const distance = hasRef
        ? getDistanceKm(refLat, refLon, item.lat, item.lon)
        : null;

      return { ...item, distanceKm: distance };
    });

    if (hasRef && radiusKm != null) {
      result = result.filter(
        (item) => item.distanceKm != null && item.distanceKm <= radiusKm,
      );
    }

    if (hasRef) {
      result.sort((a, b) => {
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    setData(result);
    console.log(result);
  }

  const onFinish = (values: any) => {
    filterAndSortByProximity({
      refLat: values.lat,
      refLon: values.lon,
      radiusKm: values.radius,
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <StandardText>Set reference point:</StandardText>
        <Tooltip title="This will filter wells that are nearby to the selected latitude, longitude">
          <QuestionCircleOutlined />
        </Tooltip>
      </div>

      <Form
        form={form}
        layout="inline"
        name="control-hooks"
        onFinish={onFinish}
        style={{ marginBottom: 20 }}
      >
        <Form.Item name="lat" label="Latitude">
          <InputNumber min={-90} max={90} />
        </Form.Item>
        <Form.Item name="lon" label="Longitude">
          <InputNumber min={-180} max={180} />
        </Form.Item>
        <Form.Item name="radius" label="Bounding radius (km)">
          <InputNumber min={0} max={100} defaultValue={20} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Table<Well>
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.eid}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selected ? [selected] : [],
          onChange: (_, rows) => {
            if (rows[0]) {
              handleClick(rows[0]);
            }
          },
        }}
      />
    </div>
  );
}
