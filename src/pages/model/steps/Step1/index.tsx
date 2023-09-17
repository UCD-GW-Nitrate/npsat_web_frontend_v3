import React from 'react';

import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';
import { CoreToggleButton } from '@/components/core/CoreToggleButton/CoreToggleButton';
import { VBox } from '@/components/VBox/VBox';

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

const Step1 = () => {
  return (
    <VBox
      spacing={2}
      sx={{
        mt: 4,
        alignItems: 'flex-start',
      }}
    >
      <CoreSelect
        options={flowScenarioOptions}
        fieldLabel="Flow scenario:"
        displayLabel="left"
        labelStyle={{ minWidth: '30vw' }}
        sx={{ flexGrow: 1 }}
      />
      <CoreSelect
        options={loadScenario}
        fieldLabel="Load scenario:"
        displayLabel="left"
        labelStyle={{ minWidth: '30vw' }}
        sx={{ flexGrow: 1 }}
      />
      <CoreSelect
        options={wellTypeScenario}
        fieldLabel="Well Type scenario:"
        displayLabel="left"
        labelStyle={{ minWidth: '30vw' }}
        sx={{ flexGrow: 1 }}
      />
      <CoreSelect
        options={unsatZoneDepthScenario}
        fieldLabel="Unsaturated zone depth scenario:"
        displayLabel="left"
        labelStyle={{ minWidth: '30vw' }}
        sx={{ flexGrow: 1 }}
      />
      <CoreToggleButton
        options={transiptionPeriodOptions}
        fieldLabel="Scenario type:"
        displayLabel="left"
        labelStyle={{ minWidth: '30vw' }}
      />
    </VBox>
  );
};

export default Step1;
