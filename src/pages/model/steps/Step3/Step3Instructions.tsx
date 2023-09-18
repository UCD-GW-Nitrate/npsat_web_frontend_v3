import { Box } from '@mui/material';

import { CoreText } from '@/components/core/CoreText/CoreText';

const Step3Instructions = () => {
  return (
    <Box sx={{ mx: 4 }}>
      <CoreText variant="h2" color="description" paragraph>
        Instructions
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Select a crop:
      </CoreText>
      <CoreText color="description" paragraph>
        Drag the slider to change future nitrate loading rates (as fraction of
        current), or type percentage into the textbox.
      </CoreText>
      <CoreText color="description" paragraph>
        Note: The future nitrate loading is expressed as percent of the current
        (“business-as-usual” or BAU) loading. The current loading is defined by
        the historic to current nitrate loading scenario selected under
        “Settings”. The BAU scenario continues those loadings indefinitely. The
        custom scenario will gradually adjust to the new nitrate loading levels
        selected here over the transition period, which was defined in
        “Settings”.
      </CoreText>
      <CoreText color="description" paragraph>
        Land use type may depend on the loading scenario selected under
        “Settings” The type “All other crops” refers to all land use types that
        have NOT been selected explicitly here. This allows for easily changing
        the nitrate loading from all land use types that are not specifically
        defined here by the user.
      </CoreText>
    </Box>
  );
};

export default Step3Instructions;
