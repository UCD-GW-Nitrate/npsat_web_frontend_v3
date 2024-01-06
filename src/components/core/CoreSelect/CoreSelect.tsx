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
  formField?: boolean;
  onSelect?: (value: any) => void;
  defaultValue?: any;
}

export const CoreSelect = ({
  options,
  name,
  formField = false,
  onSelect,
  defaultValue,
  sx,
  ...rest
}: CoreSelectProps) => {
  const [inputValue, setInputValue] = React.useState(defaultValue ?? '');

  return (
    <Box sx={{ minWidth: 200, ...sx }} {...rest}>
      {formField ? (
        <Controller
          name={name ?? ''}
          defaultValue={inputValue}
          render={({ field: { onChange, ...restField } }) => (
            <Select
              onChange={(event) => {
                setInputValue(event.target.value);
                onChange(event.target.value);
                if (onSelect) {
                  onSelect(event.target.value);
                }
              }}
              displayEmpty
              size="small"
              sx={{ display: 'flex', flexGrow: 1 }}
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
      ) : (
        <Select
          onChange={(event) => {
            if (onSelect) {
              onSelect(event.target.value);
            }
          }}
          defaultValue={defaultValue ?? ''}
          displayEmpty
          size="small"
          sx={{ display: 'flex', flexGrow: 1 }}
          MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
        >
          {options.map(({ label, value }: CoreSelectOption) => (
            <MenuItem key={label} value={value ?? label}>
              {label}
            </MenuItem>
          ))}
        </Select>
      )}
    </Box>
  );
};
