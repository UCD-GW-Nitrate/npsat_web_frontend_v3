import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { HBox } from '@/components/HBox/Hbox';

import { CoreText } from '../CoreText/CoreText';

export interface CoreInputProps {
  fieldLabel?: string;
  displayLabel?: 'none' | 'left' | 'top';
}

export interface CoreInputPropsComponent
  extends CoreInputProps,
    PropsWithChildren {}

export const CoreInput = ({
  children,
  displayLabel,
  fieldLabel,
}: CoreInputPropsComponent) => (
  <Box>
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
    {(displayLabel === 'none' || displayLabel === undefined) && <>{children}</>}
  </Box>
);
