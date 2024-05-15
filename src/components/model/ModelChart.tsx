import { Button, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import LineChart from '@/components/charts/LineChart/LineChart';
import { HBox } from '@/components/custom/HBox/Hbox';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import type { Result } from '@/store/apis/modelApi';

interface ModelChartProps {
  percentiles: Result[];
  reductionStartYear: number;
  reductionCompleteYear: number;
}

const ModelChart = ({
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
}: ModelChartProps) => {
  const [plotData, percentilesData] = useModelResults(percentiles);
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number[]>([
    5, 50, 95,
  ]);
  const [percentileButtonClicked, setPercentileButtonClicked] =
    useState<string>('Select 5th, 50th, 95th');

  function configureDisplayData(
    percentilesInput: number[],
  ): ApexAxisChartSeries {
    const res: ApexAxisChartSeries = [];
    percentilesInput.forEach((p) => {
      const chartData: any = [];
      ((plotData as any)[p] as ModelDisplay[] | null)?.forEach(
        (data: ModelDisplay) => {
          chartData.push({
            x: data.year,
            y: data.value,
          });
        },
      );
      res.push({
        name: `${p}th percentile`,
        data: chartData,
      });
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<ApexAxisChartSeries>(
    configureDisplayData(percentilesDisplayed),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(percentilesDisplayed));
  }, [plotData, percentilesDisplayed]);

  if (!plotData) {
    return <div />;
  }

  return (
    <div>
      <Select
        showSearch
        placeholder="Select Percentiles"
        optionFilterProp="children"
        mode="multiple"
        allowClear
        value={percentilesDisplayed}
        onChange={setPercentilesDisplayed}
        style={{ width: '100%' }}
      >
        {(percentilesData as number[]).map((p) => (
          <Select.Option key={p} value={p}>
            {p}th percentile
          </Select.Option>
        ))}
      </Select>
      <HBox style={{ marginTop: 20, marginBottom: 40 }}>
        <HBox spacing="small">
          <Button
            type={
              percentileButtonClicked === 'Select 5th, 50th, 95th'
                ? 'primary'
                : 'default'
            }
            onClick={() => {
              setPercentilesDisplayed([5, 50, 95]);
              setPercentileButtonClicked('Select 5th, 50th, 95th');
            }}
          >
            Select 5th, 50th, 95th
          </Button>
          <Button
            type={
              percentileButtonClicked === 'Select 10th, 50th, 90th'
                ? 'primary'
                : 'default'
            }
            onClick={() => {
              setPercentilesDisplayed([10, 50, 90]);
              setPercentileButtonClicked('Select 10th, 50th, 90th');
            }}
          >
            Select 10th, 50th, 90th
          </Button>
          <Button
            type={
              percentileButtonClicked === 'Select 25th, 50th, 75th'
                ? 'primary'
                : 'default'
            }
            onClick={() => {
              setPercentilesDisplayed([25, 50, 75]);
              setPercentileButtonClicked('Select 25th, 50th, 75th');
            }}
          >
            Select 25th, 50th, 75th
          </Button>
        </HBox>
        <Button
          type={
            percentileButtonClicked === 'Select All' ? 'primary' : 'default'
          }
          onClick={() => {
            setPercentilesDisplayed(percentilesData as number[]);
            setPercentileButtonClicked('Select All');
          }}
        >
          Select All
        </Button>
      </HBox>
      <LineChart
        data={displayData}
        reductionEndYear={reductionCompleteYear}
        reductionStartYear={reductionStartYear}
      />
    </div>
  );
};

export default ModelChart;
