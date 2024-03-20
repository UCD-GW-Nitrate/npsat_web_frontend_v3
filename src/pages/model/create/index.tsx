import { useTheme } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { CoreContainer } from '@/components/core/CoreContainer/CoreContainer';
import { CoreStepper } from '@/components/core/CoreStepper/CoreStepper';
import Layout from '@/components/custom/Layout/Layout';
import { useRunModelMutation } from '@/store';
import { selectCurrentModel } from '@/store/slices/modelSlice';

import Step1 from '../steps/Step1';
import Step2 from '../steps/Step2';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';

export interface Step {
  onPrev: () => void;
  onNext: () => void;
}

const steps = [
  'Select Settings',
  'Select Regions',
  'Select Crops',
  'Enter Scenario Meta',
  'Results',
];

const CreateModelPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const [runModel, { data: modelData, isLoading: modelDataLoading }] =
    useRunModelMutation();
  const model = useSelector(selectCurrentModel);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((_step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  useEffect(() => {
    if (model.name) {
      console.log('model entered is', model);
      runModel(model);
    }
  }, [model]);

  useEffect(() => {
    console.log('model data loading is', modelDataLoading);
    console.log('model returned data is', modelData);
  }, [modelDataLoading]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Create Scenario - NPSAT</title>
        <meta name="description" content="Create Scenario - NPSAT" />
      </Helmet>
      <Layout>
        <CoreContainer
          sx={{
            backgroundColor: theme.palette.secondary.main,
            py: 5,
          }}
        >
          <CoreStepper
            steps={steps}
            handleStep={handleStep}
            completed={completed}
            activeStep={activeStep}
          />
          {activeStep === 0 && (
            <Step1 onPrev={handleBack} onNext={handleComplete} />
          )}
          {activeStep === 1 && (
            <Step2 onPrev={handleBack} onNext={handleComplete} />
          )}
          {activeStep === 2 && (
            <Step3 onPrev={handleBack} onNext={handleComplete} />
          )}
          {activeStep === 3 && (
            <Step4 onPrev={handleBack} onNext={handleComplete} />
          )}
          {activeStep === 4 && !modelDataLoading && modelData?.id && (
            <Step5 ids={modelData?.id} />
          )}
        </CoreContainer>
      </Layout>
    </HelmetProvider>
  );
};

export default CreateModelPage;
