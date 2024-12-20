import type { PercentileResultMap } from '@/hooks/useModelResults';

export interface ComparisonChartModel {
  plotData: PercentileResultMap;
  name: string;
}
