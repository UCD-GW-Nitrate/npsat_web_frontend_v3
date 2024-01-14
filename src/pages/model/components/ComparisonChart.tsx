import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import MultilineChart from '@/components/charts/MultilinePlot/MultilineChart';
import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
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
  comparisonCharModels: ComparisonChartModel[];
  reductionStartYear?: number;
  reductionCompleteYear?: number;
  percentiles: number[];
}

interface DisplayData {
  [percentile: string]: ChartDataPoint[];
}

const ComparisonChart = ({
  comparisonCharModels,
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
}: ComparisonChartProps) => {
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number>(50);

  function configureDisplayData(percentile: number) {
    const res: any = {};
    comparisonCharModels.forEach((model) => {
      res[model.name] = [];
      model.plotData[percentile]?.forEach((data: ModelDisplay) => {
        res[model.name].push({
          year: data.year,
          value: data.value,
        } as ChartDataPoint);
      });
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<DisplayData>(
    configureDisplayData(percentilesDisplayed),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(percentilesDisplayed));
  }, [comparisonCharModels, percentilesDisplayed]);

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
        sx={{ minWidth: 200 }}
        defaultValue={50}
        onSelect={(value: number) => setPercentilesDisplayed(value)}
      />
      <MultilineChart
        height={500}
        chartType="line"
        yLabel="Concentration of Nitrate as N [mg/L]"
        annotations={
          reductionStartYear && reductionCompleteYear
            ? [
                {
                  date: reductionStartYear,
                  title: 'Implementation start year',
                },
                {
                  date: reductionCompleteYear,
                  title: 'Implementation complete year',
                },
              ]
            : []
        }
        data={displayData}
      />
    </Box>
  );
};

export default ComparisonChart;
