import type { FormControlProps } from '@mui/material';
import { Box, FormControl } from '@mui/material';
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
  sx,
  ...rest
}: CoreInputProps) => (
  <Box sx={{ ...sx }}>
    {displayLabel === 'top' && (
      <>
        <CoreText>{fieldLabel ?? ''}</CoreText>
        <FormControl sx={{ width: '60vw' }} {...rest}>
          {children}
        </FormControl>
      </>
    )}
    {displayLabel === 'left' && (
      <HBox spacing={2}>
        <CoreText>{fieldLabel ?? ''}</CoreText>
        <FormControl sx={{ width: '60vw' }} {...rest}>
          {children}
        </FormControl>
      </HBox>
    )}
    {(displayLabel === 'none' || displayLabel === null) && (
      <FormControl sx={{ width: '60vw' }} {...rest}>
        {children}
      </FormControl>
    )}
  </Box>
);
