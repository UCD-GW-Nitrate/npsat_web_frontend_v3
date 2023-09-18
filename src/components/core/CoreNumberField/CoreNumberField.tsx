import type { BoxProps } from '@mui/material';
import { Box, InputAdornment, TextField } from '@mui/material';
import React from 'react';

export interface CoreNumberFieldProps extends BoxProps {
  units?: string;
  value?: unknown;
  onNumberChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
}

export const CoreNumberField = ({
  units,
  value,
  onNumberChange,
  sx,
  ...rest
}: CoreNumberFieldProps) => (
  <Box sx={{ minWidth: 50, ...sx }} {...rest}>
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
  </Box>
);
