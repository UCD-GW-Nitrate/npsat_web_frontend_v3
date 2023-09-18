import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreTabsProps } from './CoreTabs';
import { CoreTabs } from './CoreTabs';

const meta: Meta<typeof CoreTabs> = {
  component: CoreTabs,
};

export default meta;
type Story = StoryObj<typeof CoreTabs>;

export const Primary: Story = {
  render: ({ ...args }: CoreTabsProps) => (
    <ThemeProvider theme={theme}>
      <CoreTabs {...args} />
    </ThemeProvider>
  ),
  args: {
    tabs: [
      {
        label: 'tab one',
      },
      {
        label: 'tab two',
      },
    ],
  },
};
