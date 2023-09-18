import { Box } from '@mui/material';

import { CoreText } from '@/components/core/CoreText/CoreText';

const Step4Instructions = () => {
  return (
    <Box sx={{ mx: 4 }}>
      <CoreText variant="h2" color="description" paragraph>
        Instructions
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Scenario name
      </CoreText>
      <CoreText color="description" paragraph>
        Enter a scenario name, limited 255 characters.
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Scenario description
      </CoreText>
      <CoreText color="description" paragraph>
        Enter scenario optional description, no characters limit.
      </CoreText>
      <CoreText color="description" paragraph>
        Once submitted, your customized scenario will be created and run.
        Scenario will be running for a few seconds to up to a minute (based on
        number of wells selected) to generate results.
      </CoreText>
    </Box>
  );
};

export default Step4Instructions;
