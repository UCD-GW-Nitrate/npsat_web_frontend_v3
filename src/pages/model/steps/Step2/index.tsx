import { Box, Divider } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreTabs } from '@/components/core/CoreTabs/CoreTabs';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import type { RegionID } from '@/store/slices/modelSlice';
import {
  setModelDepthRangeMax,
  setModelDepthRangeMin,
  setModelRegions,
  setModelScreenLenRangeMax,
  setModelScreenLenRangeMin,
} from '@/store/slices/modelSlice';

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
  const dispatch = useDispatch();

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

  const onFormSubmit = (formData: FieldValues) => {
    console.log('submitting map form');
    if (formData.showAdvancedFilter) {
      dispatch(
        setModelRegions(
          (formData.map as number[]).map((val) => {
            return { id: val } as RegionID;
          }),
        ),
      );
      dispatch(setModelDepthRangeMax(formData.depth[0]));
      dispatch(setModelDepthRangeMin(formData.depth[1]));
      dispatch(setModelScreenLenRangeMin(formData['screen length'][0]));
      dispatch(setModelScreenLenRangeMax(formData['screen length'][1]));
    } else {
      dispatch(
        setModelRegions(
          (formData.map as number[]).map((val) => {
            return { id: val } as RegionID;
          }),
        ),
      );
    }
    onNext();
  };

  return (
    <Box sx={{ mt: 6 }}>
      <CoreTabs tabs={tabs} onTabChange={handleTabChange} />
      <CoreForm
        sx={{
          mt: 2,
        }}
        onFormSubmit={onFormSubmit}
      >
        <div id="map">
          <MapWithNoSSR mapType={mapType} />
        </div>
        <PageAdvancementButtons
          onClickPrev={onPrev}
          onClickNext={onNext}
          sx={{ ml: 50, mt: 2 }}
        />
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step2Instructions />
    </Box>
  );
};

export default Step2;
