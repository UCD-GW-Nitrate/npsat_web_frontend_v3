import { Box, Divider } from '@mui/material';
import type { FormEvent } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { CoreDateField } from '@/components/core/CoreDateField/CoreDateField';
import { CoreDateRangeField } from '@/components/core/CoreDateRangeField/CoreDateRangeField';
import { CoreForm } from '@/components/core/CoreForm/CoreForm';
import { CoreNumberField } from '@/components/core/CoreNumberField/CoreNumberField';
import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';
import { CoreToggleButton } from '@/components/core/CoreToggleButton/CoreToggleButton';
import { PageAdvancementButtons } from '@/components/custom/PageAdvancementButtons/PageAdvancementButtons';
import { saveCurrentStep } from '@/store/slices/modelSlice';

import type { Step } from '../../create';
import Step1Instructions from './Step1Instructions';

const flowScenarioOptions = [
  { label: 'C2Vsim' },
  { label: 'CVHM (currently unavailable)' },
];
const loadScenarioOptions = [
  { label: 'GNLM' },
  { label: 'Baseline' },
  { label: 'High Fertilization' },
  { label: 'High Irrigation' },
  { label: 'High Irrigation and High Fertilization' },
];
const wellTypeScenarioOptions = [
  { label: 'Public Supply Wells and Irrigation Wells' },
  { label: 'Domestic Wells' },
  {
    label:
      'Virtual Shallow Monitoring Well Network Grid (currently unavailable)',
  },
];
const unsatZoneDepthScenarioOptions = [
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
  const dispatch = useDispatch();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const flowScenario: string = data.get('flow scenario')?.toString() ?? '';
    const loadScenario: string = data.get('load scenario')?.toString() ?? '';
    const wellTypeScenario: string =
      data.get('well type scenario')?.toString() ?? '';
    const unsatZoneDepthScenario: string =
      data.get('unsat zone depth scenario')?.toString() ?? '';
    dispatch(
      saveCurrentStep({
        flow_scenario: flowScenario,
        load_scenario: loadScenario,
        unsat_scenario: unsatZoneDepthScenario,
        welltype_scenario: wellTypeScenario,
      }),
    );

    onNext();
  };

  return (
    <Box>
      <CoreForm
        fields={fields}
        sx={{
          mt: 6,
        }}
        onFormSubmit={handleSubmit}
      >
        <CoreSelect
          options={flowScenarioOptions}
          sx={{ display: 'flex', flexGrow: 1 }}
          name="flow scenario"
          key="flow scenario"
        />
        <CoreSelect
          options={loadScenarioOptions}
          sx={{ display: 'flex', flexGrow: 1 }}
          name="load scenario"
          key="load scenario"
        />
        <CoreSelect
          options={wellTypeScenarioOptions}
          sx={{ display: 'flex', flexGrow: 1 }}
          name="well type scenario"
          key="well type scenario"
        />
        <CoreSelect
          options={unsatZoneDepthScenarioOptions}
          sx={{ display: 'flex', flexGrow: 1 }}
          name="unsat zone depth scenario"
          key="unsat zone depth scenario"
        />
        <CoreNumberField sx={{ width: 100 }} units="%" name="water content" />
        <CoreDateField />
        <CoreToggleButton options={transiptionPeriodOptions} />
        <CoreDateRangeField />
        <PageAdvancementButtons onClickPrev={onPrev} />
      </CoreForm>
      <Divider sx={{ mt: 6 }} />
      <Step1Instructions />
    </Box>
  );
};

export default Step1;
