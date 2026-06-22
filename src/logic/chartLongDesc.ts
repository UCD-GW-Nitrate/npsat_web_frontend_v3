type DataPoint = {
  x: number;
  y: number;
};

function interpretMilestones(
  start: number,
  mid: number,
  end: number,
  threshold: number,
): string {
  const diff1 = mid - start; // Movement from Start to Middle
  const diff2 = end - mid; // Movement from Middle to End

  // Case 1: Both segments go up
  if (diff1 > threshold && diff2 > threshold) {
    // If the second jump is much bigger than the first, it's accelerating (Exponential)
    if (diff2 > diff1 * 1.5) {
      return 'starts with a gradual rise and then shoots up sharply in an exponential curve.';
    }
    return 'follows a steady, rising linear trend from left to right.';
  }

  // Case 2: Both segments go down
  if (diff1 < -threshold && diff2 < -threshold) {
    return 'follows a steady, downward declining trend from left to right.';
  }

  // Case 3: Up then Down (Your Gaussian / Parabolic shape!)
  if (diff1 > threshold && diff2 < -threshold) {
    return 'forms an arch-like curve, rising initially, peaking in the middle, and then falling toward the end.';
  }

  // Case 4: Down then Up (U-Shape)
  if (diff1 < -threshold && diff2 > threshold) {
    return 'forms a U-shaped valley curve, dropping initially before bottoming out and rising at the end.';
  }

  // Case 5: Flat, then changes at the end
  if (Math.abs(diff1) <= threshold && diff2 > threshold) {
    return 'remains relatively flat across the first half, before curving upward sharply at the end.';
  }
  if (Math.abs(diff1) <= threshold && diff2 < -threshold) {
    return 'remains flat across the first half, before dropping off toward the end.';
  }

  // Fallback: No significant structural movement
  return 'is relatively flat with minor fluctuations, maintaining a consistent baseline.';
}

export function describeVisualShape(data: DataPoint[]): string {
  if (data.length < 3) return 'contains too few points to establish a trend.';

  // Sort data by X-axis to ensure chronological order
  const sorted = [...data].sort((a, b) => a.x - b.x);

  // Split into 3 equal chronological buckets
  const chunkSize = Math.floor(sorted.length / 3);
  const firstChunk = sorted.slice(0, chunkSize);
  const secondChunk = sorted.slice(chunkSize, chunkSize * 2);
  const thirdChunk = sorted.slice(chunkSize * 2);

  // Helper to get average Y of a chunk
  const avgY = (points: DataPoint[]) =>
    points.reduce((sum, p) => sum + p.y, 0) / points.length;

  const yStart = avgY(firstChunk);
  const yMid = avgY(secondChunk);
  const yEnd = avgY(thirdChunk);

  // Determine the overall total range to calculate a significance threshold
  const yValues = data.map((p) => p.y);
  const yRange = Math.max(...yValues) - Math.min(...yValues);

  // A change matters only if it moves by more than 15% of the total visual variance
  const threshold = yRange * 0.15;

  return `The chart ${interpretMilestones(yStart, yMid, yEnd, threshold)}`;
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
