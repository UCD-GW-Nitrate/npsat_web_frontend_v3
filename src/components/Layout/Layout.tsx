import { Box } from '@mui/material';
import type { PropsWithChildren } from 'react';
import React from 'react';

import Navbar from '../Navbar';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Navbar>
      <Box sx={{ mx: 4 }}>{children}</Box>
    </Navbar>
  );
};

export default Layout;
