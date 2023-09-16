import { Box } from '@mui/material';
import React from 'react';

import { CoreSelect } from '@/components/core/CoreSelect/CoreSelect';

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

const Step1 = () => {
  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
      }}
    >
      <CoreSelect
        options={flowScenarioOptions}
        fieldLabel="Flow scenario:"
        displayLabel="left"
        sx={{ minWidth: '60vw' }}
      />
      <CoreSelect
        options={loadScenario}
        fieldLabel="Load scenario:"
        displayLabel="left"
        sx={{ minWidth: '60vw', mt: 2 }}
      />
      <CoreSelect
        options={wellTypeScenario}
        fieldLabel="Well Type scenario:"
        displayLabel="left"
        sx={{ minWidth: '60vw', mt: 2 }}
      />
      <CoreSelect
        options={unsatZoneDepthScenario}
        fieldLabel="Unsaturated zone depth scenario:"
        displayLabel="left"
        sx={{ minWidth: '60vw', mt: 2 }}
      />
    </Box>
  );
};

export default Step1;
