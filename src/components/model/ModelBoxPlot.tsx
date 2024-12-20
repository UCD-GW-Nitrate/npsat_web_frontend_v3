import React, { useEffect, useState } from 'react';
import { useModelResults } from '@/hooks/useModelResults';

import type { ModelDisplay } from '@/hooks/useModelResults';
import type { MantisResultPercentile } from '@/types/model/MantisResult';
import type { PercentileResultMap } from '@/hooks/useModelResults';

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
    plotData: PercentileResultMap,
  ): ApexAxisChartSeries {
    console.log("plotData", plotData);
    const res: ApexAxisChartSeries = [
      {
        type: 'boxPlot',
        data: [],
      },
    ];

    if ((plotData as any)[5] as ModelDisplay[]) {
      const dataLen = ((plotData as any)[5] as ModelDisplay[])!.length;

      const fifthPercentile = ((plotData as any)[5] as ModelDisplay[])!;
      const lowerQuartile = ((plotData as any)[25] as ModelDisplay[])!;
      const median = ((plotData as any)[50] as ModelDisplay[])!;
      const upperQuartile = ((plotData as any)[75] as ModelDisplay[])!;
      const ninetyFifthPercentile = ((plotData as any)[95] as ModelDisplay[])!;

      console.log("5th", fifthPercentile);
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
    console.log(res);
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
