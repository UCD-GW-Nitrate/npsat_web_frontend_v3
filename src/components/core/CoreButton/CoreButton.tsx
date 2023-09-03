import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import React from 'react';

export interface CoreButtonProps extends ButtonProps {
  label: string;
}

export const CoreButton = ({ label, ...rest }: CoreButtonProps) => (
  <Button {...rest}>{label}</Button>
);
