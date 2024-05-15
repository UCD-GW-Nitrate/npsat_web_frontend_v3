import { StandardText } from '@/components/custom/StandardText/StandardText';

const Step2Instructions = () => {
  return (
    <div style={{ marginInline: 20 }}>
      <StandardText variant="h4" color="description">
        Instructions
      </StandardText>
      <StandardText variant="h5" color="description">
        Select a region or regions:
      </StandardText>
      <StandardText color="description">
        Choose the type of regions.
      </StandardText>
      <StandardText color="description">
        Choose region(s) on the map or in the dropdown list.
      </StandardText>
      <StandardText color="description">
        Click Next to continue selecting other scenario parameters.
      </StandardText>
      <StandardText color="description">
        Note: You can only select one type of region (e.g., “B118 Basin”), but
        within that type, any number regions (1 to all) can be selected. The
        number of wells in the selected region(s) is displayed on top of the
        map. The scenario simulations (including the BAU simulation) will
        evaluate nitrate concentrations at these wells and aggregate those into
        statistical results.
      </StandardText>
      <StandardText color="description">
        The “Advanced filter” allows for selection of wells within a specific
        minimum and maximum well depth interval, and/or consider streamlines to
        well screens within a specific minimum and maximum screen depth
        interval. This may affect the number of wells selected for the
        simulation, as shown above the map.
      </StandardText>
      <StandardText color="description">
        “Basin”: select the Sacramento Valley, San Joaquin Valley, and Tulare
        Lake Basin (also known as the Southern San Joaquin Valley) watersheds
        overlying the Central Valley aquifer system.
      </StandardText>
      <StandardText color="description">
        “County” – select specific counties
      </StandardText>
      <StandardText color="description">
        “B118” – select groundwater sub-basins as defined by California
        Department of Water Resources’ Bulletin 118 series.
      </StandardText>
      <StandardText color="description">
        “Subregions” – select groundwater regions as defined by C2VSIM and CVHM
        (21 water accounting regions)
      </StandardText>
      <StandardText color="description">
        “Township” – select specific townships, typically a 36 square mile area.
      </StandardText>
    </div>
  );
};

export default Step2Instructions;
