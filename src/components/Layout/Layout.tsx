import { Box } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import React from 'react';

import Navbar from '../Navbar';

export const theme = createTheme({
  palette: {
    background: {
      default: '#F1F2F5',
    },
    primary: {
      main: '#022851',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
  },
});

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: theme.palette.background.default },
        }}
      />
      <Navbar>
        <Box sx={{ mx: 4 }}>{children}</Box>
      </Navbar>
    </ThemeProvider>
  );
};

export default Layout;
