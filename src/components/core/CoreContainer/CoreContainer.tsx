import type { PaperProps } from '@mui/material';
import { Box, Divider, Paper } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { CONTAINER_COLOR } from '@/components/theme';

import { CoreText } from '../CoreText/CoreText';

export interface CoreContainerProps extends PaperProps {
  title?: string;
}

export const CoreContainer = ({
  sx,
  elevation,
  title,
  children,
  ...rest
}: PropsWithChildren<CoreContainerProps>) => (
  <Paper
    elevation={elevation ?? 0}
    sx={{ backgroundColor: CONTAINER_COLOR }}
    {...rest}
  >
    {title && (
      <>
        <CoreText variant="h3" sx={{ ml: 3, my: 2 }}>
          {title}
        </CoreText>
        <Divider />
      </>
    )}
    <Box sx={{ p: 3, ...sx }}>{children}</Box>
  </Paper>
);
