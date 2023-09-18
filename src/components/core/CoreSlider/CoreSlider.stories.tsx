import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreSliderProps } from './CoreSlider';
import { CoreSlider } from './CoreSlider';

const meta: Meta<typeof CoreSlider> = {
  component: CoreSlider,
};

export default meta;
type Story = StoryObj<typeof CoreSlider>;

export const Primary: Story = {
  render: ({ ...args }: CoreSliderProps) => (
    <ThemeProvider theme={theme}>
      <Box sx={{ mt: 2 }}>
        <CoreSlider {...args} />
      </Box>
    </ThemeProvider>
  ),
};
