import LogoutIcon from '@mui/icons-material/Logout';
import {
  alpha,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

import { CoreIconButton } from '../../core/CoreIconButton/CoreIconButton';

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
      <Menu
        sx={{ mt: 2 }}
        slotProps={{
          paper: {
            style: {
              width: 150,
            },
          },
        }}
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
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mt: 2 }}>C</Avatar>
          <Typography sx={{ mt: 1, mb: 2 }}>caden</Typography>
        </Box>
        <Divider light />
        <MenuItem>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileButton;
