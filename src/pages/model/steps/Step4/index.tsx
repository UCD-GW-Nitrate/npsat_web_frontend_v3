import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreTextField } from '@/components/core/CoreTextField/CoreTextField';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

interface Step4Props extends Step {}

const fields = [
  { label: 'Scenario name' },
  {
    label: 'Description',
    position: 'flex-start' as 'flex-start' | 'center' | 'flex-end',
  },
];

const Step4 = ({ onPrev, onNext }: Step4Props) => {
  return (
    <CoreForm
      fields={fields}
      sx={{
        mt: 6,
      }}
    >
      <CoreTextField sx={{ width: 400 }} />
      <CoreTextField sx={{ width: 400 }} multiline />
      <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
    </CoreForm>
  );
};

export default Step4;
