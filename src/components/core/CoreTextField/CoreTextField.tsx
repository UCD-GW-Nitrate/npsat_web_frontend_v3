import type { FormControlProps } from '@mui/material';
import { FormControl, TextField } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreTextFieldProps extends CoreInputProps, FormControlProps {}

export const CoreTextField = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  sx,
  ...rest
}: CoreTextFieldProps) => (
  <CoreInput
    displayLabel={displayLabel}
    fieldLabel={fieldLabel}
    labelStyle={labelStyle}
  >
    <FormControl sx={{ minWidth: 200, ...sx }} {...rest}>
      <TextField size="small" />
    </FormControl>
  </CoreInput>
);
