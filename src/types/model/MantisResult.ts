export interface MantisResultPercentile {
  id: number;
  percentile: number;
}

export interface MantisResult extends MantisResultPercentile {
  values: number[];
}
