import 'leaflet/dist/leaflet.css';
import './styles.css';

import { ThemeProvider } from '@emotion/react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';

import theme from '@/components/theme';
import { store } from '@/store';

import type { FormMapSelectProps } from './FormMapSelect';
import FormMapSelect from './FormMapSelect';

const meta: Meta<typeof FormMapSelect> = {
  component: FormMapSelect,
};

export default meta;
type Story = StoryObj<typeof FormMapSelect>;

export const Primary: Story = {
  render: ({ ...args }: FormMapSelectProps) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div id="map" style={{ height: '600px' }}>
          <FormMapSelect {...args} />
        </div>
      </ThemeProvider>
    </Provider>
  ),
  args: {
    mapType: 'county',
  },
};
