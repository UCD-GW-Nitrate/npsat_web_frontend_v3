import { StandardText } from '@/components/custom/StandardText/StandardText';

const Step1Instructions = () => {
  return (
    <div style={{ marginInline: 20 }}>
      <StandardText variant="h4" color="description">
        Instructions
      </StandardText>
      <StandardText variant="h5" color="description">
        Select Scenarios:
      </StandardText>
      <StandardText color="description">
        Hover on the info circle to see detailed explanation about the scenario.
        Scenario chosen will determine the number of wells and the type and
        number of crops in subsequent menus.
      </StandardText>
      <StandardText variant="h5" color="description">
        Simulation ending year:
      </StandardText>
      <StandardText color="description">
        Enter the last year of the scenario simulation run. By default, this
        will be the year 2100. It can be no later than the year 2500.
      </StandardText>
      <StandardText variant="h5" color="description">
        Transition period:
      </StandardText>
      <StandardText color="description">
        This is the beginning year and final year of the transition from the
        current Business-As-Usual (BAU) to the new nitrate loadig scenario.
        Typically would start within the next five years and end in a year about
        15 to 25 years from now.
      </StandardText>
      <StandardText variant="h5" color="description">
        Unsaturated zone effective water content:
      </StandardText>
      <StandardText color="description">
        This refers to the effective water content for the unsaturated zone. The
        smaller the effective water content, the faster the travel time through
        the unsaturated zone. When choosing &quot;0%&quot;, the travel time
        through the unsaturated zone is ignored and all nitrate loading is
        instantaneously applied to the water table. A recommended range for the
        effective water content is 5% - 10%.
      </StandardText>
      <StandardText variant="h5" color="description">
        BAU:
      </StandardText>
      <StandardText color="description">
        &quot;Business-As-Usual&quot; refers to the continuation of past and
        current practices well into the future, without notable changes in
        nitrate leaching.
      </StandardText>
      <StandardText variant="h5" color="description">
        Other selections:
      </StandardText>
      <StandardText color="description">Under development</StandardText>
    </div>
  );
};

export default Step1Instructions;
