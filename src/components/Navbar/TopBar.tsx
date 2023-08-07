import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import Logo from './Logo';
import ProfileButton from './ProfileButton';
import SearchBar from './SearchBar';

interface TopBarProps {
  toggleDrawer: () => void;
}

const TopBar = ({ toggleDrawer }: TopBarProps) => {
  const theme = useTheme();

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Logo />
        <Box sx={{ margin: 'auto' }}>
          <SearchBar />
        </Box>
        <ProfileButton />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
