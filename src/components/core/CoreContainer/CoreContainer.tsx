import type { PaperProps } from '@mui/material';
import { Paper } from '@mui/material';
import React from 'react';

import { CONTAINER_COLOR } from '@/components/theme';

export interface CoreContainerProps extends PaperProps {}

export const CoreContainer = ({
  sx,
  elevation,
  ...rest
}: CoreContainerProps) => (
  <Paper
    elevation={elevation ?? 0}
    sx={{ backgroundColor: CONTAINER_COLOR, p: 2, ...sx }}
    {...rest}
  />
);
