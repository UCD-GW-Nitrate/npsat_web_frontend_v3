import { FormControl } from '@mui/material';
import type { DatePickerProps } from '@mui/x-date-pickers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreDateFieldProps
  extends CoreInputProps,
    DatePickerProps<Date> {}

export const CoreDateField = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  sx,
  ...rest
}: CoreDateFieldProps) => {
  return (
    <CoreInput
      displayLabel={displayLabel}
      fieldLabel={fieldLabel}
      labelStyle={labelStyle}
      fullWidth={fullWidth}
    >
      <FormControl sx={{ minWidth: 200, ...sx }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: {
                size: 'small',
              },
            }}
            {...rest}
          />
        </LocalizationProvider>
      </FormControl>
    </CoreInput>
  );
};
