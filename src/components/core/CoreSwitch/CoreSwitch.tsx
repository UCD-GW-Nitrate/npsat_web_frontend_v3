import type { BoxProps } from '@mui/material';
import { Box, Switch } from '@mui/material';
import React from 'react';

export interface CoreSwitchProps extends BoxProps {}

export const CoreSwitch = ({ ...rest }: CoreSwitchProps) => (
  <Box {...rest}>
    <Switch />
  </Box>
);
