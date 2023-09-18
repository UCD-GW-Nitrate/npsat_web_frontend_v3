import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import React from 'react';

export interface CoreTextProps extends TypographyProps {
  variant?: 'h1' | 'body1';
}

export const CoreText = ({ ...rest }: CoreTextProps) => (
  <Typography {...rest} />
);
