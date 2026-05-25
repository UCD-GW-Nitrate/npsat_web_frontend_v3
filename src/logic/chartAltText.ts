export type DataPoint = {
  x: number;
  y: number;
};

type Result = {
  description: string;
  trend: string;
};

type Feature = 'peak' | 'valley';

type Plateau = {
  startX: number;
  endX: number;
  position: 'early' | 'middle' | 'late';
};

function sortData(data: DataPoint[]) {
  return [...data].sort((a, b) => a.x - b.x);
}

function computeSlopes(data: DataPoint[]) {
  const slopes: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const dx = data[i].x - data[i - 1].x;
    if (dx === 0) continue;

    slopes.push((data[i].y - data[i - 1].y) / dx);
  }

  return slopes;
}

function detectTrend(slopes: number[]) {
  const pos = slopes.filter((s) => s > 0).length;
  const neg = slopes.filter((s) => s < 0).length;

  const total = slopes.length || 1;

  if (pos / total > 0.8) return 'increasing trend';
  if (neg / total > 0.8) return 'decreasing trend';

  return pos > neg ? 'slightly increasing trend' : 'slightly decreasing trend';
}

function detectFeatures(data: DataPoint[], slopes: number[]): Feature[] {
  const features: Feature[] = [];

  for (let i = 1; i < slopes.length; i++) {
    const prev = slopes[i - 1];
    const curr = slopes[i];

    const point = data[i];

    if (prev > 0 && curr < 0) {
      features.push('peak');
    }

    if (prev < 0 && curr > 0) {
      features.push('valley');
    }
  }

  // collapse duplicates (keep structure only)
  const cleaned: Feature[] = [];

  for (const f of features) {
    if (cleaned[cleaned.length - 1] !== f) {
      cleaned.push(f);
    }
  }

  return cleaned.slice(0, 2); // max 2 features
}

function detectPlateau(data: DataPoint[], slopes: number[]): Plateau[] {
  const avgMag = slopes.reduce((a, b) => a + Math.abs(b), 0) / slopes.length;

  const threshold = avgMag * 0.1;

  const plateaus: Plateau[] = [];

  let startIndex: number | null = null;

  for (let i = 0; i < slopes.length; i++) {
    const isFlat = Math.abs(slopes[i]) < threshold;

    if (isFlat && startIndex === null) {
      startIndex = i;
    }

    const ends = (!isFlat || i === slopes.length - 1) && startIndex !== null;

    if (ends) {
      const endIndex = isFlat ? i : i - 1;

      const startX = data[startIndex].x;
      const endX = data[endIndex + 1].x;

      const width = endX - startX;

      const totalRange = data[data.length - 1].x - data[0].x;

      if (width > totalRange * 0.15) {
        const midX = (startX + endX) / 2;

        let position: Plateau['position'] = 'middle';

        if (midX < data[0].x + totalRange * 0.33) {
          position = 'early';
        } else if (midX > data[0].x + totalRange * 0.66) {
          position = 'late';
        }

        plateaus.push({
          startX,
          endX,
          position,
        });
      }

      startIndex = null;
    }
  }

  return plateaus.slice(0, 1); // only keep most important
}

function describeShape(
  features: Feature[],
  plateaus: Plateau[],
  trend: string,
): string {
  const hasPeak = features.includes('peak');
  const hasValley = features.includes('valley');

  const plateau = plateaus[0];

  if (hasPeak && hasValley) {
    return 'S-shaped curve';
  }

  if (hasPeak) {
    return 'curve rises to a single broad peak before declining';
  }

  if (hasValley) {
    return 'curve falls into a single broad valley before rising';
  }

  if (plateau) {
    const label =
      plateau.position === 'early'
        ? 'early'
        : plateau.position === 'late'
          ? 'late'
          : 'middle';

    return `${trend.includes('increasing') ? 'increasing' : 'decreasing'} curve with a ${label}-range plateau`;
  }

  if (trend.includes('increasing')) {
    return 'steadily increasing curve';
  }

  if (trend.includes('decreasing')) {
    return 'steadily decreasing curve';
  }

  return 'smooth nonlinear curve';
}

export function generateAccessibleChartDescription(
  data: DataPoint[],
  name: string,
  xTitle: string,
  yTitle: string,
): Result {
  if (data.length < 3) {
    return {
      description: `${name} has insufficient data for analysis.`,
      trend: 'unknown',
    };
  }

  const sorted = sortData(data);
  const slopes = computeSlopes(sorted);

  const trend = detectTrend(slopes);
  const features = detectFeatures(sorted, slopes);
  const plateaus = detectPlateau(sorted, slopes);

  const shape = describeShape(features, plateaus, trend);

  const y = sorted.map((d) => d.y);

  const minY = Math.min(...y);
  const maxY = Math.max(...y);

  const start = y[0];
  const end = y[y.length - 1];

  const parts: string[] = [];

  parts.push(`${name} chart showing ${data.length} data points.`);

  parts.push(
    `The horizontal axis represents ${xTitle} and the vertical axis represents ${yTitle}.`,
  );

  parts.push(`The chart shows a ${shape}.`);

  parts.push(
    `Y values range from ${minY.toFixed(2)} to ${maxY.toFixed(
      2,
    )}. Initial and final y-values are ${start.toFixed(2)} and ${end.toFixed(2)}, respectively.`,
  );

  if (plateaus.length > 0) {
    const p = plateaus[0];

    parts.push(
      `A noticeable plateau occurs in the ${p.position} portion of the chart (approximately x = ${p.startX.toFixed(
        1,
      )} to ${p.endX.toFixed(1)}).`,
    );
  }

  return {
    description: parts.join(' '),
    trend,
  };
}
