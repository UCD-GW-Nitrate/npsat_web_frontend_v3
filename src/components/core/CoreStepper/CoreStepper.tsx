import type { StepperProps } from '@mui/material';
import { Step, StepButton, Stepper } from '@mui/material';
import type { MouseEventHandler } from 'react';
import React from 'react';

export interface CoreStepperProps extends StepperProps {
  steps: string[];
  handleStep: (step: number) => MouseEventHandler<HTMLButtonElement>;
  activeStep: number;
  completed: { [k: number]: boolean };
}

export const CoreStepper = ({
  steps,
  handleStep,
  activeStep,
  completed,
  ...rest
}: CoreStepperProps) => {
  return (
    <Stepper nonLinear activeStep={activeStep} {...rest}>
      {steps.map((label, index) => (
        <Step key={label} completed={completed[index]}>
          <StepButton color="inherit" onClick={handleStep(index)}>
            {label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};
