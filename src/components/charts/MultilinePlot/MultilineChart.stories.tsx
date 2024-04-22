import type { Meta, StoryObj } from '@storybook/react';

import MultilineChart from './MultilineChart';
import type { MultilineChartBaseProps } from './MultilineChartBase';

const meta: Meta<typeof MultilineChart> = {
  component: MultilineChart,
};

export default meta;
type Story = StoryObj<typeof MultilineChart>;

export const Primary: Story = {
  render: ({ ...args }: MultilineChartBaseProps) => (
    <MultilineChart {...args} />
  ),
  args: {
    height: 400,
    chartType: 'line',
    yLabel: 'Concentration of Nitrate as N [mg/L]',
    data: {
      custom: [
        {
          year: 2000,
          value: 10,
        },
        {
          year: 2001,
          value: 13,
        },
        {
          year: 2002,
          value: 14,
        },
        {
          year: 2003,
          value: 10,
        },
        {
          year: 2004,
          value: 16,
        },
        {
          year: 2005,
          value: 9,
        },
        {
          year: 2006,
          value: 7,
        },
        {
          year: 2007,
          value: 11,
        },
      ],
      base: [
        {
          year: 2000,
          value: 9,
        },
        {
          year: 2001,
          value: 14,
        },
        {
          year: 2002,
          value: 16,
        },
        {
          year: 2003,
          value: 17,
        },
        {
          year: 2004,
          value: 16,
        },
        {
          year: 2005,
          value: 14,
        },
        {
          year: 2006,
          value: 16,
        },
        {
          year: 2007,
          value: 18,
        },
      ],
    },
  },
};
