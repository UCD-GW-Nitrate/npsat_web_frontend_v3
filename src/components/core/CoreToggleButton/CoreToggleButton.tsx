import type { BoxProps } from '@mui/material';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useState } from 'react';

export interface CoreToggleOption {
  label: string;
  value?: string;
}

export interface CoreToggleButtonProps extends BoxProps {
  options: CoreToggleOption[];
}

export const CoreToggleButton = ({
  options,
  ...rest
}: CoreToggleButtonProps) => {
  const [alignment, setAlignment] = useState('');

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Box {...rest}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        size="small"
      >
        {options.map(({ label, value }: CoreToggleOption) => (
          <ToggleButton key={label} value={value ?? label}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};
