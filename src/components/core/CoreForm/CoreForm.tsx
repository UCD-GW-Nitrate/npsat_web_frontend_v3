import type { BoxProps } from '@mui/material';
import { Box, Stack } from '@mui/material';
import React, { Children } from 'react';
import type { FieldValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import { CoreFormElement } from './CoreFormElement';

export interface CoreFormField {
  label: string;
  position?: 'flex-start' | 'center' | 'flex-end';
  required?: boolean;
  errorMessage?: string;
}

export interface CoreFormProps extends BoxProps {
  fields?: CoreFormField[];
  onFormSubmit?: (data: FieldValues) => void;
}

export const CoreForm = ({
  children,
  fields = [],
  onFormSubmit,
  sx,
}: CoreFormProps) => {
  const methods = useForm();
  const insertLabelSpacing = fields.length > 0;

  const childrenArray = Children.toArray(children);
  for (let i = 0; i < childrenArray.length - fields.length; i += 1) {
    fields.push({ label: '' } as CoreFormField);
  }

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
        <Stack
          spacing={4}
          alignItems="flex-start"
          flexDirection="column"
          sx={{ width: '100%' }}
        >
          {childrenArray.map((child, index) => {
            return (
              <CoreFormElement
                key={fields[index]?.label ?? index}
                formField={fields[index]}
                insertLabelSpacing={insertLabelSpacing}
              >
                {child}
              </CoreFormElement>
            );
          })}
        </Stack>
      </Box>
    </FormProvider>
  );
};
