import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

import LineChart from '@/components/charts/LineChart/LineChart';
import type { ModelDisplay } from '@/hooks/useModelResults';
import type { ComparisonChartModel } from '@/types/charts/ComparisonChart';

interface ComparisonChartProps {
  comparisonChartModels: ComparisonChartModel[];
  reductionStartYear?: number;
  reductionCompleteYear?: number;
  percentiles: number[];
}

const ComparisonChart = ({
  comparisonChartModels,
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
}: ComparisonChartProps) => {
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number>(50);

  function configureDisplayData(percentile: number): ApexAxisChartSeries {
    const res: ApexAxisChartSeries = [];
    comparisonChartModels.forEach((model) => {
      const chartData: any = [];
      model.plotData[percentile]?.forEach((data: ModelDisplay) => {
        chartData.push({
          x: data.year,
          y: data.value,
        });
      });
      res.push({
        name: model.name,
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
  }, [comparisonChartModels, percentilesDisplayed]);

  if (!displayData) {
    return <div />;
  }

  return (
    <div>
      <Select
        value={percentilesDisplayed}
        onSelect={setPercentilesDisplayed}
        style={{ width: '100%', marginBottom: 4 }}
      >
        {percentiles.map((p) => (
          <Select.Option value={p} key={p}>
            {p}th percentile
          </Select.Option>
        ))}
      </Select>
      <LineChart
        data={displayData}
        reductionEndYear={reductionCompleteYear}
        reductionStartYear={reductionStartYear}
      />
    </div>
  );
};

export default ComparisonChart;
