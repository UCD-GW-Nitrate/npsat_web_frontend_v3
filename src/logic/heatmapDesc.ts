interface HeatmapPoint {
  x: string;
  y: number;
}

interface HeatmapSeries {
  name: string;
  data: HeatmapPoint[];
}

export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

export interface PercentileTrend {
  percentile: string;
  direction: TrendDirection;
  startValue: number;
  endValue: number;
  change: number;
}

export interface HeatmapSummary {
  summary: string;
  percentileTrends: Record<string, PercentileTrend>;
}

export function generateHeatmapSummary(
  series: HeatmapSeries[],
  xAxisLabel: string,
  yAxisLabel: string,
): HeatmapSummary {
  if (!series.length) {
    return {
      summary: 'No data available.',
      percentileTrends: {},
    };
  }

  const allPoints: Array<{
    percentile: string;
    x: string;
    y: number;
  }> = [];

  // Flatten all data points
  for (const row of series) {
    for (const point of row.data) {
      allPoints.push({
        percentile: row.name,
        x: String(point.x),
        y: point.y,
      });
    }
  }

  if (!allPoints.length) {
    return {
      summary: 'No data available.',
      percentileTrends: {},
    };
  }

  // --------------------------------------------------
  // Min / Max
  // --------------------------------------------------

  let minPoint = allPoints[0]!;
  let maxPoint = allPoints[0]!;

  for (const point of allPoints) {
    if (point.y < minPoint.y) {
      minPoint = point;
    }

    if (point.y > maxPoint.y) {
      maxPoint = point;
    }
  }

  // --------------------------------------------------
  // Mean / Std Dev
  // --------------------------------------------------

  const values = allPoints.map((p) => p.y);

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;

  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;

  const stdDev = Math.sqrt(variance);

  // --------------------------------------------------
  // Overall Trend Across X Axis
  // --------------------------------------------------

  const xBuckets: Record<string, number[]> = {};

  for (const point of allPoints) {
    if (!xBuckets[point.x]) {
      xBuckets[point.x] = [];
    }

    xBuckets[point.x]!.push(point.y);
  }

  const bucketMeans = Object.entries(xBuckets).map(([x, vals]) => ({
    x,
    avg: vals.reduce((a, b) => a + b, 0) / vals.length,
  }));

  let overallTrend = 'remains relatively stable';

  if (bucketMeans.length >= 2) {
    const first = bucketMeans[0]!.avg;
    const last = bucketMeans[bucketMeans.length - 1]!.avg;

    const percentChange = ((last - first) / Math.max(Math.abs(first), 1)) * 100;

    if (percentChange > 10) {
      overallTrend = 'generally increases';
    } else if (percentChange < -10) {
      overallTrend = 'generally decreases';
    }
  }

  // --------------------------------------------------
  // Hotspots
  // --------------------------------------------------

  const hotspotThreshold = mean + stdDev;

  const hotspots = allPoints
    .filter((point) => point.y >= hotspotThreshold)
    .sort((a, b) => b.y - a.y)
    .slice(0, 3);

  // --------------------------------------------------
  // Percentile Trends
  // --------------------------------------------------

  const percentileTrends: Record<string, PercentileTrend> = {};

  for (const row of series) {
    if (row.data.length < 2) continue;

    const startValue = row.data[0]!.y;
    const endValue = row.data[row.data.length - 1]!.y;

    const change = endValue - startValue;

    let direction: TrendDirection = 'stable';

    if (change > stdDev * 0.5) {
      direction = 'increasing';
    } else if (change < -stdDev * 0.5) {
      direction = 'decreasing';
    }

    percentileTrends[row.name] = {
      percentile: row.name,
      direction,
      startValue,
      endValue,
      change,
    };
  }

  // --------------------------------------------------
  // Summary Text
  // --------------------------------------------------

  let summary =
    `This heatmap contains ${allPoints.length} data points and shows how ${yAxisLabel.toLowerCase()} varies across ${xAxisLabel}. ` +
    `${yAxisLabel} values range from ${minPoint.y.toFixed(
      1,
    )} at ${minPoint.percentile} (${minPoint.x}) to ${maxPoint.y.toFixed(
      1,
    )} at ${maxPoint.percentile} (${maxPoint.x}). ` +
    `Overall, ${yAxisLabel} ${overallTrend} as ${xAxisLabel} increases.`;

  if (hotspots.length > 0) {
    const hotspotText = hotspots
      .map((spot) => `${spot.percentile} (${spot.x})`)
      .join(', ');

    summary += ` The highest ${yAxisLabel} values occur around ${hotspotText}.`;
  }

  return {
    summary,
    percentileTrends,
  };
}
