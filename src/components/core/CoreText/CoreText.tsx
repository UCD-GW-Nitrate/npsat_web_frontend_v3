import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import React from 'react';

export interface CoreTextProps extends TypographyProps {}

export const CoreText = ({ children, ...rest }: CoreTextProps) => (
  <Typography {...rest}>{children}</Typography>
);
