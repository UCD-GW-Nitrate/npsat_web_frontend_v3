import { ThemeProvider } from '@emotion/react';
import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import { CoreForm } from '../CoreForm/CoreForm';
import type { CoreRangeSliderProps } from './CoreRangeSlider';
import { CoreRangeSlider } from './CoreRangeSlider';

const meta: Meta<typeof CoreRangeSlider> = {
  component: CoreRangeSlider,
};

export default meta;
type Story = StoryObj<typeof CoreRangeSlider>;

export const Primary: Story = {
  render: ({ ...args }: CoreRangeSliderProps) => (
    <ThemeProvider theme={theme}>
      <CoreForm>
        <Box sx={{ mt: 2 }}>
          <CoreRangeSlider {...args} />
        </Box>
      </CoreForm>
    </ThemeProvider>
  ),
};
