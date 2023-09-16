import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React from 'react';

interface VBoxProps extends BoxProps {
  spacing?: number;
}

export const VBox = ({
  children,
  spacing,
  sx,
}: PropsWithChildren<VBoxProps>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing,
        alignItems: 'center',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
