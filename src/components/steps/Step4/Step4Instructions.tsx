import { StandardText } from '@/components/custom/StandardText/StandardText';

const Step4Instructions = () => {
  return (
    <div style={{ marginInline: 20 }}>
      <StandardText variant="h4" color="description">
        Instructions
      </StandardText>
      <StandardText variant="h5" color="description">
        Scenario name
      </StandardText>
      <StandardText color="description">
        Enter a scenario name, limited 255 characters.
      </StandardText>
      <StandardText variant="h5" color="description">
        Scenario description
      </StandardText>
      <StandardText color="description">
        Enter scenario optional description, no characters limit.
      </StandardText>
      <StandardText color="description">
        Once submitted, your customized scenario will be created and run.
        Scenario will be running for a few seconds to up to a minute (based on
        number of wells selected) to generate results.
      </StandardText>
    </div>
  );
};

export default Step4Instructions;
