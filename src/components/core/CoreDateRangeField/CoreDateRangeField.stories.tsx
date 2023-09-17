import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

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
      <CoreDateRangeField {...args} />
    </ThemeProvider>
  ),
};
