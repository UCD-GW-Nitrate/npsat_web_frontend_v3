import type { SelectChangeEvent } from '@mui/material';
import { MenuItem, Select } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreSelectOption {
  label: string;
  value?: any | undefined;
}

export interface CoreSelectProps extends CoreInputProps {
  options: CoreSelectOption[];
}

export const CoreSelect = ({ options, sx, ...rest }: CoreSelectProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setInputValue(event.target.value as string);
  };

  return (
    <CoreInput sx={{ minWidth: 200, ...sx }} {...rest}>
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
    </CoreInput>
  );
};
