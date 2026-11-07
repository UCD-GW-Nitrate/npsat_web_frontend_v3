import { StandardText } from '@/components/custom/StandardText/StandardText';

const StepDenitInstructions = () => {
  return (
    <div style={{ marginInline: 20 }}>
      <StandardText variant="h4" color="description">
        Instructions
      </StandardText>
      <StandardText variant="h5" color="description">
        Apply denitrification (optional):
      </StandardText>
      <StandardText color="description">
        Turn on “Apply denitrification” to reduce nitrate at wells located in
        areas where denitrification is expected. Leave it off to run the
        scenario without denitrification.
      </StandardText>
      <StandardText color="description">
        Choose a denitrification map. The map shows its values from 0 to 1, with
        the regions selected in the previous step outlined in red.
      </StandardText>
      <StandardText variant="h5" color="description">
        Threshold and fraction removed:
      </StandardText>
      <StandardText color="description">
        “Threshold” – wells where the map value is above the threshold are
        treated as denitrifying. Areas above the threshold are highlighted on
        the map once you release the slider.
      </StandardText>
      <StandardText color="description">
        “Fraction removed” – the share of nitrate removed at those wells. For
        example, 0.7 reduces their nitrate concentration by 70%.
      </StandardText>
      <StandardText color="description">
        Click Next to continue selecting other scenario parameters.
      </StandardText>
    </div>
  );
};

export default StepDenitInstructions;
