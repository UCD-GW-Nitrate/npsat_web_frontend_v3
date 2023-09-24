import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { DateView } from '@mui/x-date-pickers';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

export interface CoreDateFieldProps extends BoxProps {
  views?: DateView[];
  name?: string;
}

export const CoreDateField = ({
  sx,
  views,
  name,
  ...rest
}: CoreDateFieldProps) => {
  const [value, setValue] = useState<dayjs.Dayjs | null>(null);

  return (
    <Box sx={{ width: 200, ...sx }} {...rest}>
      <Controller
        name={name ?? ''}
        render={({ field: { onChange, ...restField } }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={views}
              onChange={(event) => {
                onChange(event?.toDate());
                setValue(event ?? dayjs());
              }}
              slotProps={{
                textField: {
                  size: 'small',
                },
              }}
              {...restField}
              value={value}
            />
          </LocalizationProvider>
        )}
      />
    </Box>
  );
};
