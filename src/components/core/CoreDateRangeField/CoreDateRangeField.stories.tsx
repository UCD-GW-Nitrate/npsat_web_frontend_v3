import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import { CoreForm } from '../CoreForm/CoreForm';
import type { CoreDateRangeFieldProps } from './CoreDateRangeField';
import { CoreDateRangeField } from './CoreDateRangeField';

const meta: Meta<typeof CoreDateRangeField> = {
  component: CoreDateRangeField,
};

export default meta;
type Story = StoryObj<typeof CoreDateRangeField>;

export const Primary: Story = {
  render: ({ ...args }: CoreDateRangeFieldProps) => (
    <ThemeProvider theme={theme}>
      <CoreForm>
        <CoreDateRangeField {...args} />
      </CoreForm>
    </ThemeProvider>
  ),
  args: {
    name: 'display',
  },
};
