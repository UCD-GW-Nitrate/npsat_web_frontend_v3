import React, { useEffect, useState } from 'react';

import type {
  ModelDisplay,
  PercentileResultMap,
} from '@/hooks/useModelResults';
import { useModelResults } from '@/hooks/useModelResults';
import type { MantisResultPercentile } from '@/types/model/MantisResult';

import BoxPlot from '../charts/BoxPlot/BoxPlot';

interface ModelBoxPlotProps {
  percentiles: MantisResultPercentile[];
  reductionStartYear: number;
  reductionCompleteYear: number;
}

const ModelBoxPlot = ({
  percentiles,
  reductionStartYear,
  reductionCompleteYear,
}: ModelBoxPlotProps) => {
  const [plotData] = useModelResults(percentiles);

  function configureDisplayData(
    data: PercentileResultMap,
  ): ApexAxisChartSeries {
    const res: ApexAxisChartSeries = [
      {
        type: 'boxPlot',
        data: [],
      },
    ];

    if ((data as any)[5] as ModelDisplay[]) {
      const dataLen = ((data as any)[5] as ModelDisplay[])!.length;

      const fifthPercentile = ((data as any)[5] as ModelDisplay[])!;
      const lowerQuartile = ((data as any)[25] as ModelDisplay[])!;
      const median = ((data as any)[50] as ModelDisplay[])!;
      const upperQuartile = ((data as any)[75] as ModelDisplay[])!;
      const ninetyFifthPercentile = ((data as any)[95] as ModelDisplay[])!;

      for (let i = 0; i < dataLen; i += 10) {
        const dataPoint: any = {
          x: fifthPercentile[i]!.year,
          y: [
            fifthPercentile[i]!.value,
            lowerQuartile[i]!.value,
            median[i]!.value,
            upperQuartile[i]!.value,
            ninetyFifthPercentile[i]!.value,
          ],
        };
        res[0]?.data.push(dataPoint);
      }
    }
    return res;
  }

  const [displayData, setDisplayData] = useState<ApexAxisChartSeries>(
    configureDisplayData(plotData),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(plotData));
  }, [plotData]);

  return (
    <BoxPlot
      data={displayData}
      reductionEndYear={reductionCompleteYear}
      reductionStartYear={reductionStartYear}
    />
  );
};

export default ModelBoxPlot;
