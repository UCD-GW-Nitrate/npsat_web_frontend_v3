import { Box, type BoxProps } from '@mui/material';
import type { DateView } from '@mui/x-date-pickers';
import React from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreDateField } from '../CoreDateField/CoreDateField';
import { CoreText } from '../CoreText/CoreText';

export interface CoreDateRangeFieldProps extends BoxProps {
  views?: DateView[];
}

export const CoreDateRangeField = ({
  views = ['year'],
  ...rest
}: CoreDateRangeFieldProps) => (
  <Box {...rest}>
    <HBox spacing={2}>
      <CoreDateField views={views} />
      <CoreText> &rarr; </CoreText>
      <CoreDateField views={views} />
    </HBox>
  </Box>
);
