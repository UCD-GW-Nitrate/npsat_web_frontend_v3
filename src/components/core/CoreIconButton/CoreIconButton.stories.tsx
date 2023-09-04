import { ThemeProvider } from '@emotion/react';
import WbCloudy from '@mui/icons-material/WbCloudy';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreIconButtonProps } from './CoreIconButton';
import { CoreIconButton } from './CoreIconButton';

const meta: Meta<typeof CoreIconButton> = {
  component: CoreIconButton,
};

export default meta;
type Story = StoryObj<typeof CoreIconButton>;

export const Primary: Story = {
  render: ({ ...args }: CoreIconButtonProps) => (
    <ThemeProvider theme={theme}>
      <CoreIconButton {...args}>
        <WbCloudy />
      </CoreIconButton>
    </ThemeProvider>
  ),
};
