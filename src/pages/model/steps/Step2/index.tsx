import dynamic from 'next/dynamic';
import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreSwitch } from '@/components/core/CoreSwitch/CoreSwitch';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

interface Step2Props extends Step {}

const Step2 = ({ onPrev, onNext }: Step2Props) => {
  const MapWithNoSSR = dynamic(
    () => import('@/components/maps/FormMapSelect'),
    {
      ssr: false,
    },
  );

  return (
    <CoreForm
      fields={[{ label: '' }, { label: 'Advanced filter:' }]}
      sx={{
        mt: 6,
      }}
    >
      <div id="map" style={{ height: '600px', width: '500px' }}>
        <MapWithNoSSR mapType="valley" />
      </div>
      <CoreSwitch />
      <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
    </CoreForm>
  );
};

export default Step2;
