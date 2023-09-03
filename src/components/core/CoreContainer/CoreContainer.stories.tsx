import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../Layout/Layout';
import type { CoreContainerProps } from './CoreContainer';
import { CoreContainer } from './CoreContainer';

const meta: Meta<typeof CoreContainer> = {
  component: CoreContainer,
};

export default meta;
type Story = StoryObj<typeof CoreContainer>;

export const Primary: Story = {
  render: ({ ...args }: CoreContainerProps) => (
    <ThemeProvider theme={theme}>
      <CoreContainer {...args}>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} />
      </CoreContainer>
    </ThemeProvider>
  ),
};
