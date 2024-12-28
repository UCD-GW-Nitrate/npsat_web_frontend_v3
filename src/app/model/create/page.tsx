'use client';

import { Steps } from 'antd';
import * as React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useDispatch } from 'react-redux';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import { InfoContainer } from '@/components/custom/InfoContainer/InfoContainer';
import {
  useFetchB118BasinQuery,
  useFetchBasinQuery,
  useFetchCentralValleyQuery,
  useFetchCountyQuery,
  useFetchSubregionsQuery,
  useFetchTownshipQuery,
  useRunModelMutation,
} from '@/store';
import { clearModel } from '@/store/slices/modelSlice';
import type { FormModel } from '@/types/model/FormModel';

import Step1 from '../../../components/steps/Step1/Step1';
import Step2 from '../../../components/steps/Step2/Step2';
import Step3 from '../../../components/steps/Step3/Step3';
import Step4 from '../../../components/steps/Step4/Step4';
import Step5 from '../../../components/steps/Step5/Step5';

const { Step } = Steps;

const steps = [
  'Select Settings',
  'Select Regions',
  'Select Crops',
  'Enter Scenario Meta',
  'Results',
];

const CreateModelPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const dispatch = useDispatch();

  const [runModel, { data: modelData, isLoading: modelDataLoading }] =
    useRunModelMutation();

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

  const handleCompleteStep = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleCompleteModel = (newModel: FormModel) => {
    runModel(newModel);
    handleCompleteStep();
    dispatch(clearModel());
  };

  // fetch all map beforehand
  useFetchB118BasinQuery();
  useFetchBasinQuery();
  useFetchCentralValleyQuery();
  useFetchCountyQuery();
  useFetchSubregionsQuery();
  useFetchTownshipQuery();

  return (
    <AppLayout>
      <HelmetProvider>
        <Helmet>
          <title>Create Scenario - NPSAT</title>
          <meta name="description" content="Create Scenario - NPSAT" />
        </Helmet>
        <InfoContainer>
          <Steps
            current={activeStep}
            onChange={handleStep}
            style={{ marginBottom: 20 }}
          >
            <Step title={steps[0]} disabled={activeStep >= 4} />
            <Step
              title={steps[1]}
              disabled={activeStep < 1 || activeStep >= 4}
            />
            <Step
              title={steps[2]}
              disabled={activeStep < 2 || activeStep >= 4}
            />
            <Step
              title={steps[3]}
              disabled={activeStep < 3 || activeStep >= 4}
            />
            <Step title={steps[4]} disabled />
          </Steps>

          {activeStep === 0 && (
            <Step1 onPrev={handleBack} onNext={handleCompleteStep} />
          )}
          {activeStep === 1 && (
            <Step2 onPrev={handleBack} onNext={handleCompleteStep} />
          )}
          {activeStep === 2 && (
            <Step3 onPrev={handleBack} onNext={handleCompleteStep} />
          )}
          {activeStep === 3 && (
            <Step4
              onPrev={handleBack}
              onNext={handleCompleteStep}
              onComplete={handleCompleteModel}
            />
          )}
          {activeStep === 4 && !modelDataLoading && modelData?.id && (
            <Step5 ids={modelData?.id} />
          )}
        </InfoContainer>
      </HelmetProvider>
    </AppLayout>
  );
};

export default CreateModelPage;
