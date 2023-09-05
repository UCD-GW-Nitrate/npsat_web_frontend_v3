import { Box } from '@mui/material';
import React from 'react';

import { CoreButton, type CoreButtonProps } from '../CoreButton/CoreButton';
import type { CoreMenuOption } from '../CoreMenu/CoreMenu';
import { CoreMenu } from '../CoreMenu/CoreMenu';

export interface CoreMenuButtonProps extends CoreButtonProps {
  options: CoreMenuOption[];
}

export const CoreMenuButton = ({ options, ...rest }: CoreMenuButtonProps) => {
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
    <Box>
      <CoreButton onClick={handleOpenUserMenu} {...rest} />
      <CoreMenu
        id="menu-appbar"
        sx={{ mt: 0.5 }}
        options={options ?? []}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
        anchorEl={anchorElUser}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      />
    </Box>
  );
};
