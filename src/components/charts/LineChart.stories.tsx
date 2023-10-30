import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { MultilineChartProps } from './MultilineChart';
import MultilineChart from './MultilineChart';

const meta: Meta<typeof MultilineChart> = {
  component: MultilineChart,
};

export default meta;
type Story = StoryObj<typeof MultilineChart>;

export const Primary: Story = {
  render: ({ ...args }: MultilineChartProps) => (
    <ThemeProvider theme={theme}>
      <MultilineChart {...args} />
    </ThemeProvider>
  ),
  args: {
    width: 800,
    height: 400,
    chartType: 'line',
  },
};
