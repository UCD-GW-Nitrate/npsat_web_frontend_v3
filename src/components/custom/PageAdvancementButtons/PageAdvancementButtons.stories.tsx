import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { PageAdvancementButtonsProps } from './PageAdvancementButtons';
import { PageAdvancementButtons } from './PageAdvancementButtons';

const meta: Meta<typeof PageAdvancementButtons> = {
  component: PageAdvancementButtons,
};

export default meta;
type Story = StoryObj<typeof PageAdvancementButtons>;

export const Primary: Story = {
  render: ({ ...args }: PageAdvancementButtonsProps) => (
    <ThemeProvider theme={theme}>
      <PageAdvancementButtons {...args} />
    </ThemeProvider>
  ),
};
