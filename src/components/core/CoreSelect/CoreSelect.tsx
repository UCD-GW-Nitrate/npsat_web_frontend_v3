import type { BoxProps } from '@mui/material';
import { Box, MenuItem, Select } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

export interface CoreSelectOption {
  label: string;
  value?: any | undefined;
}

export interface CoreSelectProps extends BoxProps {
  options: CoreSelectOption[];
  name?: string;
}

export const CoreSelect = ({ options, name, sx, ...rest }: CoreSelectProps) => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Box sx={{ minWidth: 200, ...sx }} {...rest}>
      <Controller
        name={name ?? ''}
        defaultValue={inputValue}
        render={({ field: { onChange, ...restField } }) => (
          <Select
            onChange={(event) => {
              setInputValue(event.target.value);
              onChange(event.target.value);
            }}
            displayEmpty
            size="small"
            sx={{ minWidth: 200, ...sx }}
            MenuProps={{ disableScrollLock: true }}
            {...restField}
          >
            {options.map(({ label, value }: CoreSelectOption) => (
              <MenuItem key={label} value={value ?? label}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </Box>
  );
};
