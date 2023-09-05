import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreMenuButtonProps } from './CoreMenuButton';
import { CoreMenuButton } from './CoreMenuButton';

const meta: Meta<typeof CoreMenuButton> = {
  component: CoreMenuButton,
};

export default meta;
type Story = StoryObj<typeof CoreMenuButton>;

export const Primary: Story = {
  render: ({ ...args }: CoreMenuButtonProps) => (
    <ThemeProvider theme={theme}>
      <CoreMenuButton {...args} />
    </ThemeProvider>
  ),
  args: {
    options: [
      {
        label: 'label',
      },
    ],
    label: 'Button',
    variant: 'contained',
  },
};
