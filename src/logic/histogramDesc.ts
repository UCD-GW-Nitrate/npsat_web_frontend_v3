interface HistogramPoint {
  x: string;
  y: number;
}

interface HistogramSeries {
  name: string;
  data: HistogramPoint[];
}

function describeTailSkew(bins: { label: string; count: number }[]): string {
  const peakIndex = bins.reduce(
    (best, current, index, arr) =>
      current.count > arr[best ?? 0]!.count ? index : best,
    0,
  );

  let leftWeight = 0;
  let rightWeight = 0;

  for (let i = 0; i < peakIndex; i += 1) {
    leftWeight += bins[i]!.count;
  }

  for (let i = peakIndex + 1; i < bins.length; i += 1) {
    rightWeight += bins[i]!.count;
  }

  const ratio =
    Math.max(leftWeight, rightWeight) /
    Math.max(Math.min(leftWeight, rightWeight), 1);

  if (ratio < 1.25) {
    return ' The distribution is approximately symmetric.';
  }

  if (rightWeight > leftWeight) {
    return ' The distribution is right-skewed, with more observations falling toward lower values.';
  }

  return ' The distribution is left-skewed, with more observations falling toward higher values.';
}

export function generateHistogramDescription(
  data: HistogramSeries[],
  xTitle: string,
  yTitle: string,
): string {
  const series = data[0];
  const chartTitle = series?.name;

  if (!series || !Array.isArray(series.data) || series.data.length === 0) {
    return `${chartTitle}. Histogram contains no data.`;
  }

  const bins = series.data.map((point: any) => ({
    label: String(point.x),
    count: Number(point.y),
  }));

  const totalObservations = bins.reduce((sum, bin) => sum + bin.count, 0);

  const peakCount = Math.max(...bins.map((b) => b.count));

  const peakBins = bins.filter((b) => b.count === peakCount);

  const peaks = [];

  for (let i = 1; i < bins.length - 1; i += 1) {
    if (
      bins[i]!.count > bins[i - 1]!.count &&
      bins[i]!.count > bins[i + 1]!.count &&
      bins[i]!.count > 1
    ) {
      peaks.push(bins[i]);
    }
  }

  let shapeDescription = 'The distribution has no clearly defined peak.';

  if (peaks.length === 1) {
    shapeDescription = `The distribution is unimodal with a peak in the ${peaks[0]!.label} bin.`;
  } else if (peaks.length === 2) {
    shapeDescription = `The distribution is bimodal with peaks in the ${peaks[0]!.label} and ${peaks[1]!.label} bins.`;
  } else if (peaks.length > 2) {
    shapeDescription = `The distribution contains ${peaks.length} local peaks.`;
  }

  const skewDescription = describeTailSkew(bins);

  const cumulativeTarget = totalObservations * 0.8;

  let cumulative = 0;
  let lower80 = bins[0]!.label;
  let upper80 = bins[bins.length - 1]!.label;
  let started = false;

  for (const bin of bins) {
    cumulative += bin.count;

    if (!started && cumulative >= totalObservations * 0.1) {
      lower80 = bin.label;
      started = true;
    }

    if (cumulative >= cumulativeTarget) {
      upper80 = bin.label;
      break;
    }
  }

  const concentrationDescription = ` Approximately 80% of observations fall between the ${lower80} and ${upper80} bins.`;

  return (
    `${chartTitle}. ` +
    `This histogram shows ${yTitle} across ${xTitle}. ` +
    `The observations are distributed across ${bins.length} bins and add up to ${totalObservations.toFixed(0)}. ` +
    `The highest frequency is ${peakCount.toFixed(2)} in ${
      peakBins.length === 1
        ? `the ${peakBins[0]!.label} bin`
        : `the bins ${peakBins.map((b) => b.label).join(', ')}`
    }. ${shapeDescription}${skewDescription}${concentrationDescription}`
  );
}
