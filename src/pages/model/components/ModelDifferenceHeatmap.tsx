import { useEffect, useState } from 'react';

import DifferenceHeatmap from '@/components/charts/Heatmap/DifferenceHeatmap';
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

interface AggegateResult {
  value: number;
  yearRange?: string;
  percentile?: number;
}

const ModelDifferenceHeatmap = ({
  baseResults,
  customResults,
  percentiles,
}: ModelDifferenceHeatmapProps) => {
  const [plotData, setPlotData] = useState<PercentileDifferenceMap>({});
  const [selected, setSelected] = useState<number | undefined>(undefined);

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

  const aggregate = (data?: PercentileDifferenceMap, level?: number) => {
    const result: AggegateResult[] = [];
    if (!level || !data) {
      return result;
    }
    percentiles.forEach((p) => {
      const singleDifference = data[p];
      if (!singleDifference) {
        return;
      }
      const len = singleDifference.length;
      for (let i = 0; i < len; i += level) {
        // assume divisible
        const temp = singleDifference.slice(i, Math.min(i + level, len));
        const agg: AggegateResult = temp.reduce(
          (acc, cur) => ({
            ...acc,
            ...cur,
            value: Number((acc.value + cur.value).toFixed(6)),
          }),
          { value: 0 },
        );
        if (i + level > len) {
          agg.yearRange = `${1945 + i} - ${1945 + len}`;
          agg.value = Number((agg.value / (level - i)).toFixed(0));
        } else {
          agg.yearRange = `${1945 + i} - ${1945 + i + level}`;
          agg.value = Number((agg.value / level).toFixed(0));
        }
        result.push(agg);
      }
    });
    return result;
  };

  console.log(aggregate);

  return <DifferenceHeatmap height={500} width={500} />;
};

export default ModelDifferenceHeatmap;
