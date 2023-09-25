import type { BoxProps } from '@mui/material';
import { Box, TextField } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

export interface CoreTextFieldProps extends BoxProps {
  multiline?: boolean;
  name?: string;
}

export const CoreTextField = ({
  sx,
  multiline,
  name,
  ...rest
}: CoreTextFieldProps) => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Box sx={{ minWidth: 200, ...sx }} {...rest}>
      <Controller
        name={name ?? ''}
        defaultValue={inputValue}
        render={({ field: { onChange, ...restField } }) => (
          <TextField
            sx={{ minWidth: 200, ...sx }}
            size="small"
            onChange={(event) => {
              onChange(event.target.value);
              setInputValue(event.target.value);
            }}
            multiline={multiline ?? false}
            rows={multiline ? 4 : 1}
            {...restField}
          />
        )}
      />
    </Box>
  );
};
