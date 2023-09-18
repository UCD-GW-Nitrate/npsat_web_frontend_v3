import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreSwitchProps } from './CoreSwitch';
import { CoreSwitch } from './CoreSwitch';

const meta: Meta<typeof CoreSwitch> = {
  component: CoreSwitch,
};

export default meta;
type Story = StoryObj<typeof CoreSwitch>;

export const Primary: Story = {
  render: ({ ...args }: CoreSwitchProps) => (
    <ThemeProvider theme={theme}>
      <CoreSwitch {...args} />
    </ThemeProvider>
  ),
};
