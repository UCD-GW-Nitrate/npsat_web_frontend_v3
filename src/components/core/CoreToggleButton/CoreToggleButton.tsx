import type { ToggleButtonGroupProps } from '@mui/material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useState } from 'react';

import type { CoreInputProps } from '../CoreInput/CoreInput';
import { CoreInput } from '../CoreInput/CoreInput';

export interface CoreToggleOption {
  label: string;
  value?: string;
}

export interface CoreToggleButtonProps
  extends CoreInputProps,
    ToggleButtonGroupProps {
  options: CoreToggleOption[];
}

export const CoreToggleButton = ({
  options,
  fieldLabel,
  displayLabel,
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
    <CoreInput fieldLabel={fieldLabel} displayLabel={displayLabel}>
      <ToggleButtonGroup
        size="small"
        exclusive
        color="primary"
        {...rest}
        value={alignment}
        onChange={handleChange}
      >
        {options.map(({ label, value }: CoreToggleOption) => (
          <ToggleButton key={label} value={value ?? label}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </CoreInput>
  );
};
