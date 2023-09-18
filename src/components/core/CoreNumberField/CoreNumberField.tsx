import type { FormControlProps } from '@mui/material';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreNumberFieldProps extends CoreInputProps, FormControlProps {
  units?: string;
  value?: unknown;
  onNumberChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
}

export const CoreNumberField = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  units,
  value,
  onNumberChange,
  sx,
  ...rest
}: CoreNumberFieldProps) => (
  <CoreInput
    displayLabel={displayLabel}
    fieldLabel={fieldLabel}
    labelStyle={labelStyle}
    fullWidth={fullWidth}
  >
    <FormControl sx={{ minWidth: 50, ...sx }} {...rest}>
      <TextField
        size="small"
        type="number"
        onChange={onNumberChange}
        value={value}
        InputProps={
          units
            ? {
                endAdornment: (
                  <InputAdornment position="end">{units}</InputAdornment>
                ),
              }
            : {}
        }
      />
    </FormControl>
  </CoreInput>
);
