import type { BoxProps } from '@mui/material';
import type { DateView } from '@mui/x-date-pickers';
import React from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';

import { CoreDateField } from '../CoreDateField/CoreDateField';
import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';
import { CoreText } from '../CoreText/CoreText';

export interface CoreDateRangeFieldProps extends BoxProps, CoreInputProps {
  views?: DateView[];
}

export const CoreDateRangeField = ({
  views = ['year'],
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  ...rest
}: CoreDateRangeFieldProps) => (
  <CoreInput
    displayLabel={displayLabel}
    fieldLabel={fieldLabel}
    labelStyle={labelStyle}
    fullWidth={fullWidth}
  >
    <HBox spacing={2} {...rest}>
      <CoreDateField fullWidth={false} views={views} />
      <CoreText> &rarr; </CoreText>
      <CoreDateField fullWidth={false} views={views} />
    </HBox>
  </CoreInput>
);
