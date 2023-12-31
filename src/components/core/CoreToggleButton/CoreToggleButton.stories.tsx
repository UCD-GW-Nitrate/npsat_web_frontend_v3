import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreToggleButtonProps } from './CoreToggleButton';
import { CoreToggleButton } from './CoreToggleButton';

const meta: Meta<typeof CoreToggleButton> = {
  component: CoreToggleButton,
};

export default meta;
type Story = StoryObj<typeof CoreToggleButton>;

export const Primary: Story = {
  render: ({ ...args }: CoreToggleButtonProps) => (
    <ThemeProvider theme={theme}>
      <CoreToggleButton {...args} />
    </ThemeProvider>
  ),
  args: {
    options: [
      {
        label: 'option1 ',
      },
      {
        label: 'option2 ',
      },
    ],
  },
};
