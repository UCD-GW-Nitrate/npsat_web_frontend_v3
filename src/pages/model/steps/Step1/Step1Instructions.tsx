import { Box } from '@mui/material';

import { CoreText } from '@/components/core/CoreText/CoreText';

const Step1Instructions = () => {
  return (
    <Box sx={{ mx: 4 }}>
      <CoreText variant="h2" color="description" paragraph>
        Instructions
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Select Scenarios:
      </CoreText>
      <CoreText color="description" paragraph>
        Hover on the info circle to see detailed explanation about the scenario.
        Scenario chosen will determine the number of wells and the type and
        number of crops in subsequent menus.
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Simulation ending year:
      </CoreText>
      <CoreText color="description" paragraph>
        Enter the last year of the scenario simulation run. By default, this
        will be the year 2100. It can be no later than the year 2500.
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Transition period:
      </CoreText>
      <CoreText color="description" paragraph>
        This is the beginning year and final year of the transition from the
        current Business-As-Usual (BAU) to the new nitrate loadig scenario.
        Typically would start within the next five years and end in a year about
        15 to 25 years from now.
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Unsaturated zone effective water content:
      </CoreText>
      <CoreText color="description" paragraph>
        This refers to the effective water content for the unsaturated zone. The
        smaller the effective water content, the faster the travel time through
        the unsaturated zone. When choosing &quot;0%&quot;, the travel time
        through the unsaturated zone is ignored and all nitrate loading is
        instantaneously applied to the water table. A recommended range for the
        effective water content is 5% - 10%.
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        BAU:
      </CoreText>
      <CoreText color="description" paragraph>
        &quot;Business-As-Usual&quot; refers to the continuation of past and
        current practices well into the future, without notable changes in
        nitrate leaching.
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Other selections:
      </CoreText>
      <CoreText color="description" paragraph>
        Under development
      </CoreText>
    </Box>
  );
};

export default Step1Instructions;
