import { Box, Divider } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreRangeSlider } from '@/components/core/CoreRangeSlider/CoreRangeSlider';
import { CoreSwitch } from '@/components/core/CoreSwitch/CoreSwitch';
import { CoreTabs } from '@/components/core/CoreTabs/CoreTabs';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { saveCurrentStep } from '@/store/slices/modelSlice';

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
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const defaultFields = [{ label: '' }, { label: 'Advanced filter:' }];
  const [fields, setFields] = useState([...defaultFields]);
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

  const handleShowAdvancedOptions = (val: boolean) => {
    setShowAdvancedFilter(val);
    if (val) {
      setFields([
        ...defaultFields,
        { label: 'Depth (m):' },
        { label: 'Screen Length (m):' },
      ]);
    } else {
      setFields(defaultFields);
    }
  };

  const onFormSubmit = (data: FieldValues) => {
    if (showAdvancedFilter) {
      dispatch(
        saveCurrentStep({
          regions: (data.map as number[]).map((val) => {
            return { id: val };
          }),
          depth_range_min: data.depth[0],
          depth_range_max: data.depth[1],
          screen_length_range_min: data['screen length'][0],
          screen_length_range_max: data['screen length'][1],
        }),
      );
    } else {
      dispatch(
        saveCurrentStep({
          regions: (data.map as number[]).map((val) => {
            return { id: val };
          }),
        }),
      );
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <CoreTabs tabs={tabs} onTabChange={handleTabChange} />
      <CoreForm
        fields={fields}
        sx={{
          mt: 6,
        }}
        onFormSubmit={onFormSubmit}
      >
        <div id="map" style={{ height: '600px', width: '500px' }}>
          <MapWithNoSSR mapType={mapType} />
        </div>
        <CoreSwitch onSwitchChange={handleShowAdvancedOptions} />
        {showAdvancedFilter && (
          <CoreRangeSlider
            name="depth"
            units="ft"
            minFieldLabel="min:"
            maxFieldLabel="max:"
            min={0}
            max={800}
          />
        )}
        {showAdvancedFilter && (
          <CoreRangeSlider
            name="screen length"
            units="ft"
            minFieldLabel="min:"
            maxFieldLabel="max:"
            min={0}
            max={800}
          />
        )}
        <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step2Instructions />
    </Box>
  );
};

export default Step2;
