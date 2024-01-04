import type { BoxProps } from '@mui/material';
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import React from 'react';

export interface CoreMultipleSelectOption {
  label: string;
  value?: any;
  group?: string;
}

export interface CoreMultipleSelectProps extends BoxProps {
  options: (CoreMultipleSelectOption | undefined)[];
  setFieldValue?: (fieldVal: (CoreMultipleSelectOption | undefined)[]) => void;
  fieldValue?: (CoreMultipleSelectOption | undefined)[];
  placeholder: string;
  group: boolean;
  isOptionEqualToValue?:
    | ((
        option: CoreMultipleSelectOption | undefined,
        value: CoreMultipleSelectOption | undefined,
      ) => boolean)
    | undefined;
}

export const CoreMultipleSelect = ({
  options,
  fieldValue,
  setFieldValue,
  placeholder,
  group,
  isOptionEqualToValue,
  sx,
  ...rest
}: CoreMultipleSelectProps) => {
  const [inputValue, setInputValue] = React.useState<
    (CoreMultipleSelectOption | undefined)[]
  >([]);

  return (
    <Box sx={{ minWidth: 200, ...sx }} {...rest}>
      <Autocomplete
        multiple
        options={options}
        size="small"
        value={fieldValue}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={
              (fieldValue ?? inputValue).length === 0 ? placeholder ?? '' : ''
            }
          />
        )}
        onChange={(
          _event: any,
          value: (CoreMultipleSelectOption | undefined)[],
        ) => {
          if (setFieldValue) {
            setFieldValue(value);
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
