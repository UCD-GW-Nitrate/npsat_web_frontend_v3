import type { TypographyProps } from '@mui/material';
import { Typography } from '@mui/material';
import React from 'react';

export interface CoreTextProps extends TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body1';
  color?: 'normal' | 'description';
  paragraph?: boolean;
}

export const CoreText = ({
  color,
  variant,
  paragraph,
  ...rest
}: CoreTextProps) => {
  let marginTop = 0;
  let marginBottom = 0;
  if (variant === 'h2') {
    marginTop = 4;
  } else if (variant === 'h3') {
    marginTop = 2;
  }
  if (paragraph) {
    marginBottom = 2;
  }

  return (
    <Typography
      color={color === 'description' ? 'grey' : 'black'}
      sx={{ mt: marginTop, mb: marginBottom }}
      variant={variant}
      {...rest}
    />
  );
};
