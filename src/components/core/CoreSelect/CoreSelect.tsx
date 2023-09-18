import type { FormControlProps, SelectChangeEvent } from '@mui/material';
import { FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreSelectOption {
  label: string;
  value?: any | undefined;
}

export interface CoreSelectProps extends CoreInputProps, FormControlProps {
  options: CoreSelectOption[];
}

export const CoreSelect = ({
  options,
  fieldLabel,
  displayLabel,
  labelStyle,
  fullWidth,
  sx,
  ...rest
}: CoreSelectProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    setInputValue(event.target.value as string);
  };

  return (
    <CoreInput
      displayLabel={displayLabel}
      fieldLabel={fieldLabel}
      labelStyle={labelStyle}
      fullWidth={fullWidth}
    >
      <FormControl sx={{ margin: 'auto', ...sx }} {...rest}>
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
    </CoreInput>
  );
};
