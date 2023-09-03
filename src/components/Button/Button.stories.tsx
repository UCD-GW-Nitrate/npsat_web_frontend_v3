import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../Layout/Layout';
import type { ButtonProps } from './Button';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  render: ({ label, ...args }: ButtonProps) => (
    <ThemeProvider theme={theme}>
      <Button {...args} label={label} />
    </ThemeProvider>
  ),
};
