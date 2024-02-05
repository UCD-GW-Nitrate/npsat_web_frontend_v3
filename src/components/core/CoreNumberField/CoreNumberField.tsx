import type { BoxProps } from '@mui/material';
import { Box, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

export interface CoreNumberFieldProps extends BoxProps {
  units?: string;
  name?: string;
  value?: number;
  defaultValue?: number;
  onNumberChange?: (value: number) => void;
}

export const CoreNumberField = ({
  units,
  name,
  sx,
  value,
  defaultValue,
  onNumberChange,
  ...rest
}: CoreNumberFieldProps) => {
  const [numValue, setNumValue] = useState<number | undefined>(defaultValue);

  return (
    <Box sx={{ minWidth: 50, ...sx }} {...rest}>
      <Controller
        name={name ?? ''}
        defaultValue={value ?? numValue}
        render={({ field: { onChange } }) => (
          <TextField
            size="small"
            type="number"
            onChange={(event) => {
              onChange(Number(event.target.value));
              setNumValue(Number(event.target.value));
              if (onNumberChange) {
                onNumberChange(Number(event.target.value ?? 0));
              }
            }}
            InputProps={
              units
                ? {
                    endAdornment: (
                      <InputAdornment position="end">{units}</InputAdornment>
                    ),
                  }
                : {}
            }
            value={value ?? numValue}
          />
        )}
      />
    </Box>
  );
};
