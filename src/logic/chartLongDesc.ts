type DataPoint = {
  x: number;
  y: number;
};

function interpretMilestones(
  y1: number,
  y2: number,
  y3: number,
  y4: number,
  threshold: number,
): string {
  // Using 4 avg points, we can find 3 "slopes"
  const diff1 = y2 - y1; // Movement from Start to Middle
  const diff2 = y3 - y2; // Movement from Middle 1 to Middle 2
  const diff3 = y4 - y3; // Movement from Middle 2 to End

  const describeTransition = (
    prev: number,
    next: number,
    isFirst: boolean,
  ): string => {
    const risingPrev = prev > threshold;
    const risingNext = next > threshold;
    const fallingPrev = prev < -threshold;
    const fallingNext = next < -threshold;
    const flatPrev = Math.abs(prev) <= threshold;
    const flatNext = Math.abs(next) <= threshold;

    // ---------------- Rising ----------------
    if (risingPrev && risingNext) {
      if (next > prev * 1.5) {
        return isFirst
          ? 'starts with a gradual rise before accelerating into an exponential upward trend'
          : 'continues by accelerating upward even more steeply';
      }

      if (prev > next * 1.5) {
        return isFirst
          ? 'starts with a sharp rise before beginning to level off'
          : 'continues rising but at a slower, more gradual rate';
      }

      return isFirst
        ? 'starts with a steady, linear upward trend'
        : 'continues rising at a steady rate';
    }

    // ---------------- Falling ----------------
    if (fallingPrev && fallingNext) {
      if (Math.abs(next) > Math.abs(prev) * 1.5) {
        return isFirst
          ? 'starts with a gradual decline before falling more rapidly'
          : 'continues by declining more sharply';
      }

      if (Math.abs(prev) > Math.abs(next) * 1.5) {
        return isFirst
          ? 'starts with a steep decline before beginning to level off'
          : 'continues declining more gradually';
      }

      return isFirst
        ? 'starts with a steady downward trend'
        : 'continues declining at a steady rate';
    }

    // ---------------- Peaks / Valleys ----------------
    if (risingPrev && fallingNext) {
      return isFirst
        ? 'starts by rising to a peak'
        : 'reaches a peak before declining';
    }

    if (fallingPrev && risingNext) {
      return isFirst
        ? 'starts by declining to a valley'
        : 'bottoms out before recovering';
    }

    // ---------------- Plateau ----------------
    if (risingPrev && flatNext) {
      return isFirst
        ? 'starts by rising before leveling off'
        : 'levels off into a plateau';
    }

    if (fallingPrev && flatNext) {
      return isFirst
        ? 'starts by declining before leveling off'
        : 'levels off after declining';
    }

    if (flatPrev && risingNext) {
      return isFirst
        ? 'starts relatively flat before rising'
        : 'begins rising after an initially flat period';
    }

    if (flatPrev && fallingNext) {
      return isFirst
        ? 'starts relatively flat before declining'
        : 'begins declining after an initially flat period';
    }

    if (flatPrev && flatNext) {
      return isFirst
        ? 'remains relatively flat initially'
        : 'remains relatively flat toward the end';
    }

    return isFirst
      ? 'shows an initially changing trend'
      : 'continues with a changing trend';
  };

  const firstDescription = describeTransition(diff1, diff2, true);
  const secondDescription = describeTransition(diff2, diff3, false);

  return `${firstDescription}, then ${secondDescription}.`;
}

export function describeVisualShape(data: DataPoint[]): string {
  if (data.length < 3) return 'contains too few points to establish a trend.';

  // Sort data by X-axis to ensure chronological order
  const sorted = [...data].sort((a, b) => a.x - b.x);

  // Split into 4 equal chronological buckets
  const chunkSize = Math.floor(sorted.length / 4);

  const chunks = [
    sorted.slice(0, chunkSize),
    sorted.slice(chunkSize, chunkSize * 2),
    sorted.slice(chunkSize * 2, chunkSize * 3),
    sorted.slice(chunkSize * 3),
  ];

  // Helper to get average Y of a chunk
  const avgY = (points: DataPoint[]) =>
    points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // average point within each of the 4 periods
  const [y1, y2, y3, y4] = chunks.map(avgY);

  // Determine the overall total range to calculate a significance threshold
  const yValues = data.map((p) => p.y);
  const yRange = Math.max(...yValues) - Math.min(...yValues);

  // A change matters only if it moves by more than 15% of the total visual variance
  const threshold = yRange * 0.15;

  return `The chart ${interpretMilestones(y1, y2, y3, y4, threshold)}`;
}

export function generateAccessibleChartDescription(
  data: DataPoint[],
  name: string,
  xTitle: string,
  yTitle: string,
): string {
  const parts: string[] = [];

  parts.push(`${name} chart showing ${data.length} data points.`);

  parts.push(
    `The horizontal axis represents ${xTitle} and the vertical axis represents ${yTitle}.`,
  );

  if (data.length > 3) {
    parts.push(describeVisualShape(data));

    const y = data.map((d) => d.y);
    const minY = Math.min(...y);
    const maxY = Math.max(...y);

    const start = y[0]!;
    const end = y[y.length - 1]!;

    parts.push(
      `Y values range from ${minY.toFixed(2)} to ${maxY.toFixed(
        2,
      )}. Initial and final y-values are ${start.toFixed(2)} and ${end.toFixed(2)}, respectively.`,
    );
  }

  return parts.join(' ');
}
