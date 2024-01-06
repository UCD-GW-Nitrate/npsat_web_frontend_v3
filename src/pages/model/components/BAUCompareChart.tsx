import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import MultilineChart from '@/components/charts/MultilinePlot/MultilineChart';
import type { ChartDataPoint } from '@/components/charts/MultilinePlot/MultilineChartBase';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';
import type { ModelDisplay } from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import type { Result } from '@/store/apis/modelApi';

interface BAUCompareChartProps {
  customPercentiles: Result[];
  basePercentiles: Result[];
  reductionStartYear: number;
  reductionCompleteYear: number;
}

interface DisplayData {
  [percentile: string]: ChartDataPoint[];
}

const BAUCompareChart = ({
  customPercentiles,
  basePercentiles,
  reductionStartYear,
  reductionCompleteYear,
}: BAUCompareChartProps) => {
  const [customPlotData, customPercentilesData] =
    useModelResults(customPercentiles);
  const [basePlotData] = useModelResults(basePercentiles);
  const [percentilesDisplayed, setPercentilesDisplayed] = useState<number>(50);

  function configureDisplayData(percentile: number) {
    const res: any = {};
    res.custom = [];
    res.base = [];
    (
      (customPlotData as any)[percentile] as ModelDisplay[] | undefined
    )?.forEach((data: ModelDisplay) => {
      res.custom.push({
        year: data.year,
        value: data.value,
      } as ChartDataPoint);
    });
    ((basePlotData as any)[percentile] as ModelDisplay[] | undefined)?.forEach(
      (data: ModelDisplay) => {
        res.base.push({
          year: data.year,
          value: data.value,
        } as ChartDataPoint);
      },
    );
    return res;
  }

  const [displayData, setDisplayData] = useState<DisplayData>(
    configureDisplayData(percentilesDisplayed),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(percentilesDisplayed));
  }, [customPlotData, basePlotData, percentilesDisplayed]);

  if (!displayData) {
    return <div />;
  }

  return (
    <Box>
      <CoreSelect
        options={(customPercentilesData as number[]).map((p) => {
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
        annotations={[
          {
            date: reductionStartYear,
            title: 'Implementation start year',
          },
          {
            date: reductionCompleteYear,
            title: 'Implementation complete year',
          },
        ]}
        data={displayData}
      />
    </Box>
  );
};

export default BAUCompareChart;
