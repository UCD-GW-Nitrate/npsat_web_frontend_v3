import type { TableProps } from 'antd';
import { Col, Form, InputNumber, Row, Slider, Table } from 'antd';
import React, { useState } from 'react';

const LoadingSlider = ({
  name,
  initialValue,
  onChange,
}: {
  name: string;
  initialValue: number;
  onChange: (cropName: string, v: number) => void;
}) => {
  const [value, setValue] = useState<number>(initialValue ?? 0);

  return (
    <Row align="top" justify="center" style={{ width: 380, gap: 20 }}>
      <Col flex={1}>
        <Slider
          max={200}
          min={0}
          marks={{
            0: '0%',
            200: '200%',
          }}
          value={value}
          onChange={(v) => {
            setValue(v);
            if (onChange) {
              onChange(name, v);
            }
          }}
        />
      </Col>
      <Col flex="50px">
        <InputNumber
          min={0}
          max={200}
          value={value}
          onChange={(v: number | null) => {
            setValue(v ?? initialValue ?? 0);
            if (onChange) {
              onChange(name, v ?? initialValue ?? 0);
            }
          }}
          formatter={(v) => `${v}%`}
        />
      </Col>
    </Row>
  );
};

interface DataType {
  id: number;
  name: string;
  area: number;
  initialLoading: number;
}

interface CropTableProps {
  data: DataType[];
  onChange: (cropName: string, v: number) => void;
}

export default function CropTable({ data, onChange }: CropTableProps) {
  function numberWithCommas(x: number) {
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Crop',
      dataIndex: 'name',
      width: 250,
      onCell: () => ({
        style: {
          paddingBottom: 0,
          paddingTop: 5,
        },
      }),
    },
    {
      title: 'Crop Area',
      dataIndex: 'area',
      width: 250,
      onCell: () => ({
        style: {
          paddingBottom: 0,
          paddingTop: 5,
        },
      }),
      render: (cropArea) =>
        `${numberWithCommas(cropArea * 0.25)} ha / ${numberWithCommas(cropArea * 0.25 * 2.47)} ac`,
    },
    {
      title: 'Loading',
      key: 'loading',
      width: 300,
      onCell: () => ({
        style: {
          paddingBottom: 0,
          paddingTop: 5,
        },
      }),
      render: (_, record) => (
        <Form.Item
          key={record.id}
          name={record.name}
          label=""
          colon={false}
          rules={[
            {
              validator: () => Promise.resolve(),
            },
          ]}
          initialValue={record.initialLoading}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
          }}
        >
          <LoadingSlider
            name={record.name}
            initialValue={record.initialLoading}
            onChange={onChange}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <div style={{ width: 900 }}>
    <Table<DataType>
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
    />
    </div>
  );
}
