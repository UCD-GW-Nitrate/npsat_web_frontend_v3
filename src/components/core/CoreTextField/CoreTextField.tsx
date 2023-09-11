import { TextField } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreTextFieldProps extends CoreInputProps {}

export const CoreTextField = ({ ...rest }: CoreTextFieldProps) => (
  <CoreInput {...rest}>
    <TextField size="small" />
  </CoreInput>
);
