import type { DatePickerProps } from '@mui/x-date-pickers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

export interface CoreDateFieldProps extends DatePickerProps<Date> {}

export const CoreDateField = ({ ...rest }: CoreDateFieldProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker {...rest} />
  </LocalizationProvider>
);
