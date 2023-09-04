import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import type { CoreTableProps } from './CoreTable';
import { CoreTable } from './CoreTable';

const meta: Meta<typeof CoreTable> = {
  component: CoreTable,
};

export default meta;
type Story = StoryObj<typeof CoreTable>;

export const Primary: Story = {
  render: ({ ...args }: CoreTableProps) => (
    <ThemeProvider theme={theme}>
      <CoreTable {...args} />
    </ThemeProvider>
  ),
  args: {
    columns: [
      { field: 'name', label: 'Scenario Name', width: 200 },
      { field: 'description', label: 'Description', width: 200 },
      { field: 'status', label: 'Status', width: 100 },
      {
        field: 'dateCreated',
        label: 'Date Created',
        width: 150,
      },
      {
        field: 'dateCompleted',
        label: 'Date Completed',
        width: 150,
      },
      {
        field: 'types',
        label: 'Types',
        width: 150,
      },
    ],
    data: [],
    rowsPerPage: 0,
    page: 1,
    handleChangePage: () => {},
    handleChangeRowsPerPage: () => {},
  },
};
