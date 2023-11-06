import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { DifferenceHeatmapProps } from './DifferenceHeatmap';
import DifferenceHeatmap from './DifferenceHeatmap';

const meta: Meta<typeof DifferenceHeatmap> = {
  component: DifferenceHeatmap,
};

export default meta;
type Story = StoryObj<typeof DifferenceHeatmap>;

export const Primary: Story = {
  render: ({ ...args }: DifferenceHeatmapProps) => (
    <ThemeProvider theme={theme}>
      <DifferenceHeatmap {...args} />
    </ThemeProvider>
  ),
  args: {
    width: 800,
    height: 400,
  },
};
