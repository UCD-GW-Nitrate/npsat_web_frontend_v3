import { Box, Divider } from '@mui/material';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreFormLayout } from '@/components/core/CoreForm/CoreFormLayout';
import { CoreTextField } from '@/components/core/CoreTextField/CoreTextField';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { setModelDescription, setModelName } from '@/store/slices/modelSlice';

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
  const dispatch = useDispatch();
  const onFormSubmit = (data: FieldValues) => {
    dispatch(setModelName(data['scenario name']));
    dispatch(setModelDescription(data.description));
    onNext();
  };

  return (
    <Box>
      <CoreForm
        sx={{
          mt: 6,
        }}
        onFormSubmit={onFormSubmit}
      >
        <CoreFormLayout fields={fields}>
          <CoreTextField sx={{ width: 400 }} name="scenario name" />
          <CoreTextField sx={{ width: 400 }} name="description" multiline />
          <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
        </CoreFormLayout>
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step4Instructions />
    </Box>
  );
};

export default Step4;
