import type { SelectChangeEvent } from '@mui/material';
import { Box, Chip, FormControl, MenuItem, Select } from '@mui/material';
import React from 'react';

import type {
  CoreSelectOption,
  CoreSelectProps,
} from '../CoreSelect/CoreSelect';

export interface CoreMultipleSelectProps extends CoreSelectProps {}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const CoreMultipleSelect = ({
  options,
  ...rest
}: CoreMultipleSelectProps) => {
  const [inputValue, setInputValue] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const {
      target: { value },
    } = event;
    setInputValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : (value as string[]),
    );
  };

  return (
    <FormControl sx={{ minWidth: 200 }} {...rest}>
      <Select
        size="small"
        value={inputValue}
        onChange={handleChange}
        displayEmpty
        multiple
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as any[]).map((value) => (
              <Chip key={value} label={value} size="small" />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
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
