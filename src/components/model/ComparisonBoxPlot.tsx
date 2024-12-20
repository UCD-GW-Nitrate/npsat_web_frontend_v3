import React, { useEffect, useState } from 'react';

import type { ModelDisplay } from '@/hooks/useModelResults';
import type { ComparisonChartModel } from '@/types/charts/ComparisonChart';

import BoxPlot from '../charts/BoxPlot/BoxPlot';

interface ComparisonBoxPlotProps {
  comparisonChartModels: ComparisonChartModel[];
  reductionStartYear?: number;
  reductionCompleteYear?: number;
}

const ComparisonBoxPlot = ({
  comparisonChartModels,
  reductionStartYear,
  reductionCompleteYear,
}: ComparisonBoxPlotProps) => {
  function configureDisplayData(
    data: ComparisonChartModel[],
  ): ApexAxisChartSeries {
    const res: ApexAxisChartSeries = [];

    data.forEach((model) => {
      const boxPlotData: {
        type: 'boxPlot';
        name: string;
        data: any[];
      } = {
        type: 'boxPlot',
        name: model.name,
        data: [],
      };
      if ((model.plotData as any)[5] as ModelDisplay[]) {
        const dataLen = ((model.plotData as any)[5] as ModelDisplay[])!.length;

        const fifthPercentile = ((model.plotData as any)[5] as ModelDisplay[])!;
        const lowerQuartile = ((model.plotData as any)[25] as ModelDisplay[])!;
        const median = ((model.plotData as any)[50] as ModelDisplay[])!;
        const upperQuartile = ((model.plotData as any)[75] as ModelDisplay[])!;
        const ninetyFifthPercentile = ((
          model.plotData as any
        )[95] as ModelDisplay[])!;

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
          boxPlotData.data.push(dataPoint);
        }
      }
      res.push(boxPlotData);
    });
    return res;
  }

  const [displayData, setDisplayData] = useState<ApexAxisChartSeries>(
    configureDisplayData(comparisonChartModels),
  );

  useEffect(() => {
    setDisplayData(configureDisplayData(comparisonChartModels));
  }, [comparisonChartModels]);

  return (
    <BoxPlot
      data={displayData}
      reductionEndYear={reductionCompleteYear}
      reductionStartYear={reductionStartYear}
    />
  );
};

export default ComparisonBoxPlot;
