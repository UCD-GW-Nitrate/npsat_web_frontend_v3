import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreMultipleSelectProps } from './CoreMultipleSelect';
import { CoreMultipleSelect } from './CoreMultipleSelect';

const meta: Meta<typeof CoreMultipleSelect> = {
  component: CoreMultipleSelect,
};

export default meta;
type Story = StoryObj<typeof CoreMultipleSelect>;

export const Primary: Story = {
  render: ({ ...args }: CoreMultipleSelectProps) => (
    <ThemeProvider theme={theme}>
      <CoreMultipleSelect {...args} />
    </ThemeProvider>
  ),
  args: {
    options: [
      {
        label: 'option1 ',
        value: 1,
      },
      {
        label: 'option2 ',
        value: 2,
      },
    ],
  },
};
