import type { BoxProps } from '@mui/material';
import { Box, Switch } from '@mui/material';
import React from 'react';

export interface CoreSwitchProps extends BoxProps {
  onSwitchChange?: (value: boolean) => void;
}

export const CoreSwitch = ({ onSwitchChange, ...rest }: CoreSwitchProps) => {
  const handleChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (onSwitchChange) {
      onSwitchChange(checked);
    }
  };

  return (
    <Box {...rest}>
      <Switch onChange={handleChange} />
    </Box>
  );
};
