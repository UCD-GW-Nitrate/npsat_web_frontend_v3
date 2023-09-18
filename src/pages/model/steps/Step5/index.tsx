import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

interface Step5Props extends Step {}

const Step5 = ({ onPrev, onNext }: Step5Props) => {
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

export default Step5;
