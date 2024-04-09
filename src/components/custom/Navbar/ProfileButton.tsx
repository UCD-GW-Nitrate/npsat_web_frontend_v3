import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { Avatar } from 'antd';
import React from 'react';

const ProfileButton = () => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenUserMenu = (
    e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined,
  ) => {
    if (e) {
      setAnchorElUser(e.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <Avatar size="large" onClick={handleOpenUserMenu}>
          C
        </Avatar>
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
          <Avatar>C</Avatar>
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
