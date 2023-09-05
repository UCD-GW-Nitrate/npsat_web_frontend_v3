import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React, { Children } from 'react';

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
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      {Children.map(children, (child, index) => (
        <Box sx={{ mr: index !== Children.count(children) - 1 ? spacing : 0 }}>
          {child}
        </Box>
      ))}
    </Box>
  );
};
