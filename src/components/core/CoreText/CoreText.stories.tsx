import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreTextProps } from './CoreText';
import { CoreText } from './CoreText';

const meta: Meta<typeof CoreText> = {
  component: CoreText,
};

export default meta;
type Story = StoryObj<typeof CoreText>;

export const Primary: Story = {
  render: ({ ...args }: CoreTextProps) => (
    <ThemeProvider theme={theme}>
      <CoreText {...args} />
    </ThemeProvider>
  ),
  args: {
    children: 'text',
  },
};
