import type { BoxProps } from '@mui/material';
import { Box, TextField } from '@mui/material';
import React from 'react';

export interface CoreTextFieldProps extends BoxProps {
  value?: unknown;
  onTextChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
}

export const CoreTextField = ({
  value,
  onTextChange,
  sx,
  ...rest
}: CoreTextFieldProps) => (
  <Box sx={{ width: 200, ...sx }} {...rest}>
    <TextField size="small" onChange={onTextChange} value={value} />
  </Box>
);
