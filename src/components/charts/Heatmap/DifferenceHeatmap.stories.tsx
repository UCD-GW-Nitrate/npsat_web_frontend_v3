import type { Meta, StoryObj } from '@storybook/react';

import type { DifferenceHeatmapProps } from './DifferenceHeatmap';
import DifferenceHeatmap from './DifferenceHeatmap';

const meta: Meta<typeof DifferenceHeatmap> = {
  component: DifferenceHeatmap,
};

export default meta;
type Story = StoryObj<typeof DifferenceHeatmap>;

export const Primary: Story = {
  render: ({ ...args }: DifferenceHeatmapProps) => (
    <DifferenceHeatmap {...args} />
  ),
  args: {
    width: 500,
    height: 550,
  },
};
