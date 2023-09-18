import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

interface Step4Props extends Step {}

const Step4 = ({ onPrev, onNext }: Step4Props) => {
  return (
    <CoreForm
      fields={[]}
      sx={{
        mt: 6,
      }}
    >
      <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
    </CoreForm>
  );
};

export default Step4;
