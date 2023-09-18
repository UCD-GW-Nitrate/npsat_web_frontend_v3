import type { BoxProps } from '@mui/material';
import { Box, TextField } from '@mui/material';
import React from 'react';

export interface CoreTextFieldProps extends BoxProps {
  value?: unknown;
  onTextChange?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  multiline?: boolean;
}

export const CoreTextField = ({
  value,
  onTextChange,
  sx,
  multiline,
  ...rest
}: CoreTextFieldProps) => (
  <Box sx={{ minWidth: 200, ...sx }} {...rest}>
    <TextField
      sx={{ minWidth: 200, ...sx }}
      size="small"
      onChange={onTextChange}
      value={value}
      multiline={multiline ?? false}
      rows={multiline ? 4 : 1}
    />
  </Box>
);
