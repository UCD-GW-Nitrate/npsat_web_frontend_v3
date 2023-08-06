import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import * as React from 'react';

import SideDrawer, { DRAWER_WIDTH, DrawerHeader } from './SideDrawer';
import TopBar from './TopBar';

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${DRAWER_WIDTH}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function Navbar({ children }: PropsWithChildren) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideDrawer open={open} />
      <TopBar toggleDrawer={toggleDrawer} />

      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
