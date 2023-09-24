import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import { CoreForm } from '../CoreForm/CoreForm';
import type { CoreSelectProps } from './CoreSelect';
import { CoreSelect } from './CoreSelect';

const meta: Meta<typeof CoreSelect> = {
  component: CoreSelect,
};

export default meta;
type Story = StoryObj<typeof CoreSelect>;

export const Primary: Story = {
  render: ({ ...args }: CoreSelectProps) => (
    <ThemeProvider theme={theme}>
      <CoreForm>
        <CoreSelect {...args} />
      </CoreForm>
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
    name: 'display',
  },
};
