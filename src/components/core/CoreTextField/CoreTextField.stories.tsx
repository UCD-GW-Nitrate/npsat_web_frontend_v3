import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../Layout/Layout';
import type { CoreTextFieldProps } from './CoreTextField';
import { CoreTextField } from './CoreTextField';

const meta: Meta<typeof CoreTextField> = {
  component: CoreTextField,
};

export default meta;
type Story = StoryObj<typeof CoreTextField>;

export const Primary: Story = {
  render: ({ ...args }: CoreTextFieldProps) => (
    <ThemeProvider theme={theme}>
      <CoreTextField {...args} />
    </ThemeProvider>
  ),
};
