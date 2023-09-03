import type { IconButtonProps } from '@mui/material';
import { IconButton } from '@mui/material';
import React from 'react';

export interface CoreIconButtonProps extends IconButtonProps {}

export const CoreIconButton = ({ children, ...rest }: CoreIconButtonProps) => (
  <IconButton {...rest}>{children}</IconButton>
);
