import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreSwitch } from '@/components/core/CoreSwitch/CoreSwitch';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

interface Step2Props extends Step {}

const Step2 = ({ onPrev, onNext }: Step2Props) => {
  return (
    <CoreForm
      fields={[{ label: 'Advanced filter:' }]}
      sx={{
        mt: 6,
      }}
    >
      <CoreSwitch />
      <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
    </CoreForm>
  );
};

export default Step2;
