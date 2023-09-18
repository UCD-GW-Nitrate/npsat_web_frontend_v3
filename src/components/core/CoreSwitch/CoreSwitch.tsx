import type { SwitchProps } from '@mui/material';
import { Switch } from '@mui/material';
import React from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreSwitchProps extends CoreInputProps, SwitchProps {}

export const CoreSwitch = ({
  displayLabel,
  fieldLabel,
  labelStyle,
  fullWidth,
  ...rest
}: CoreSwitchProps) => (
  <CoreInput
    displayLabel={displayLabel}
    fieldLabel={fieldLabel}
    labelStyle={labelStyle}
    fullWidth={fullWidth}
  >
    <Switch {...rest} />
  </CoreInput>
);
