import { Box, type BoxProps } from '@mui/material';
import type { DateView } from '@mui/x-date-pickers';
import React from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreDateField } from '../CoreDateField/CoreDateField';
import { CoreText } from '../CoreText/CoreText';

export interface CoreDateRangeFieldProps extends BoxProps {
  views?: DateView[];
  name?: string;
}

export const CoreDateRangeField = ({
  views = ['year'],
  name,
  ...rest
}: CoreDateRangeFieldProps) => (
  <Box {...rest}>
    <HBox spacing={2}>
      <CoreDateField views={views} name={`${name} start`} />
      <CoreText> &rarr; </CoreText>
      <CoreDateField views={views} name={`${name} end`} />
    </HBox>
  </Box>
);
