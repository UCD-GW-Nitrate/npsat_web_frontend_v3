import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React from 'react';

interface HBoxProps extends BoxProps {
  spacing: number;
}

export const HBox = ({
  children,
  spacing,
  sx,
}: PropsWithChildren<HBoxProps>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing,
        alignItems: 'center',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
