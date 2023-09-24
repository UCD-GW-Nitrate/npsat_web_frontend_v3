import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';

import theme from '@/components/theme';

import { CoreForm } from '../core/CoreForm/CoreForm';
import type { FormMapProps } from './FormMap';
import { FormMap } from './FormMap';

const meta: Meta<typeof FormMap> = {
  component: FormMap,
};

export default meta;
type Story = StoryObj<typeof FormMap>;

export const Primary: Story = {
  render: ({ ...args }: FormMapProps) => (
    <ThemeProvider theme={theme}>
      <CoreForm>
        <div id="map" style={{ height: '600px' }}>
          <FormMap {...args} />
        </div>
      </CoreForm>
    </ThemeProvider>
  ),
  args: {
    name: 'display',
    data: [],
  },
};
