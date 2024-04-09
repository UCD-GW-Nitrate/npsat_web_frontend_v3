import { Typography } from 'antd';
import type { PropsWithChildren } from 'react';
import React from 'react';

export interface StandardTextProps extends PropsWithChildren {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body1';
  color?: 'normal' | 'description';
}

export const StandardText = ({
  color,
  variant,
  children,
}: StandardTextProps) => {
  const textColor = color === 'normal' ? 'black' : 'grey';
  if (variant === 'h1') {
    return <Typography.Title color={textColor}>{children}</Typography.Title>;
  }
  if (variant === 'h2') {
    return (
      <Typography.Title color={textColor} level={2}>
        {children}
      </Typography.Title>
    );
  }
  if (variant === 'h3') {
    return (
      <Typography.Title color={textColor} level={3}>
        {children}
      </Typography.Title>
    );
  }
  if (variant === 'h4') {
    return (
      <Typography.Title color={textColor} level={4}>
        {children}
      </Typography.Title>
    );
  }
  if (variant === 'h5') {
    return (
      <div style={{ marginTop: 16 }}>
        <Typography.Text color={textColor} strong>
          {children}
        </Typography.Text>
      </div>
    );
  }

  return (
    <div>
      <Typography.Text color={textColor}>{children}</Typography.Text>
    </div>
  );
};
