import type { FormControlProps } from '@mui/material';
import { FormControl, TextField } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreTextFieldProps extends CoreInputProps, FormControlProps {
  value?: unknown;
  onTextChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
}

export const CoreTextField = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  value,
  onTextChange,
  sx,
  ...rest
}: CoreTextFieldProps) => (
  <CoreInput
    displayLabel={displayLabel}
    fieldLabel={fieldLabel}
    labelStyle={labelStyle}
    fullWidth={fullWidth}
  >
    <FormControl sx={{ minWidth: 200, ...sx }} {...rest}>
      <TextField size="small" onChange={onTextChange} value={value} />
    </FormControl>
  </CoreInput>
);
