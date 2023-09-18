import React from 'react';

import { CoreDateField } from '@/components/core/CoreDateField/CoreDateField';
import { CoreDateRangeField } from '@/components/core/CoreDateRangeField/CoreDateRangeField';
import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreNumberField } from '@/components/core/CoreNumberField/CoreNumberField';
import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';
import { CoreToggleButton } from '@/components/core/CoreToggleButton/CoreToggleButton';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';

import type { Step } from '../../create';

const flowScenarioOptions = [
  { label: 'C2Vsim' },
  { label: 'CVHM (currently unavailable)' },
];
const loadScenario = [
  { label: 'GNLM' },
  { label: 'Baseline' },
  { label: 'High Fertilization' },
  { label: 'High Irrigation' },
  { label: 'High Irrigation and High Fertilization' },
];
const wellTypeScenario = [
  { label: 'Public Supply Wells and Irrigation Wells' },
  { label: 'Domestic Wells' },
  {
    label:
      'Virtual Shallow Monitoring Well Network Grid (currently unavailable)',
  },
];
const unsatZoneDepthScenario = [
  { label: 'Drought vadose zone thickness (spring 2015)' },
  { label: 'Typical vadose zone thickness (spring 2000)' },
];
const transiptionPeriodOptions = [
  { label: 'Custom scenario' },
  { label: 'BAU scenario' },
];
const fields = [
  { label: 'Flow scenario:' },
  { label: 'Load scenario:' },
  { label: 'Well Type scenario:' },
  { label: 'Unsaturated zone depth scenario:' },
  { label: 'Unsaturated zone effective water conent:' },
  { label: 'Simulation ending year:' },
  { label: 'Scenario type:' },
  { label: 'Transition period:' },
];

interface Step1Props extends Step {}

const Step1 = ({ onPrev, onNext }: Step1Props) => {
  return (
    <CoreForm
      fields={fields}
      sx={{
        mt: 6,
      }}
    >
      <CoreSelect
        options={flowScenarioOptions}
        sx={{ display: 'flex', flexGrow: 1 }}
      />
      <CoreSelect
        options={loadScenario}
        sx={{ display: 'flex', flexGrow: 1 }}
      />
      <CoreSelect
        options={wellTypeScenario}
        sx={{ display: 'flex', flexGrow: 1 }}
      />
      <CoreSelect
        options={unsatZoneDepthScenario}
        sx={{ display: 'flex', flexGrow: 1 }}
      />
      <CoreNumberField sx={{ width: 100 }} units="%" />
      <CoreDateField />
      <CoreToggleButton options={transiptionPeriodOptions} />
      <CoreDateRangeField />
      <PageAdvancementButtons onClickPrev={onPrev} onClickNext={onNext} />
    </CoreForm>
  );
};

export default Step1;
