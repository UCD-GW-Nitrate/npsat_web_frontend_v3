import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreNumberFieldProps } from './CoreNumberField';
import { CoreNumberField } from './CoreNumberField';

const meta: Meta<typeof CoreNumberField> = {
  component: CoreNumberField,
};

export default meta;
type Story = StoryObj<typeof CoreNumberField>;

export const Primary: Story = {
  render: ({ ...args }: CoreNumberFieldProps) => (
    <ThemeProvider theme={theme}>
      <CoreNumberField {...args} />
    </ThemeProvider>
  ),
};
