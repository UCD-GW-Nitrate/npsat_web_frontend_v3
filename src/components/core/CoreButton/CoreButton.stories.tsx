import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../Layout/Layout';
import type { CoreButtonProps } from './CoreButton';
import { CoreButton } from './CoreButton';

const meta: Meta<typeof CoreButton> = {
  component: CoreButton,
};

export default meta;
type Story = StoryObj<typeof CoreButton>;

export const Primary: Story = {
  render: ({ label, ...args }: CoreButtonProps) => (
    <ThemeProvider theme={theme}>
      <CoreButton {...args} label={label} />
    </ThemeProvider>
  ),
  args: {
    label: 'Button',
    variant: 'contained',
  },
};
