import type { ContainerProps } from '@mui/material';
import { Container } from '@mui/material';
import React from 'react';

export interface CoreContainerProps extends ContainerProps {}

export const CoreContainer = ({ ...rest }: CoreContainerProps) => (
  <Container {...rest} />
);
