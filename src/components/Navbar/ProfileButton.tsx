import { alpha, Avatar, Box, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

import { CoreIconButton } from '../core/CoreIconButton/CoreIconButton';
import { CoreMenu } from '../core/CoreMenu/CoreMenu';

const settings = [{ label: 'Logout' }];

const ProfileButton = () => {
  const theme = useTheme();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <CoreIconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.15) }}>
            C
          </Avatar>
        </CoreIconButton>
      </Tooltip>
      <CoreMenu
        id="menu-appbar"
        sx={{ mt: 2 }}
        options={settings}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        anchorEl={anchorElUser}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      />
    </Box>
  );
};

export default ProfileButton;
