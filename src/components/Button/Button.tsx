import type { ButtonProps as MuiButtonProps } from '@mui/material';
import { Button as MuiButton } from '@mui/material';
import React from 'react';

export interface ButtonProps extends MuiButtonProps {
  label: string;
}

export const Button = ({ label, ...rest }: ButtonProps) => (
  <MuiButton {...rest}>{label}</MuiButton>
);
