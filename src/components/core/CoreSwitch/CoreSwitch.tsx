import type { BoxProps } from '@mui/material';
import { Box, Switch } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';

export interface CoreSwitchProps extends BoxProps {
  onSwitchChange?: (value: boolean) => void;
  name?: string;
}

export const CoreSwitch = ({
  onSwitchChange,
  name,
  ...rest
}: CoreSwitchProps) => {
  return (
    <Box {...rest}>
      <Controller
        name={name ?? ''}
        defaultValue={false}
        render={({ field: { onChange } }) => (
          <Switch
            onChange={(
              _event: React.ChangeEvent<HTMLInputElement>,
              checked: boolean,
            ) => {
              if (onSwitchChange) {
                onSwitchChange(checked);
              }
              onChange(checked);
            }}
          />
        )}
      />
    </Box>
  );
};
