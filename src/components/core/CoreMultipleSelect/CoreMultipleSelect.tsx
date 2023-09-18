import type { BoxProps } from '@mui/material';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import React from 'react';

export interface CoreMultipleSelectOption {
  label: string;
  value?: any;
  group?: string;
}

export interface CoreMultipleSelectProps extends BoxProps {
  options: CoreMultipleSelectOption[];
  setValue?: (
    value: React.SetStateAction<(CoreMultipleSelectOption | undefined)[]>,
  ) => void;
  placeholder: string;
  group: boolean;
}

export const CoreMultipleSelect = ({
  options,
  setValue,
  placeholder,
  group,
  sx,
  ...rest
}: CoreMultipleSelectProps) => {
  const [inputValue, setInputValue] = React.useState<
    (CoreMultipleSelectOption | undefined)[]
  >([]);

  return (
    <Box sx={{ width: 200, ...sx }} {...rest}>
      <Autocomplete
        multiple
        options={options}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={inputValue.length === 0 ? placeholder ?? '' : ''}
          />
        )}
        onChange={(
          _event: any,
          value: (CoreMultipleSelectOption | undefined)[],
        ) => {
          if (setValue) {
            setValue(value);
          }
          setInputValue(value);
        }}
        renderTags={(
          value: (CoreMultipleSelectOption | undefined)[],
          getTagProps,
        ) =>
          value.map(
            (option: CoreMultipleSelectOption | undefined, index: number) => (
              <Chip
                color="primary"
                size="small"
                label={option?.label}
                {...getTagProps({ index })}
                key={option?.label}
              />
            ),
          )
        }
        {...(group ? { groupBy: (option) => option?.group ?? '' } : {})}
      />
    </Box>
  );
};
