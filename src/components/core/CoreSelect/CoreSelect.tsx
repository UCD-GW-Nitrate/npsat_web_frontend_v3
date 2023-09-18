import type { BoxProps, SelectChangeEvent } from '@mui/material';
import { Box, MenuItem, Select } from '@mui/material';
import React from 'react';

export interface CoreSelectOption {
  label: string;
  value?: any | undefined;
}

export interface CoreSelectProps extends BoxProps {
  options: CoreSelectOption[];
}

export const CoreSelect = ({ options, sx, ...rest }: CoreSelectProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setInputValue(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 200, ...sx }} {...rest}>
      <Select
        value={inputValue}
        onChange={handleChange}
        displayEmpty
        size="small"
        sx={{ width: 200, ...sx }}
      >
        {options.map(({ label, value }: CoreSelectOption) => (
          <MenuItem key={label} value={value ?? label}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
