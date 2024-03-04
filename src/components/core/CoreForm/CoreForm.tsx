import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

export interface CoreFormField {
  label: string;
  position?: 'flex-start' | 'center' | 'flex-end';
  required?: boolean;
  errorMessage?: string;
}

export interface CoreFormProps extends BoxProps {
  onFormSubmit?: (data: FieldValues) => void;
}

export const CoreForm = ({ children, onFormSubmit, sx }: CoreFormProps) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={methods.handleSubmit((data) => {
          if (onFormSubmit) {
            onFormSubmit(data);
          }
        })}
        sx={{ mt: 1, ...sx }}
      >
        {children}
      </Box>
    </FormProvider>
  );
};
