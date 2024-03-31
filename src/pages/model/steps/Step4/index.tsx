import { Box, Divider } from '@mui/material';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreFormLayout } from '@/components/core/CoreForm/CoreFormLayout';
import { CoreTextField } from '@/components/core/CoreTextField/CoreTextField';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import type { Model } from '@/store/slices/modelSlice';
import {
  selectCurrentModel,
  setModelDescription,
  setModelName,
} from '@/store/slices/modelSlice';

import type { Step } from '../../create';
import Step4Instructions from './Step4Instructions';

interface Step4Props extends Step {
  onComplete: (newModel: Model) => void;
}

const fields = [
  { label: 'Scenario name:' },
  {
    label: 'Description:',
    position: 'flex-start' as 'flex-start' | 'center' | 'flex-end',
  },
];

const Step4 = ({ onPrev, onComplete }: Step4Props) => {
  const dispatch = useDispatch();
  const model = useSelector(selectCurrentModel);
  const onFormSubmit = (data: FieldValues) => {
    dispatch(setModelName(data['scenario name']));
    dispatch(setModelDescription(data.description));
    onComplete({
      ...model,
      name: data['scenario name'],
      description: data.description,
    });
  };

  return (
    <Box>
      <CoreForm
        sx={{
          mt: 6,
        }}
        onFormSubmit={(data: FieldValues) => onFormSubmit(data)}
      >
        <CoreFormLayout fields={fields}>
          <CoreTextField sx={{ width: 400 }} name="scenario name" formField />
          <CoreTextField
            sx={{ width: 400 }}
            name="description"
            multiline
            formField
          />
          <PageAdvancementButtons onClickPrev={onPrev} />
        </CoreFormLayout>
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step4Instructions />
    </Box>
  );
};

export default Step4;
