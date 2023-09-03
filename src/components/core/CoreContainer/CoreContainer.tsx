import type { ContainerProps } from '@mui/material';
import { Container } from '@mui/material';
import React from 'react';

export interface CoreContainerProps extends ContainerProps {}

export const CoreContainer = ({ children, ...rest }: CoreContainerProps) => (
  <Container {...rest}>{children}</Container>
);
