import type { MenuProps } from '@mui/material';
import {
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import React from 'react';

interface CoreMenuOption {
  icon?: ReactNode;
  label: string;
}

export interface CoreMenuProps extends MenuProps {
  options: CoreMenuOption[];
}

export const CoreMenu = ({ options, ...rest }: CoreMenuProps) => (
  <Menu
    slotProps={{
      paper: {
        style: {
          width: 230,
        },
      },
    }}
    {...rest}
  >
    <MenuList sx={{ padding: 0 }}>
      {options.map(({ icon, label }: CoreMenuOption) => (
        <MenuItem key={label}>
          {icon && <ListItemIcon color="inherit">{icon}</ListItemIcon>}
          <Typography>{label}</Typography>
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);
