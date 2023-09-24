import { Box, Divider } from '@mui/material';
import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreSlider } from '@/components/core/CoreSlider/CoreSlider';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';
import Step3Instructions from './Step3Instructions';

interface Step3Props extends Step {}

const crops = [
  { label: 'Alfalfa' },
  { label: 'All Other Crops' },
  { label: 'Almonds' },
  { label: 'Annual Grassland' },
  { label: 'Beans (dry)' },
  { label: 'Blue Oak Woodland' },
  { label: 'Carrots' },
  { label: 'Cherries' },
];

const fields = [{ label: 'Crop(s):' }, { label: 'Loading:' }];

const Step3 = ({ onPrev, onNext }: Step3Props) => {
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
        <CoreMultipleSelect
          options={crops}
          sx={{ width: 400 }}
          placeholder=""
          group={false}
        />
        <CoreSlider units="%" />
        <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step3Instructions />
    </Box>
  );
};

export default Step3;
