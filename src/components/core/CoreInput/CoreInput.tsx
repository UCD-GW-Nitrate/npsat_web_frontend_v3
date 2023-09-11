import type { FormControlProps } from '@mui/material';
import { FormControl } from '@mui/material';
import React from 'react';

import { HBox } from '@/components/HBox/Hbox';

import { CoreText } from '../CoreText/CoreText';

export interface CoreInputProps extends FormControlProps {
  fieldLabel?: string | null;
  displayLabel?: 'none' | 'left' | 'top' | null;
}

export const CoreInput = ({
  children,
  displayLabel,
  fieldLabel,
  ...rest
}: CoreInputProps) => (
  <FormControl {...rest}>
    {displayLabel === 'top' && (
      <>
        <CoreText>{fieldLabel ?? ''}</CoreText>
        {children}
      </>
    )}
    {displayLabel === 'left' && (
      <HBox spacing={2}>
        <CoreText>{fieldLabel ?? ''}</CoreText>
        {children}
      </HBox>
    )}
    {(displayLabel === 'none' || displayLabel === null) && <>{children}</>}
  </FormControl>
);
