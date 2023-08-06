import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import React from 'react';

import Navbar from './Navbar';

const theme = createTheme({
  palette: {
    background: {
      default: '#F1F2F5',
    },
  },
});

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: { backgroundColor: '#F1F2F5' },
        }}
      />
      <Navbar>{children}</Navbar>
    </ThemeProvider>
  );
};

export default Layout;
