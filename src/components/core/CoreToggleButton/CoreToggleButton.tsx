import type { BoxProps } from '@mui/material';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

export interface CoreToggleOption {
  label: string;
  value?: string;
}

export interface CoreToggleButtonProps extends BoxProps {
  options: CoreToggleOption[];
  name?: string;
}

export const CoreToggleButton = ({
  options,
  name,
  ...rest
}: CoreToggleButtonProps) => {
  const [alignment, setAlignment] = useState('');

  return (
    <Box {...rest}>
      <Controller
        name={name ?? ''}
        defaultValue={alignment}
        render={({ field: { onChange, ...restField } }) => (
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={(
              _event: React.MouseEvent<HTMLElement>,
              newAlignment: string,
            ) => {
              onChange(newAlignment);
              setAlignment(newAlignment);
            }}
            size="small"
            {...restField}
          >
            {options.map(({ label, value }: CoreToggleOption) => (
              <ToggleButton key={label} value={value ?? label}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
      />
    </Box>
  );
};
