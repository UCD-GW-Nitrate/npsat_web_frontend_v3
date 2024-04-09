import { Button, Col, Form, InputNumber, Row } from 'antd';
import { useEffect, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import DifferenceHeatmap from '@/components/charts/DifferenceHeatmap/DifferenceHeatmap';
import type { PercentileResultMap } from '@/hooks/useModelResults';

interface ModelDifferenceHeatmapProps {
  baseResults: PercentileResultMap;
  customResults: PercentileResultMap;
  percentiles: number[];
}

export interface PercentileDifferenceMap {
  [percentile: string]: ModelDifference[];
}

export interface ModelDifference {
  year: number;
  value: number;
  percentile: string;
}

const ModelDifferenceHeatmap = ({
  baseResults,
  customResults,
  percentiles,
}: ModelDifferenceHeatmapProps) => {
  const [plotData, setPlotData] = useState<PercentileDifferenceMap>({});
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const [bucketSize, setBucketSize] = useState<number>(18.5);

  console.log(plotData);
  console.log(selected);
  console.log(setSelected);

  useEffect(() => {
    if (baseResults && customResults) {
      const data: PercentileDifferenceMap = {};
      percentiles.forEach((p) => {
        const difference: ModelDifference[] = [];
        const baseData = baseResults[p] ?? [];
        const customData = customResults[p] ?? [];
        const years = Math.min(baseData.length, customData.length);
        for (let i = 0; i < years; i += 1) {
          difference.push({
            year: baseData[i]!.year,
            percentile: baseData[i]!.percentile,
            value: Number(
              (baseData[i]!.value - customData[i]!.value).toFixed(6),
            ),
          });
        }
        Object.assign(data, { [`${p}`]: difference });
      });
      setPlotData(data);
    }
  }, [baseResults, customResults]);

  const aggregate = (
    data?: PercentileDifferenceMap,
    level?: number,
  ): ApexAxisChartSeries => {
    const result: ApexAxisChartSeries = [];
    if (!level || !data) {
      return result;
    }
    percentiles.forEach((p) => {
      const singleDifference = data[p];
      if (!singleDifference) {
        return;
      }
      const len = singleDifference.length;
      const percentileData: any = [];
      for (let i = 0; i < len; i += level) {
        const temp = singleDifference.slice(i, Math.min(i + level, len));
        let aggValue = 0;
        let aggYearRange = '';
        temp.forEach((diff) => {
          aggValue += diff.value ?? 0;
        });
        if (i + level > len) {
          aggYearRange = `${1945 + i} - ${1945 + len}`;
          aggValue = Number((aggValue / (len - i)).toFixed(2));
        } else {
          aggYearRange = `${1945 + i} - ${1945 + i + level}`;
          aggValue = Number((aggValue / level).toFixed(2));
        }
        percentileData.push({ x: aggYearRange, y: aggValue });
      }
      result.push({ name: `${p}th percentile`, data: percentileData });
    });
    return result;
  };

  const onFormSubmit = (data: FieldValues) => {
    setBucketSize(data.years);
  };

  return (
    <>
      <Form onFinish={onFormSubmit}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              required
              rules={[
                {
                  validator: (_, value) => {
                    if (value <= 200 && value >= 5) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(`Out of range. Select from 5 to 200`),
                    );
                  },
                },
              ]}
              label={<span>Aggregate(avg) years </span>}
              name="years"
              initialValue={bucketSize}
            >
              <InputNumber style={{ width: '100%' }} max={200} min={5} />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item style={{ float: 'right' }}>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <DifferenceHeatmap data={aggregate(plotData, bucketSize)} />
    </>
  );
};

export default ModelDifferenceHeatmap;
