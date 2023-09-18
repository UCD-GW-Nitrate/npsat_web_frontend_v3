import { Box } from '@mui/material';

import { CoreText } from '@/components/core/CoreText/CoreText';

const Step2Instructions = () => {
  return (
    <Box sx={{ mx: 4 }}>
      <CoreText variant="h2" color="description" paragraph>
        Instructions
      </CoreText>
      <CoreText variant="h3" color="description" paragraph>
        Select a region or regions:
      </CoreText>
      <CoreText color="description" paragraph>
        Choose the type of regions.
      </CoreText>
      <CoreText color="description" paragraph>
        Choose region(s) on the map or in the dropdown list.
      </CoreText>
      <CoreText color="description" paragraph>
        Click Next to continue selecting other scenario parameters.
      </CoreText>
      <CoreText color="description" paragraph>
        Note: You can only select one type of region (e.g., “B118 Basin”), but
        within that type, any number regions (1 to all) can be selected. The
        number of wells in the selected region(s) is displayed on top of the
        map. The scenario simulations (including the BAU simulation) will
        evaluate nitrate concentrations at these wells and aggregate those into
        statistical results.
      </CoreText>
      <CoreText color="description" paragraph>
        The “Advanced filter” allows for selection of wells within a specific
        minimum and maximum well depth interval, and/or consider streamlines to
        well screens within a specific minimum and maximum screen depth
        interval. This may affect the number of wells selected for the
        simulation, as shown above the map.
      </CoreText>
      <CoreText color="description" paragraph>
        “Basin”: select the Sacramento Valley, San Joaquin Valley, and Tulare
        Lake Basin (also known as the Southern San Joaquin Valley) watersheds
        overlying the Central Valley aquifer system.
      </CoreText>
      <CoreText color="description" paragraph>
        “County” – select specific counties
      </CoreText>
      <CoreText color="description" paragraph>
        “B118” – select groundwater sub-basins as defined by California
        Department of Water Resources’ Bulletin 118 series.
      </CoreText>
      <CoreText color="description" paragraph>
        “Subregions” – select groundwater regions as defined by C2VSIM and CVHM
        (21 water accounting regions)
      </CoreText>
      <CoreText color="description" paragraph>
        “Township” – select specific townships, typically a 36 square mile area.
      </CoreText>
    </Box>
  );
};

export default Step2Instructions;
