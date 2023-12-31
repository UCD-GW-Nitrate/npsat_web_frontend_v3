import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreDateFieldProps } from './CoreDateField';
import { CoreDateField } from './CoreDateField';

const meta: Meta<typeof CoreDateField> = {
  component: CoreDateField,
};

export default meta;
type Story = StoryObj<typeof CoreDateField>;

export const Primary: Story = {
  render: ({ ...args }: CoreDateFieldProps) => (
    <ThemeProvider theme={theme}>
      <CoreDateField {...args} />
    </ThemeProvider>
  ),
};
