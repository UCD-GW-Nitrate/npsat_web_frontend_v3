import type { Meta, StoryObj } from '@storybook/react';

import DifferenceHeatmap from './DifferenceHeatmap';

const meta: Meta<typeof DifferenceHeatmap> = {
  component: DifferenceHeatmap,
};

function generateData(count: number, yrange: any) {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = `${(i + 1).toString()} hello world`;
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x,
      y,
    });
    i += 1;
  }
  return series;
}

const series: ApexAxisChartSeries = [
  {
    name: 'Jan',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'Feb',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'Mar',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'Apr',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'May',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'Jun',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'Jul',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
  {
    name: 'Aug',
    data: generateData(20, {
      min: -30,
      max: 55,
    }),
  },
];

export default meta;
type Story = StoryObj<typeof DifferenceHeatmap>;

export const Primary: Story = {
  render: () => <DifferenceHeatmap data={series} />,
};
