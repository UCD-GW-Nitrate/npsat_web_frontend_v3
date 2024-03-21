import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import LineChart from '@/components/charts/LineChart/LineChart';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';
import type {
  ModelDisplay,
  PercentileResultMap,
} from '@/hooks/useModelResults';

export interface ComparisonChartModel {
  plotData: PercentileResultMap;
  name: string;
}

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
      console.log('compare chart model is', model);
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
    <Box>
      <CoreSelect
        options={percentiles.map((p) => {
          const res: CoreMultipleSelectOption = {
            label: `${p}th percentile`,
            value: p,
          };
          return res;
        })}
        sx={{ minWidth: 200, mb: 3 }}
        defaultValue={50}
        onSelect={(value: number) => setPercentilesDisplayed(value)}
      />
      <LineChart
        data={displayData}
        reductionEndYear={reductionCompleteYear}
        reductionStartYear={reductionStartYear}
      />
    </Box>
  );
};

export default ComparisonChart;
