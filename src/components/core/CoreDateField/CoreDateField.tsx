import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { DateView } from '@mui/x-date-pickers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react';

export interface CoreDateFieldProps extends BoxProps {
  views?: DateView[];
}

export const CoreDateField = ({ sx, views, ...rest }: CoreDateFieldProps) => {
  return (
    <Box sx={{ width: 200, ...sx }} {...rest}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={views}
          slotProps={{
            textField: {
              size: 'small',
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};
