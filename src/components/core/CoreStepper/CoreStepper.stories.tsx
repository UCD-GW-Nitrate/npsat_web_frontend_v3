import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreStepperProps } from './CoreStepper';
import { CoreStepper } from './CoreStepper';

const meta: Meta<typeof CoreStepper> = {
  component: CoreStepper,
};

export default meta;
type Story = StoryObj<typeof CoreStepper>;

export const Primary: Story = {
  render: ({ ...args }: CoreStepperProps) => (
    <ThemeProvider theme={theme}>
      <CoreStepper {...args} />
    </ThemeProvider>
  ),
  args: {
    steps: ['step 1', 'step 2', 'step 3'],
  },
};
