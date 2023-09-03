import type {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from '@mui/material';
import { TextField } from '@mui/material';
import React from 'react';

export interface CoreTextFieldProps
  extends Omit<
    FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
    'variant'
  > {}

export const CoreTextField = ({ ...rest }: CoreTextFieldProps) => (
  <TextField {...rest} />
);
