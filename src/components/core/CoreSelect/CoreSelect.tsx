import type { FormControlProps, SelectChangeEvent } from '@mui/material';
import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';

export interface CoreSelectOption {
  label: string;
  value?: any | undefined;
}

export interface CoreSelectProps extends FormControlProps {
  options: CoreSelectOption[];
}

export const CoreSelect = ({ options, sx, ...rest }: CoreSelectProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setInputValue(event.target.value as string);
  };

  return (
    <FormControl sx={{ minWidth: 200 }} {...rest}>
      <Select
        value={inputValue}
        onChange={handleChange}
        displayEmpty
        size="small"
      >
        {options.map(({ label, value }: CoreSelectOption) => (
          <MenuItem key={label} value={value ?? label}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
