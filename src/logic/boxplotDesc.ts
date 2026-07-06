type BoxPlotSeries = {
  id: string;
  data: {
    x: string;
    y: [number, number, number, number, number]; // [min, Q1, median, Q3, max]
  }[];
};

function average(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function trend(first: number, last: number) {
  const change = (last - first) / Math.max(Math.abs(first), 1);

  if (change > 0.1) return 'increases';
  if (change < -0.1) return 'decreases';
  return 'remains relatively stable';
}

export function generateBoxPlotDescription(
  seriesData: BoxPlotSeries[],
  chartTitle: string,
): string {
  return seriesData
    .map((series) => {
      const { data } = series;
      const n = data.length;

      if (n === 0) return `${chartTitle} boxplot contains no data.`;

      const third = Math.ceil(n / 3);

      const regions = [
        data.slice(0, third),
        data.slice(third, third * 2),
        data.slice(third * 2),
      ].filter((r) => r.length);

      const labels =
        regions.length === 3
          ? ['early', 'middle', 'late']
          : regions.length === 2
            ? ['first', 'second']
            : ['entire'];

      const regionDescriptions = regions.map((region, i) => {
        const medians = region.map((p) => p.y[2]);
        const iqrs = region.map((p) => p.y[3] - p.y[1]);

        return {
          label: labels[i],
          median: average(medians),
          iqr: average(iqrs),
        };
      });

      let description = `${chartTitle} boxplot shows median values that ${trend(
        data[0].y[2],
        data[data.length - 1].y[2],
      )} over the observed period. `;

      description += 'Across the chart, ';

      regionDescriptions.forEach((r, index) => {
        if (index > 0) description += ' ';
        description += `the ${r.label} period has an average median of ${r.median.toFixed(
          1,
        )} and an average interquartile range of ${r.iqr.toFixed(1)}.`;
      });

      const firstIQR = regionDescriptions[0].iqr;
      const lastIQR = regionDescriptions.at(-1)!.iqr;

      if (Math.abs(lastIQR - firstIQR) < firstIQR * 0.1) {
        description +=
          ' Overall variability remains fairly consistent throughout the time period.';
      } else if (lastIQR > firstIQR) {
        description +=
          ' Overall variability increases toward the later years, indicating a wider spread of values.';
      } else {
        description +=
          ' Overall variability decreases toward the later years, indicating the values become more consistent.';
      }

      return description;
    })
    .join(' ');
}
