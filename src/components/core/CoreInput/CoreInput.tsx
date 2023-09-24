import type { BoxProps, SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

import { HBox } from '@/components/custom/HBox/Hbox';
import { VBox } from '@/components/custom/VBox/VBox';

import { CoreText } from '../CoreText/CoreText';

export interface CoreInputProps {
  fieldLabel?: string;
  displayLabel?: 'none' | 'left' | 'top';
  labelStyle?: SxProps<Theme>;
  fullWidth?: boolean;
}

export interface CoreInputPropsComponent extends CoreInputProps, BoxProps {}

export const CoreInput = ({
  children,
  displayLabel,
  fieldLabel,
  labelStyle,
  sx,
  fullWidth = true,
}: CoreInputPropsComponent) => (
  <Box sx={fullWidth ? { width: '100%', ...sx } : {}}>
    {displayLabel === 'top' && (
      <>
        <VBox sx={{ alignItems: 'flex-end', ...labelStyle }}>
          <CoreText>{fieldLabel ?? ''}</CoreText>
        </VBox>
        {children}
      </>
    )}
    {displayLabel === 'left' && (
      <HBox spacing={2}>
        <VBox sx={{ display: 'flex', alignItems: 'flex-end', ...labelStyle }}>
          <CoreText>{fieldLabel ?? ''}</CoreText>
        </VBox>
        {children}
      </HBox>
    )}
    {(displayLabel === 'none' || displayLabel === undefined) && <>{children}</>}
  </Box>
);
