import type { BoxProps } from '@mui/material';
import { Box, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

export interface CoreNumberFieldProps extends BoxProps {
  units?: string;
  name?: string;
  value?: number;
  onNumberChange?: (value: number) => void;
}

export const CoreNumberField = ({
  units,
  name,
  sx,
  value,
  onNumberChange,
  ...rest
}: CoreNumberFieldProps) => {
  const [numValue, setNumValue] = useState<number | null>(null);

  return (
    <Box sx={{ minWidth: 50, ...sx }} {...rest}>
      <Controller
        name={name ?? ''}
        defaultValue={value ?? numValue}
        render={({ field: { onChange, ...restField } }) => (
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
            {...restField}
          />
        )}
      />
    </Box>
  );
};
