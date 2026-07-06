type CategoryBoxPlot = {
  x: string; // Category name
  y: [number, number, number, number, number]; // [min, Q1, median, Q3, max]
};

export function generateCategoricalBoxPlotDescription(
  data: CategoryBoxPlot[],
): string {
  if (!data.length) return 'The chart contains no data.';

  const summaries = data.map((point) => {
    const [min, q1, median, q3, max] = point.y;

    return {
      category: point.x,
      median,
      iqr: q3 - q1,
      range: max - min,
    };
  });

  const sorted = summaries.sort((a, b) => a.median - b.median);
  const highestMedian = sorted[sorted.length - 1]!;
  const lowestMedian = sorted[0]!;

  const widestIQR = summaries.reduce((a, b) => (a.iqr > b.iqr ? a : b));

  const narrowestIQR = summaries.reduce((a, b) => (a.iqr < b.iqr ? a : b));

  const medianSpread = highestMedian.median - lowestMedian.median;

  let comparison: string;

  if (medianSpread < 5) {
    comparison = 'The categories have similar median values overall.';
  } else if (medianSpread < 15) {
    comparison =
      'The categories show moderate differences in their median values.';
  } else {
    comparison = 'The categories differ substantially in their median values.';
  }

  let variability: string;

  if (widestIQR.iqr / Math.max(narrowestIQR.iqr, 0.1) < 1.2) {
    variability =
      'The spread of the middle 50% of values is similar across all categories.';
  } else {
    variability = `${widestIQR.category} has the greatest variability, while ${narrowestIQR.category} has the smallest variability based on the interquartile range.`;
  }

  return [
    `The chart compares the distributions of ${data.length} categories.`,
    comparison,
    `${highestMedian.category} has the highest median value (${highestMedian.median}), while ${lowestMedian.category} has the lowest median value (${lowestMedian.median}).`,
    variability,
  ].join(' ');
}
