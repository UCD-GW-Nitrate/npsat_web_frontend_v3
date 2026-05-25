import { Button, Card, Form, Select, Table } from 'antd';
import { useEffect, useState } from 'react';

import RangeFormItem from '@/components/custom/RangeFormItem/RangeFormItem';
import { StandardText } from '@/components/custom/StandardText/StandardText';

type DataPoint = {
  x: number;
  y: number;
};

interface Props {
  data: { name: string; data: DataPoint[] }[];
  xTitle: string;
  yTitle: string;
}

export default function AccessibleViz({ data, xTitle, yTitle }: Props) {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const columns = [
    {
      title: xTitle,
      dataIndex: 'x',
      key: 'x',
    },
    {
      title: yTitle,
      dataIndex: 'y',
      key: 'y',
    },
  ];
  const [seriesData, setSeriesData] = useState<DataPoint[]>([]);
  const [displayData, setDisplayData] = useState<DataPoint[]>([]);
  const [form] = Form.useForm();
  const [minX, setMinX] = useState<number | null>(null);
  const [maxX, setMaxX] = useState<number | null>(null);
  const [minY, setMinY] = useState<number | null>(null);
  const [maxY, setMaxY] = useState<number | null>(null);
  const [globalMinX, setGlobalMinX] = useState<number | null>(null);
  const [globalMaxX, setGlobalMaxX] = useState<number | null>(null);
  const [globalMinY, setGlobalMinY] = useState<number | null>(null);
  const [globalMaxY, setGlobalMaxY] = useState<number | null>(null);

  useEffect(() => {
    let newDisplayData: DataPoint[] = [];
    if (data.length === 1 || selectedSeries === null) {
      newDisplayData =
        data[0]?.data?.map((p, i) => ({
          key: i,
          x: p.x,
          y: p.y,
        })) ?? [];
    } else if (data.length !== 0) {
      newDisplayData =
        data
          .find((s) => s.name === selectedSeries)
          ?.data?.map((p, i) => ({
            key: i,
            x: p.x,
            y: p.y,
          })) ?? [];
    }
    setSeriesData(newDisplayData);

    setGlobalMaxX(Math.max(...newDisplayData.map((item) => item.x)));
    setGlobalMinX(Math.min(...newDisplayData.map((item) => item.x)));
    setGlobalMaxY(Math.max(...newDisplayData.map((item) => item.y)));
    setGlobalMinY(Math.min(...newDisplayData.map((item) => item.y)));
  }, [data, selectedSeries]);

  useEffect(() => {
    setDisplayData(
      seriesData.filter((point) => {
        if (minX && point.x < minX) {
          return false;
        }
        if (maxX && point.x > maxX) {
          return false;
        }
        if (minY && point.y < minY) {
          return false;
        }
        if (maxY && point.y > maxY) {
          return false;
        }
        return true;
      }),
    );
  }, [seriesData, minX, maxX, minY, maxY]);

  const onFinish = () => {
    const xRangeMin = form.getFieldValue('minX');
    const xRangeMax = form.getFieldValue('maxX');
    const yRangeMin = form.getFieldValue('minY');
    const yRangeMax = form.getFieldValue('maxY');

    if (xRangeMin !== undefined) setMinX(xRangeMin);
    if (xRangeMax !== undefined) setMaxX(xRangeMax);
    if (yRangeMin !== undefined) setMinY(yRangeMin);
    if (yRangeMax !== undefined) setMaxY(yRangeMax);

    return true;
  };

  return (
    <>
      {data.length > 1 && (
        <Select
          placeholder="Select a person"
          options={data.map((s) => ({
            value: s.name,
            label: s.name,
          }))}
          onChange={setSelectedSeries}
        />
      )}

      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ marginBottom: 20 }}
      >
        <Card
          title="Table View Options"
          extra={
            <p>
              Displaying {displayData.length} of {seriesData.length} data points
            </p>
          }
        >
          <StandardText>{xTitle} Range</StandardText>
          <RangeFormItem
            valueLow={form.getFieldValue('minX')}
            valueHigh={form.getFieldValue('maxX')}
            onChangeMin={(input: number) => form.setFieldValue('minX', input)}
            onChangeMax={(input: number) => form.setFieldValue('maxX', input)}
            rangeConfig={{
              min: globalMinX ?? 0,
              max: globalMaxX ?? 0,
              step: 5,
              maxIdentifier: false,
            }}
          />

          <StandardText>{yTitle} Range</StandardText>
          <RangeFormItem
            valueLow={form.getFieldValue('minY')}
            valueHigh={form.getFieldValue('maxY')}
            onChangeMin={(input: number) => form.setFieldValue('minY', input)}
            onChangeMax={(input: number) => form.setFieldValue('maxY', input)}
            rangeConfig={{
              min: globalMinY ?? 0,
              max: globalMaxY ?? 0,
              step: 5,
              maxIdentifier: false,
            }}
          />
        </Card>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Table dataSource={displayData} columns={columns} />
    </>
  );
}
