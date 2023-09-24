import { Box, Divider } from '@mui/material';
import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreTextField } from '@/components/core/CoreTextField/CoreTextField';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';
import Step4Instructions from './Step4Instructions';

interface Step4Props extends Step {}

const fields = [
  { label: 'Scenario name:' },
  {
    label: 'Description:',
    position: 'flex-start' as 'flex-start' | 'center' | 'flex-end',
  },
];

const Step4 = ({ onPrev, onNext }: Step4Props) => {
  const handleSubmit = () => {};

  return (
    <Box>
      <CoreForm
        fields={fields}
        sx={{
          mt: 6,
        }}
        onFormSubmit={handleSubmit}
      >
        <CoreTextField sx={{ width: 400 }} />
        <CoreTextField sx={{ width: 400 }} multiline />
        <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step4Instructions />
    </Box>
  );
};

export default Step4;
