import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React from 'react';

export interface HBoxProps extends BoxProps {
  spacing?: number;
}

export const HBox = ({
  children,
  spacing,
  sx,
}: PropsWithChildren<HBoxProps>) => {
  return (
    <Box
      sx={{
        justifyContent: spacing === undefined ? 'space-between' : 'flex-start',
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing ?? 0,
        alignItems: 'center',
        flexDirection: 'row',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
