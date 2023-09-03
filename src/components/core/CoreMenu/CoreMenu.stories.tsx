import { ThemeProvider } from '@emotion/react';
import SendIcon from '@mui/icons-material/Send';
import type { Meta, StoryObj } from '@storybook/react';

import { theme } from '../../Layout/Layout';
import type { CoreMenuProps } from './CoreMenu';
import { CoreMenu } from './CoreMenu';

const meta: Meta<typeof CoreMenu> = {
  component: CoreMenu,
};

export default meta;
type Story = StoryObj<typeof CoreMenu>;

export const Primary: Story = {
  render: ({ ...args }: CoreMenuProps) => (
    <ThemeProvider theme={theme}>
      <CoreMenu {...args} />
    </ThemeProvider>
  ),
  args: {
    options: [
      {
        label: 'label',
        icon: <SendIcon fontSize="small" />,
      },
    ],
    open: true,
  },
};
