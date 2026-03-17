import { Image } from 'antd';

import { StandardText } from '@/components/custom/StandardText/StandardText';

const Step3Instructions = () => {
  return (
    <div style={{ marginInline: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
      <StandardText variant="h5" color="description">
        All other crops:
      </StandardText>
      <StandardText color="description">
        The type “All other crops” refers to all land use types that have NOT
        been selected explicitly here. This allows for easily changing the
        nitrate loading from all land use types that are not specifically
        defined here by the user.
      </StandardText>
      <StandardText variant="h5" color="description">
        More information:
      </StandardText>
      <StandardText color="description">
        This loading scenario tool can be used for a number of applications. For
        example, to examine the contributions to nitrate in wells from specific
        crops, either by setting all other crops to zero in the future, or by
        setting just the crop in question to zero. One application is to
        identify what reductions in loading needed to achieve water quality
        objectives, through a combination of reductions.
      </StandardText>
      <div style={{marginTop: 10}}>
      <StandardText color="description">
        Achieving nitrate leaching reductions in agricultural landscapes
        requires extensive training, outreach, education of growers and farm
        staff, technical innovations, and capital and capacity building
        investments by landowners/growers. The graphic below (and the
        publication from which it is taken) may provide some very general
        guidance on the economic cost to achieve certain load reductions (Figure
        3 in <a href="http://dx.doi.org/10.1061/(ASCE)WR.1943-5452.0000268" target="_blank">Medellin-Azuara et al., 2012</a>; <a href="https://ucanr.edu/sites/default/files/2013-07/169932.pdf" target="_blank">pdf-file</a> for personal use);
      </StandardText>
      </div>
      <div style={{ alignSelf: 'center', marginTop: 30}}>
        <Image
          src="/images/figure-3.png"
          width={500}
          alt="NPSAT logo"
        />
      </div>
    </div>
  );
};

export default Step3Instructions;
