import { ThemeProvider } from '@emotion/react';
import type { TypographyProps } from '@mui/material';
import { createTheme, Typography } from '@mui/material';
import React from 'react';

export interface CoreTextProps extends TypographyProps {
  variant?: 'h1' | 'body1';
}

export const theme = createTheme({
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 600,
    },
  },
});

export const CoreText = ({ ...rest }: CoreTextProps) => (
  <ThemeProvider theme={theme}>
    <Typography {...rest} />
  </ThemeProvider>
);
