import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { MultilineChartBaseProps } from './MultilineChartBase';
import MultilineChartBase from './MultilineChartBase';

const meta: Meta<typeof MultilineChartBase> = {
  component: MultilineChartBase,
};

export default meta;
type Story = StoryObj<typeof MultilineChartBase>;

export const Primary: Story = {
  render: ({ ...args }: MultilineChartBaseProps) => (
    <ThemeProvider theme={theme}>
      <MultilineChartBase {...args} />
    </ThemeProvider>
  ),
  args: {
    height: 400,
    chartType: 'line',
    yLabel: 'Concentration of Nitrate as N [mg/L]',
    annotations: [
      {
        date: 2004,
        title: 'Implementation start year',
      },
      {
        date: 2005,
        title: 'Implementation end year',
      },
    ],
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
