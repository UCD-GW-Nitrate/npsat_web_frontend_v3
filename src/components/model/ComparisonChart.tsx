import { Select } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import type { ModelDisplay } from '@/hooks/useModelResults';
import type { ComparisonChartModel } from '@/types/charts/ComparisonChart';
import { ConfidenceIntervalResult } from '@/hooks/useDynamicPercentiles';
import PercentileChart from '../charts/LineChart/PercentileChart';

interface ComparisonChartProps {
  comparisonChartModels: ComparisonChartModel[];
  reductionStartYear?: number;
  reductionCompleteYear?: number;
  percentiles: number[];
  setPercentiles?: Dispatch<SetStateAction<number[] | null>>;
  ciData?: ConfidenceIntervalResult[];
}

const ComparisonChart = ({
  comparisonChartModels,
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
  setPercentiles,
  ciData,
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
    if (setPercentiles) {
      setPercentiles([percentilesDisplayed]);
    }
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
        {percentiles
          .sort(function (a, b) {
            return a - b;
          })
          .map((p) => (
            <Select.Option value={p} key={p}>
              {p}th percentile
            </Select.Option>
          ))}
      </Select>
      <PercentileChart
        data={displayData}
        reductionEndYear={reductionCompleteYear}
        reductionStartYear={reductionStartYear}
        confidenceAreaData={ciData}
      />
    </div>
  );
};

export default ComparisonChart;
