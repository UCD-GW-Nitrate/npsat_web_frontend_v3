import { Box, Divider } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreSwitch } from '@/components/core/CoreSwitch/CoreSwitch';
import { CoreTabs } from '@/components/core/CoreTabs/CoreTabs';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';
import Step2Instructions from './Step2Instructions';

interface Step2Props extends Step {}

const tabs = [
  { label: 'Central Valley', value: 'valley' },
  { label: 'Basin', value: 'basin' },
  { label: 'County', value: 'county' },
  { label: 'B118 Basin', value: 'b118basin' },
  { label: 'Subregions', value: 'subregions' },
  { label: 'Township', value: 'township' },
];

const Step2 = ({ onPrev, onNext }: Step2Props) => {
  const [mapType, setMapType] = useState<
    'valley' | 'basin' | 'county' | 'b118basin' | 'subregions' | 'township'
  >('valley');

  const MapWithNoSSR = dynamic(
    () => import('@/components/maps/FormMapSelect'),
    {
      ssr: false,
    },
  );

  const handleTabChange = (tab: string) => {
    setMapType(
      tab as
        | 'valley'
        | 'basin'
        | 'county'
        | 'b118basin'
        | 'subregions'
        | 'township',
    );
  };

  return (
    <Box sx={{ mt: 6 }}>
      <CoreTabs tabs={tabs} onTabChange={handleTabChange} />
      <CoreForm
        fields={[{ label: '' }, { label: 'Advanced filter:' }]}
        sx={{
          mt: 6,
        }}
      >
        <div id="map" style={{ height: '600px', width: '500px' }}>
          <MapWithNoSSR mapType={mapType} />
        </div>
        <CoreSwitch />
        <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step2Instructions />
    </Box>
  );
};

export default Step2;
