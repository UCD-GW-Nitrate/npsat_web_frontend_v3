import { Box } from '@mui/material';

import { StandardText } from '@/components/custom/StandardText/StandardText';

const Step3Instructions = () => {
  return (
    <Box sx={{ mx: 4 }}>
      <StandardText variant="h4" color="description">
        Instructions
      </StandardText>
      <StandardText variant="h5" color="description">
        Select a crop:
      </StandardText>
      <StandardText color="description">
        Drag the slider to change future nitrate loading rates (as fraction of
        current), or type percentage into the textbox.
      </StandardText>
      <StandardText color="description">
        Note: The future nitrate loading is expressed as percent of the current
        (“business-as-usual” or BAU) loading. The current loading is defined by
        the historic to current nitrate loading scenario selected under
        “Settings”. The BAU scenario continues those loadings indefinitely. The
        custom scenario will gradually adjust to the new nitrate loading levels
        selected here over the transition period, which was defined in
        “Settings”.
      </StandardText>
      <StandardText color="description">
        Land use type may depend on the loading scenario selected under
        “Settings” The type “All other crops” refers to all land use types that
        have NOT been selected explicitly here. This allows for easily changing
        the nitrate loading from all land use types that are not specifically
        defined here by the user.
      </StandardText>
    </Box>
  );
};

export default Step3Instructions;
