import type { BoxProps } from '@mui/material';
import type { DateView } from '@mui/x-date-pickers';
import React from 'react';

import { HBox } from '@/components/HBox/Hbox';

import { CoreDateField } from '../CoreDateField/CoreDateField';
import { CoreText } from '../CoreText/CoreText';

export interface CoreDateRangeFieldProps extends BoxProps {
  views?: DateView[];
}

export const CoreDateRangeField = ({
  views = ['year'],
  ...rest
}: CoreDateRangeFieldProps) => (
  <HBox spacing={2} {...rest}>
    <CoreDateField fullWidth={false} views={views} />
    <CoreText> &mdash; </CoreText>
    <CoreDateField fullWidth={false} views={views} />
  </HBox>
);
