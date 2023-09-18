import React from 'react';

import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreSlider } from '@/components/core/CoreSlider/CoreSlider';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

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

const fields = [{ label: 'Crop(s)' }, { label: 'Loading' }];

const Step3 = ({ onPrev, onNext }: Step3Props) => {
  return (
    <CoreForm
      fields={fields}
      sx={{
        mt: 6,
      }}
    >
      <CoreMultipleSelect
        options={crops}
        sx={{ display: 'flex', flexGrow: 1 }}
        placeholder=""
        group={false}
      />
      <CoreSlider units="%" />
      <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
    </CoreForm>
  );
};

export default Step3;
